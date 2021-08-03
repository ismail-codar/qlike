// https://github.com/hyurl/better-sqlite-pool/blob/master/index.js

import EventEmitter from 'events';

const releaseEvent = 'release';

export class Pool extends EventEmitter {
  private _closed: boolean = false;
  connections: any[] = [];
  max: number = 5;
  timeout: number = 5000;
  onConnectionCreated: (conn: any) => void;
  _rawCreateConnection: () => any;

  constructor(rawCreateConnection: () => any) {
    super();
    this._rawCreateConnection = rawCreateConnection;
  }

  acquire() {
    if (this._closed) {
      throw new Error('Database already closed');
    }
    return (
      this._getAvailableConnection() ||
      this._createConnection() ||
      this._waitConnection()
    );
  }

  _getAvailableConnection() {
    for (let conn of this.connections) {
      if (conn.available && conn.open) {
        conn.available = false;
        return Promise.resolve(conn);
      }
    }
    return false;
  }

  _createConnection() {
    if (this.connections.length < this.max) {
      let conn = this._rawCreateConnection();

      conn.available = false;
      conn.release = () => {
        if (conn.open && conn.inTransaction) conn.exec('rollback');

        if (this._closed) {
          conn.close();
        } else {
          conn.available = conn.open && true;
          this.emit(releaseEvent);
        }
      };

      if (this.onConnectionCreated) {
        this.onConnectionCreated(conn);
      }

      this.connections.push(conn);
      return Promise.resolve(conn);
    }
    return false;
  }

  _waitConnection() {
    return new Promise((resolve, reject) => {
      let handler = () => {
        clearTimeout(timer);
        resolve(this.acquire());
      };
      let timer = setTimeout(() => {
        this.removeListener(releaseEvent, handler);
        reject(new Error('Timeout to acquire the connection.'));
      }, this.timeout);

      this.once(releaseEvent, handler);
    });
  }

  close() {
    this._closed = true;
    for (let id in this.connections) {
      const conn = this.connections[id];
      if (conn.available && conn.open) {
        conn.close();
      }
    }
  }
}
