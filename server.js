const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2');
const path = require('path');
const authRoutes = require('./backend/src/routes/authRoutes'); // Assurez-vous que le chemin est correct

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
    const sql = 'SELECT * FROM utilisateurs WHERE email = ? AND mot_de_passe = ?';

    db.query(sql, [email, password], (err, results) => {
        if (err) {
            return res.status(500).json({ error: err });
        }
        if (results.length > 0) {
            // Utilisateur trouvé, rediriger vers la page d'accueil
            res.redirect('/index');
        } else {
            // Utilisateur non trouvé, renvoyer à la page de connexion avec un message d'erreur
            res.status(401).send('Email ou mot de passe incorrect');
        }
    });
});

app.get('/index', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/index.html'));
});


// Démarrer le serveur
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
}); 