const { Pool } = require("pg");

const pool = new Pool({
    database: 'todo_app',
    port: 5432,
    host: 'localhost',
    user: 'todo_user',
    password: 'Ak47@kissu11@',
});

module.exports = pool;
