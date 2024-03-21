const mysql = require('mysql');

const pool = mysql.createPool({
    host: 'localhost',
    user: 'snippet_user',
    password: '1234',
    database: 'code_snippets_db',
});

module.exports = pool;
