# tmdb-top-movies

## Setup

Set TMDB API KEY
[Config file example here](./backend/src/config/configuration.example.ts)

```
    [API_KEY]:''
```

### Build with Docker

docker-compose up --build

### Run without Docker
Modify configuration to manage to connect to your local Postgres database
```
 [DATABASE_CONFIG]: {
        user: 'admin',
        host: 'db',
        database: 'tmdb',
        password: 'secret',
        port: 5432,
    },
```
``
 cd ./backend && npm run start dev
``
or run in watch mode
``
 cd ./backend && npm run start dev -- --watch
``

#### Purpose
###### Candidate test
