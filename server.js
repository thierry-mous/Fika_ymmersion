const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const authRoutes = require('./backend/src/routes/authRoutes.js'); // Assurez-vous que le chemin est correct
const cors = require('cors');
const session = require('express-session');
const { isAuthenticated, isAdmin } = require('./middleware'); // Importer le middleware

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware pour les sessions
app.use(session({
    secret: 'votre_secret', // Changez cela pour une valeur secrète
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true si HTTPS
        httpOnly: true, // Empêche l'accès au cookie via JS côté client
        maxAge: 1000 * 60 * 60 * 24 // Durée de vie du cookie (1 jour ici)
    }
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'fika'
});

db.connect(err => {
    if (err) {
        console.error('Erreur de connexion à la base de données:', err);
        return;
    }
    console.log('Connecté à la base de données MySQL');
});

// Routes d'authentification
app.use('/api/auth', authRoutes);

// Route pour la page d'accueil
const fs = require('fs');

app.get('/index', (req, res) => {
    const isAdmin = req.session.role === 'admin';
    fs.readFile(path.join(__dirname, 'frontend/template/index.html'), 'utf8', (err, data) => {
        if (err) {
            return res.status(500).send('Erreur lors du chargement de la page');
        }
        const modifiedData = data.replace('<!-- ADMIN_LINK -->', isAdmin ? '<a href="/dashboard"><i class="fas fa-tachometer-alt"></i><span>Dashboard</span></a>' : '');
        res.send(modifiedData);
    });
});

app.get('/dashboard', isAuthenticated, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/dashboard.html'));
});

// Route pour la page de connexion
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/login.html'));
});

// Route pour la page d'inscription
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/register.html'));
});

app.get('/admin', isAuthenticated, isAdmin, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/admin.html'));
});

// Route pour le panier (protégée)
app.get('/order', isAuthenticated, (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/order.html'));
});

// Route pour le formulaire d'inscription
app.get('/form_register', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/form_register.html'));
});

app.post('/form_register', (req, res) => {
    const { email, password } = req.body;
    const checkEmailSql = 'SELECT * FROM utilisateurs WHERE email = ?';
    const insertUserSql = 'INSERT INTO utilisateurs (email, mot_de_passe) VALUES (?, ?)';

    db.query(checkEmailSql, [email], (err, results) => {
        if (err) {
            return res.status(500).send(`
                <p style="color:red;">Une erreur est survenue. Veuillez réessayer plus tard.</p>
                <a href="/form_register">Retour au formulaire</a>
            `);
        }
        if (results.length > 0) {
            // Email déjà utilisé : on renvoie le formulaire avec un message d'erreur
            return res.send(`
                <!DOCTYPE html>
                <html lang="fr">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>FIKA - Créer un compte</title>
                    <link rel="stylesheet" href="../asset/css/form_register.css">
                </head>
                <body>
                    <main>
                        <form id="form-register" action="/form_register" method="POST">
                            <label for="email">Email:</label>
                            <input type="email" id="email" name="email" required value="${email}">
                            <label for="password">Mot de passe:</label>
                            <input type="password" id="password" name="password" required>
                            <button type="submit">S'inscrire</button>
                        </form>
                        <p style="color:red;">Email déjà utilisé</p>
                        <p>Déjà un compte ? <a href="/login">Connectez-vous ici</a></p>
                    </main>
                </body>
                </html>
            `);
        } else {
            // Insérer l'utilisateur et rediriger vers la connexion
            db.query(insertUserSql, [email, password], (err, result) => {
                if (err) {
                    return res.status(500).send(`
                        <p style="color:red;">Une erreur est survenue. Veuillez réessayer plus tard.</p>
                        <a href="/form_register">Retour au formulaire</a>
                    `);
                }
                res.redirect('/login');
            });
        }
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    const query = 'SELECT * FROM utilisateurs WHERE email = ? AND mot_de_passe = ?';

    db.query(query, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur de base de données' });
        }
        if (results.length > 0) {
            // Connexion réussie, stocker les informations de l'utilisateur dans la session
            req.session.userId = results[0].id;
            req.session.email = results[0].email;
            req.session.role = results[0].role;

            // Envoyer un cookie de session
            res.redirect('/index'); // Rediriger vers la page d'accueil
        } else {
            res.status(401).send('Identifiants incorrects. Veuillez réessayer.');
        }
    });
});

app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) {
            return res.redirect('/index'); // Rediriger en cas d'erreur
        }
        res.clearCookie('connect.sid'); // Supprime le cookie de session (nom par défaut d'express-session)
        res.redirect('/login'); // Rediriger vers la page de connexion
    });
});

// Route pour la page de profil
app.get('/profile', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    const query = 'SELECT nom, prenom FROM utilisateurs WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération des informations utilisateur');
        }
        if (results.length > 0) {
            const { nom, prenom } = results[0];
            res.json({ nom, prenom });
        } else {
            res.status(404).send('Utilisateur non trouvé');
        }
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});