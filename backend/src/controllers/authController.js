const AuthModel = require('../models/authModel');
const User = require('../models/userModel');
const bcrypt = require('bcrypt');

class AuthController {
    async register(req, res) {
        const { email, password } = req.body;

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            const userData = {
                email: email,
                password: hash
            };

            User.create(userData, (err, userId) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.status(201).json({ message: 'User created', userId: userId });
            });
        });
    }

    async form_register(req, res) {
        const { email, password } = req.body;

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            const userData = {
                email: email,
                password: hash
            };

            User.create(userData, (err, userId) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.status(201).json({ message: 'Utilisateur créé avec succès', userId: userId });
            });
        });
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            
            const result = await AuthModel.loginUser(email, password);

            res.json({
                success: true,
                message: 'Connexion réussie',
                ...result
            });

        } catch (error) {
            res.status(error.message.includes('incorrect') ? 401 : 500).json({
                success: false,
                message: error.message
            });
        }
    }

// Exemple de validation avec un simple test
async addDish(req, res) {
    const { dishName, dishDescription, dishPrice, dishCategory } = req.body;

    // Vérification de la présence de tous les champs nécessaires
    if (!dishName || !dishDescription || !dishPrice || !dishCategory) {
        return res.status(400).send('Tous les champs sont requis');
    }

    const insertDishSql = 'INSERT INTO plats (name, description, price, category) VALUES (?, ?, ?, ?)';

    db.query(insertDishSql, [dishName, dishDescription, dishPrice, dishCategory], (err, result) => {
        if (err) {
            // Tu peux ajouter plus de détails sur l'erreur ici si nécessaire
            return res.status(500).send(`Erreur lors de l'ajout du plat: ${err.message}`);
        }
        // Si la requête a réussi, tu peux rediriger l'utilisateur
        res.redirect('/dashboard');
    });
}

    async index(req, res) {
        res.sendFile(path.join(__dirname, 'frontend/template/index.html'));
    }

    async inscription(req, res) {
        const { email, password } = req.body;

        bcrypt.hash(password, 10, (err, hash) => {
            if (err) {
                return res.status(500).json({ error: err });
            }

            const userData = {
                email: email,
                password: hash
            };

            User.create(userData, (err, userId) => {
                if (err) {
                    return res.status(500).json({ error: err });
                }
                res.status(201).json({ message: 'Utilisateur créé avec succès', userId: userId });
            });
        });
    }
}


module.exports = new AuthController();