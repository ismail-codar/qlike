use world;

-- 1. Using count, get the number of cities in the USA
SELECT COUNT(ID) 
FROM city
WHERE CountryCode = "USA";

-- 2. Find out the population, and life expectancy for people in Argentina
SELECT Population, LifeExpectancy
From country
WHERE Name = "Argentina" ;

-- 3. Using IS NOT NULL, ORDER BY and LIMIT, which country has the highest expectancy
SELECT * 
FROM country
WHERE LifeExpectancy IS NOT NULL
ORDER BY LifeExpectancy DESC
LIMIT 1;

-- 4. Using JOIN ... ON, find the capital city of Spain
SELECT city.Name
FROM city
JOIN country ON city.CountryCode = country.Code
WHERE city.id=(
	SELECT Capital
	FROM country
    WHERE Name = "Spain"
);

-- 5. Using JOIN ... ON, list all the languages spoken in the Southeast Asia region
SELECT countrylanguage.Language
FROM countrylanguage
JOIN country ON countrylanguage.CountryCode = country.Code
WHERE Region = "Southeast Asia";

-- 6. Using a single query, list 25 cities around the world that start with the letter F
SELECT city.Name
FROM city
WHERE name LIKE "F%"
LIMIT 25;

-- 7. Using COUNT and JOIN ... ON, get the number of cities in China.
SELECT COUNT(ID)
FROM city
JOIN country ON city.CountryCode = country.Code
WHERE country.Name = "China";

-- 8. Using IS NOT NULL, ORDER BY, and LIMIT, which country has the lowest population? Discard non-zero populations.
SELECT * 
FROM country
WHERE Population IS NOT NULL AND Population > 0
ORDER BY Population ASC
LIMIT 1;

-- 9. Using aggregate functions, return the number of countries the database contains.
SELECT COUNT(Code)
FROM country;

-- 10. What are the top ten largest countries by area?
SELECT country.Name
FROM country
ORDER BY SurfaceArea DESC
Limit 5; 

-- 11. List the five largest cities by population in Japan.
SELECT Name
FROM city
WHERE CountryCode = "JPN"
ORDER BY Population DESC
LIMIT 5;

-- 11. List the five largest cities by population in Japan. (Alternate Method)
SELECT city.Name
FROM city
JOIN country ON city.CountryCode = country.Code
WHERE city.CountryCode=(
	SELECT Code
	FROM country
    WHERE Name = "Japan"
)
ORDER BY city.Population DESC
LIMIT 5;

-- 12. List the names and country codes of every country with Elizabeth II as its Head of State. You will need to fix the mistake first!
UPDATE country
SET HeadOfState = "Elizabeth II"
WHERE HeadOfState = "Elisabeth II";

SELECT Name, Code
FROM country
WHERE HeadOfState = "Elizabeth II";

-- 13. List the top ten countries with the smallest population-to-area ratio. Discard any countries with a ratio of 0.
SELECT Name
FROM country 
WHERE Population/SurfaceArea != 0
ORDER BY Population/SurfaceArea ASC
Limit 10;

-- 14. List every unique world language.
SELECT DISTINCT Language 
FROM countrylanguage;

-- 15. List the names and GNP of the world's top 10 richest countries.
SELECT Name, GNP
FROM country
Order by GNP DESC
LIMIT 10;

-- 16. List the names of, and number of languages spoken by, the top ten most multilingual countries.
SELECT country.Name, Count(countrylanguage.CountryCode)
FROM country
JOIN countrylanguage ON country.Code = countrylanguage.CountryCode
GROUP BY country.Name
ORDER BY COUNT(countrylanguage.CountryCode) DESC
LIMIT 10;

-- 17. List every country where over 50% of its population can speak German.
SELECT country.Name 
FROM country
JOIN countrylanguage ON country.Code = CountryCode
WHERE countrylanguage.Percentage > 50.0 AND countrylanguage.Language = "German";

-- 18. Which country has the worst life expectancy? Discard zero or null values.
SELECT Name 
FROM country
WHERE LifeExpectancy != 0 OR LifeExpectancy != Null
ORDER BY LifeExpectancy ASC;

-- 19.List the top three most common government forms.
SELECT GovernmentForm, Count(Code)
FROM country
GROUP BY GovernmentForm
ORDER BY COUNT(Code) DESC
LIMIT 3;

-- 20. How many countries have gained independence since records began?
SELECT COUNT(Code)
FROM country
WHERE IndepYear IS NOT Null;




