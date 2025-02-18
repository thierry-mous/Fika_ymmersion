const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const authRoutes = require('./routes/authRoutes'); // Assurez-vous que le chemin est correct

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.urlencoded({ extended: true }));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fika'
});

db.connect(err => {
    if (err) {
        throw err;
    }
    console.log('MySQL Connected...');
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Routes existantes
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

// Route pour la page d'accueil
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/index.html'));
});

// Route pour la page de connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/login.html'));
});

// Route pour la page d'inscription
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/register.html'));
});

// Route pour le tableau de bord admin
app.get('/admin', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/admin.html'));
});

// Route pour le panier
app.get('/order', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/order.html'));
});

// Route pour le formulaire d'inscription
app.get('/form_register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/form_register.html'));
});

app.post('/inscription', (req, res) => {
    const { email, password } = req.body;
    const sql = 'INSERT INTO users (email, password) VALUES (?, ?)';
    
    db.query(sql, [email, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        res.status(201).json({ message: 'Utilisateur créé avec succès' });
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 