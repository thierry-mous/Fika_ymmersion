const mysql = require('mysql');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fika'
});

connection.connect((err) => {
    if (err) {
        console.log('Error connecting to database:', err);
        return;
    }
    console.log('Connection established');

    connection.query('SELECT 1 + 1 AS solution', (err, results, fields) => {
        if (err) {
            console.log('Error executing test query:', err);
            return;
        }
        console.log('Test query result:', results[0].solution)
    });
});

module.exports = connection;