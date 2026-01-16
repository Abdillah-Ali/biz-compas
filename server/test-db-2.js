const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'biz_compass',
    port: 5432,
    // password: '', // Try explicitly empty
});

client.connect()
    .then(() => {
        console.log('Connected successfully');
        process.exit(0);
    })
    .catch(err => {
        console.error('Connection error:', err);
        process.exit(1);
    });
