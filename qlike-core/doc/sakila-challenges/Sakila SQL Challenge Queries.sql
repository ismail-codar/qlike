use sakila;

-- 1. List all actors.
SELECT *
FROM actor;

-- 2. Find the surname of the actor with the forename 'John'.
SELECT last_name
FROM actor
WHERE first_name = "John";

-- 3. Find all actors with surname 'Neeson'.
SELECT *
FROM actor
WHERE last_name = "Neeson";

-- 4. Find all actors with ID numbers divisible by 10.
SELECT *
FROM actor
WHERE MOD(actor_id,10) = 0;

-- 5. What is the description of the movie with an ID of 100?
SELECT description
FROM film
WHERE film_id = 100;

-- 6. Find every R-rated movie.
SELECT * 
FROM film
WHERE rating = "R";

-- 7. Find every non-R-rated movie
SELECT * 
FROM film
WHERE rating != "R";

-- 8. Find the ten shortest movies.
SELECT * 
FROM film
ORDER BY length ASC
LIMIT 10;

-- 9. Find the movies with the longest runtime, without using LIMIT.
SELECT *
FROM film
WHERE length =(
SELECT MAX(LENGTH)
FROM film
);

-- 10. Find all movies that have deleted scenes.
SELECT * 
FROM film
WHERE special_features LIKE "%Deleted Scenes%";

-- 11. Using HAVING, reverse-alphabetically list the last names that are not repeated.
SELECT last_name
FROM actor
GROUP BY last_name HAVING COUNT(last_name)=1;

-- 12. Using HAVING, list the last names that appear more than once, from highest to lowest frequency.
SELECT last_name, count(last_name)
from actor
GROUP BY last_name HAVING COUNT(last_name) >1
ORDER BY count(last_name) DESC;

-- 13. Which actor has appeared in the most films?
SELECT first_name, last_name, count(film_actor.actor_id)
FROM actor
JOIN film_actor ON film_actor.actor_id = actor.actor_id
GROUP BY film_actor.actor_id
ORDER BY count(film_actor.actor_id) DESC;

-- 14. When is 'Academy Dinosaur' due?
SELECT *
FROM rental
WHERE inventory_id IN (
 SELECT inventory_id
 FROM inventory
 JOIN film ON film.film_id = inventory.film_id
 WHERE inventory.film_id =(
	SELECT film_id
    FROM film
    WHERE title = "ACADEMY DINOSAUR"
 )
);

-- 15. What is the average runtime of all films?
SELECT AVG(length)
FROM film;

-- 16. List the average runtime for every film category.
SELECT category.name, AVG(film.length)
FROM film
INNER JOIN film_category 
ON film_category.film_id = film.film_id
INNER JOIN category
on category.category_id = film_category.category_id
GROUP BY category.name;

-- 17. List all movies featuring a robot.
SELECT title
FROM film
WHERE description LIKE "%robot%";

-- 18. List all movies released in 2010.
SELECT COUNT(title)
FROM film
WHERE release_year = 2010;

-- 19. Find the titles of all the horror movies.
SELECT title
FROM film
INNER JOIN film_category 
ON film_category.film_id = film.film_id
INNER JOIN category
on category.category_id = film_category.category_id
WHERE category.name = "Horror";

-- 20. List the full name of the staff member with the ID of 2.
SELECT first_name, last_name
FROM staff
WHERE staff_id = 2;

-- 21. List all the movies that Fred Costner has appeared in.
SELECT title
FROM film
INNER JOIN film_actor
ON film_actor.film_id = film.film_id
INNER JOIN actor
ON actor.actor_id = film_actor.actor_id
WHERE actor.first_name = "Fred" AND actor.last_name = "Costner";

-- 22. How many distinct countries are there?
SELECT COUNT(DISTINCT country)
FROM country;

-- 23. List the name of every language in reverse-alphabetical order.
SELECT name 
FROM language
ORDER BY name DESC;

-- 24. List the full names of every actor whose surname ends with '-son' in alphabetical order by their forename.
SELECT first_name, last_name
FROM actor
WHERE last_name LIKE "%son"
ORDER BY first_name ASC;

-- 25. Which category contains the most films?
SELECT name, COUNT(film_category.film_id)
FROM category
JOIN film_category
ON film_category.category_id = category.category_id
GROUP BY name
ORDER BY COUNT(film_category.film_id) DESC
LIMIT 1;

