const mysql = require('mysql2');
const db = require('../config/database'); // Assurez-vous que ce fichier existe et configure la connexion

const User = {
    create: (userData, callback) => {
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(sql, [userData.email, userData.password], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result.insertId);
        });
    }
};

module.exports = User;
