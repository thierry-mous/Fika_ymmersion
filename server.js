const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql');
const path = require('path');
const authRoutes = require('./backend/src/routes/authRoutes.js');
const dashboardRoutes = require('./backend/src/routes/dashboardRoutes.js'); 
const cors = require('cors');
const multer = require('multer');
const session = require('express-session');
const { isAuthenticated, isAdmin } = require('./middleware');
const fs = require('fs');

const app = express();
const port = 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'frontend')));
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
    secret: 'votre_secret',
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: false, // true si HTTPS
        httpOnly: true, // Empêche l'accès au cookie via JS côté client
        maxAge: 1000 * 60 * 60 * 24
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

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes d'authentification
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/template/index', (req, res) => {
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

app.get('/menu', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/menu.html'));
});

app.get('/category', (req, res) => {
    res.sendFile(path.join(__dirname, 'frontend/template/category.html'));
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
                        <p>Déjà un compte ? <a href="/login">Connectez-vous ici</a>
                    </main>
                </body>
                </html>
            `);
        } else {
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
            req.session.userId = results[0].id;
            req.session.email = results[0].email;
            req.session.role = results[0].role;

            res.redirect('/template/index');
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


app.post('/dashboard', upload.single('image'), (req, res, next) => {
    const { nom, description, prix, categorie_id } = req.body;
    const image = req.file ? req.file.filename : null;

    // Vérification des données
    if (!nom || !description || !prix || !categorie_id || !image) {
        return res.status(400).send('Tous les champs sont obligatoires');
    }

    const query = 'INSERT INTO plats (nom, description, prix, categorie_id, image) VALUES (?, ?, ?, ?, ?)';

    db.query(query, [nom, description, prix, categorie_id, image], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err); // Afficher l'erreur SQL complète
            return next(err); // Passer l'erreur au middleware de gestion des erreurs
        }
        res.redirect('/dashboard'); // Rediriger vers le tableau de bord après l'ajout réussi
    });
});


app.get('/api/plats', (req, res) => {
    const query = 'SELECT * FROM plats';

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur lors de la récupération des plats');
        }
        res.json(results);
    });
});

// Route pour la page de profil
app.get('/profile', isAuthenticated, (req, res) => {
    const userId = req.session.userId;
    const query = 'SELECT nom, prenom, email FROM utilisateurs WHERE id = ?';

    db.query(query, [userId], (err, results) => {
        if (err) {
            return res.status(500).send('Erreur lors de la récupération des informations utilisateur');
        }
        if (results.length > 0) {
            const { nom, prenom, email } = results[0];
            res.json({ nom, prenom, email });
        } else {
            res.status(404).send('Utilisateur non trouvé');
        }
    });
});

app.get('/api/plats/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM plats WHERE id = ?';

    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).send('Erreur lors de la récupération du plat');
        }
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).send('Plat non trouvé');
        }
    });
});

app.delete('/api/cart/delete/:id', (req, res) => {
    const { id } = req.params;
    const userId = req.session.userId;

    console.log("suppression du plat");
    console.log(id);
    console.log(userId);

    if (!userId) {
        return res.status(401).json({ message: 'Vous devez être connecté pour supprimer un plat du panier' });
    }

    const query = 'DELETE FROM panier WHERE plat_id = ? AND utilisateur_id = ?';

    db.query(query, [id, userId], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de la suppression du plat du panier' });
        }
        res.status(200).json({ message: 'Plat supprimé du panier', result: result });
    });
});


app.post('/api/cart', (req, res) => {
    const { id } = req.body;
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Vous devez être connecté pour ajouter un plat au panier' });
    }

    const query = 'INSERT INTO panier (utilisateur_id, plat_id, quantite) VALUES (?, ?, 1)';

    db.query(query, [userId, id], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de l\'ajout au panier' });
        }
        res.status(200).json({ message: 'Plat ajouté au panier' });
    });
});

app.get('/api/cart', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Vous devez être connecté pour voir votre panier' });
    }

    const query = `
        SELECT p.id, p.nom, p.description, p.prix, p.image, c.quantite
        FROM panier c
        JOIN plats p ON c.plat_id = p.id
        WHERE c.utilisateur_id = ?
    `;

    db.query(query, [userId], (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
        }
        res.json(results);
    });
});

app.post('/api/order', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Vous devez être connecté pour passer une commande' });
    }

    const getCartQuery = `
        SELECT plat_id, quantite, prix
        FROM panier
        JOIN plats ON panier.plat_id = plats.id
        WHERE utilisateur_id = ?
    `;

    db.query(getCartQuery, [userId], (err, cartItems) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Votre panier est vide' });
        }

        const total = cartItems.reduce((sum, item) => sum + item.prix * item.quantite, 0);

        const createOrderQuery = `
            INSERT INTO commandes (utilisateur_id, total)
            VALUES (?, ?)
        `;

        db.query(createOrderQuery, [userId, total], (err, result) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).json({ message: 'Erreur lors de la création de la commande' });
            }

            const orderId = result.insertId;

            const createOrderDetailsQuery = `
                INSERT INTO details_commande (commande_id, plat_id, quantite)
                VALUES ?
            `;

            const orderDetails = cartItems.map(item => [orderId, item.plat_id, item.quantite]);

            db.query(createOrderDetailsQuery, [orderDetails], (err) => {
                if (err) {
                    console.error('Erreur SQL:', err);
                    return res.status(500).json({ message: 'Erreur lors de la création des détails de la commande' });
                }

                const clearCartQuery = `
                    DELETE FROM panier
                    WHERE utilisateur_id = ?
                `;

                db.query(clearCartQuery, [userId], (err) => {
                    if (err) {
                        console.error('Erreur SQL:', err);
                        return res.status(500).json({ message: 'Erreur lors de la suppression du panier' });
                    }

                    res.status(200).json({ message: 'Commande passée avec succès' });
                });
            });
        });
    });
});

app.post('/api/order', (req, res) => {
    const userId = req.session.userId;

    if (!userId) {
        return res.status(401).json({ message: 'Vous devez être connecté pour passer une commande' });
    }

    const getCartQuery = `
        SELECT plat_id, quantite, prix
        FROM panier
        JOIN plats ON panier.plat_id = plats.id
        WHERE utilisateur_id = ?
    `;

    db.query(getCartQuery, [userId], (err, cartItems) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération du panier' });
        }

        if (cartItems.length === 0) {
            return res.status(400).json({ message: 'Votre panier est vide' });
        }

        const total = cartItems.reduce((sum, item) => sum + item.prix * item.quantite, 0);

        const createOrderQuery = `
            INSERT INTO commandes (utilisateur_id, total)
            VALUES (?, ?)
        `;

        db.query(createOrderQuery, [userId, total], (err, result) => {
            if (err) {
                console.error('Erreur SQL:', err);
                return res.status(500).json({ message: 'Erreur lors de la création de la commande' });
            }

            const orderId = result.insertId;

            const createOrderDetailsQuery = `
                INSERT INTO details_commande (commande_id, plat_id, quantite)
                VALUES ?
            `;

            const orderDetails = cartItems.map(item => [orderId, item.plat_id, item.quantite]);

            db.query(createOrderDetailsQuery, [orderDetails], (err) => {
                if (err) {
                    console.error('Erreur SQL:', err);
                    return res.status(500).json({ message: 'Erreur lors de la création des détails de la commande' });
                }

                const clearCartQuery = `
                    DELETE FROM panier
                    WHERE utilisateur_id = ?
                `;

                db.query(clearCartQuery, [userId], (err) => {
                    if (err) {
                        console.error('Erreur SQL:', err);
                        return res.status(500).json({ message: 'Erreur lors de la suppression du panier' });
                    }

                    const createHistoryQuery = `
                        INSERT INTO historique_commandes (commande_id, utilisateur_id, total)
                        VALUES (?, ?, ?)
                    `;

                    db.query(createHistoryQuery, [orderId, userId, total], (err) => {
                        if (err) {
                            console.error('Erreur SQL:', err);
                            return res.status(500).json({ message: 'Erreur lors de l\'enregistrement de l\'historique de la commande' });
                        }

                        res.status(200).json({ message: 'Commande passée avec succès' });
                    });
                });
            });
        });
    });
});

app.get('/api/order-history', (req, res) => {
    const query = `
        SELECT hc.id, hc.date_commande, hc.total, p.nom, p.prix, dc.quantite
        FROM historique_commandes hc
        JOIN details_commande dc ON hc.commande_id = dc.commande_id
        JOIN plats p ON dc.plat_id = p.id
        ORDER BY hc.date_commande DESC
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération de l\'historique des commandes' });
        }
        res.json(results);
    });
});



    app.get('/api/categories', (req, res) => {
    const query = 'SELECT * FROM categories';
    
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ error: 'Erreur lors de la récupération des catégories' });
        }
        res.json(results);
    });
});

app.get('/api/promotions', (req, res) => {
    const query = `
        SELECT id, nom, description, prix, image, promotion
        FROM plats
        WHERE promotion > 0
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération des promotions' });
        }
        res.json(results);
    });
});



// Middleware pour gérer les erreurs
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Quelque chose a mal tourné!');
});

app.get('/category/:id', (req, res) => {
    const categoryId = req.params.id;
    if (!categoryId) {
        return res.status(400).send('Le paramètre "category" est manquant');
      }
    
      // Requête SQL pour récupérer la catégorie
      const sql = 'SELECT * FROM categories WHERE id = ?';
      db.query(sql, [categoryId], (err, results) => {
        if (err) {
          console.error('Erreur lors de l\'exécution de la requête SQL :', err);
          return res.status(500).send('Erreur interne du serveur');
        }
    
        // Vérification si la catégorie existe
        if (results.length === 0) {
          return res.status(404).send('Catégorie non trouvée');
        }
    
        // Envoyer les résultats en JSON
        res.json(results);
      });
});

app.get('/api/random-plat', (req, res) => {
    const query = `
        SELECT id, nom, description, prix, image
        FROM plats
        ORDER BY RAND()
        LIMIT 1
    `;

    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération du plat du jour' });
        }
        res.json(results[0]);
    });
});


app.get('/categories-dishes/:id', (req, res) => {
    const categoryId = req.params.id;
    
    console.log(categoryId);
    // Vérification du paramètre
    if (!categoryId) {
      return res.status(400).send('Le paramètre "category" est manquant');
    }
  
    // Requête SQL pour récupérer la catégorie
    const sql = 'SELECT * FROM plats WHERE categorie_id = ?';
    db.query(sql, [categoryId], (err, results) => {
      if (err) {
        console.error('Erreur lors de l\'exécution de la requête SQL :', err);
        return res.status(500).send('Erreur interne du serveur');
      }
  
      // Vérification si la catégorie existe
      if (results.length === 0) {
        return res.status(404).send('Catégorie non trouvée');
      }
  
      // Envoyer les résultats en JSON
      res.json(results);
    });
  });

  app.get('/api/commande', (req, res) => {
    const query = `
        SELECT c.date_commande, c.id AS commande_id, 
               dc.quantite, p.nom AS plat_nom, p.prix AS plat_prix, p.image AS plat_image
        FROM commandes c
        JOIN details_commande dc ON c.id = dc.commande_id
        JOIN plats p ON dc.plat_id = p.id
        WHERE c.statut = "en cours"
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return res.status(500).json({ message: 'Erreur lors de la récupération des commandes' });
        }
        res.json(results);
    });
});

// Démarrer le serveur
app.listen(port, () => {
    console.log(`Serveur en cours d'exécution sur http://localhost:${port}`);
});
