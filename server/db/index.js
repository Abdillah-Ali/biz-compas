const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});

module.exports = {
    query: (text, params) => {
        console.log('Executing query:', text);
        return pool.query(text, params);
    },
};
