const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const authRoutes = require('./backend/src/routes/authRoutes'); // Assurez-vous que le chemin est correct
const cors = require('cors');
const session = require('express-session');

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
    saveUninitialized: true,
    cookie: { secure: false } // Mettez à true si vous utilisez HTTPS
}));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'votre_nom_utilisateur',
    password: 'votre_mot_de_passe',
    database: 'votre_nom_base_de_donnees'
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
            // Connexion réussie, rediriger vers la page d'accueil
            req.session.errorMessage = null; // Réinitialiser le message d'erreur
            res.redirect('/index'); // Remplacez par votre page d'accueil
        } else {
            // Identifiants incorrects, rediriger vers la page de connexion avec un message d'erreur
            req.session.errorMessage = 'Identifiants incorrects. Veuillez réessayer.';
            res.redirect('/login');
        }
    });
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/index.html'));
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
}); 