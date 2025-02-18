const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'your_database'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});

app.post('/api/dishes', (req, res) => {
    const { name, description, price } = req.body;
    const image = req.files.image;

    const sql = 'INSERT INTO dishes (name, description, price, image) VALUES (?, ?, ?, ?)';
    db.query(sql, [name, description, price, image], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: 'Dish added', id: result.insertId });
    });
}); 