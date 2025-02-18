const db = require('../config/db'); // Assurez-vous que le chemin est correct

class User {
    static create(userData, callback) {
        const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
        db.query(sql, [userData.email, userData.password], (err, result) => {
            if (err) {
                return callback(err);
            }
            callback(null, result.insertId);
        });
    }
}

module.exports = User;
