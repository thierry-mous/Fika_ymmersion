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