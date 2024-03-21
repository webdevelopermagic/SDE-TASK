const db = require('../db');

const snippetModel = {};

snippetModel.createSnippet = async (username, language, stdin, code) => {
    return new Promise((resolve, reject) => {
        db.query(
            'INSERT INTO snippets (username, language, stdin, code, created_at) VALUES (?, ?, ?, ?, NOW())',
            [username, language, stdin, code],
            (error, results) => {
                if (error) {
                    reject(error);
                } else {
                    resolve({ id: results.insertId, username, language, stdin, code });
                }
            }
        );
    });
};

snippetModel.getAllSnippets = async () => {
    return new Promise((resolve, reject) => {
        db.query('SELECT id, username, language, stdin, LEFT(code, 100) AS code_preview, created_at FROM snippets', (error, results) => {
            if (error) {
                reject(error);
            } else {
                resolve(results);
            }
        });
    });
};

module.exports = snippetModel;
