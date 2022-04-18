import { API_KEY, API_URL, CRON_STRING, DATABASE_CONFIG, PORT, TOP_MOVIES_SIZE } from "src/utils/constants"

export default () => ({
    [PORT]: 8080,
    [DATABASE_CONFIG]: {
        user: 'admin',
        host: 'db',
        database: 'tmdb',
        password: 'secret',
        port: 5432,
    },
    [API_URL]: 'https://api.themoviedb.org/3/',
    [API_KEY]: '',
    [TOP_MOVIES_SIZE]: 1200,
    [CRON_STRING]: '45 * * * * *'

})