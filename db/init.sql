DROP DATABASE IF EXISTS tmdb;    

CREATE DATABASE tmdb;    

\c tmdb;        

CREATE TABLE Genre(
    tmdb_id integer primary key,
    name varchar(255)
);    
CREATE TABLE Director(
    tmdb_id integer primary key,
    name varchar(255)
);    
CREATE TABLE Person (
    director_id integer references Director(tmdb_id),
    biography text,
    date_of_birth DATE
);
CREATE TABLE Movie(
    tmdb_id integer primary key,
    title varchar(255),
    genre_ids  integer[],
    director_ids integer[],
    runtime integer,
    release_date DATE,
    overview text,
    poster_path varchar(255),
    url varchar(255)
);
CREATE TABLE Vote(
    movie_id integer references Movie(tmdb_id),
    vote_count integer,
    vote_average real
);
  