const AuthModel = require('../models/authModel');

class AuthController {
    async register(req, res) {
        try {
            const { email, password, name } = req.body;
            
            const result = await AuthModel.createUser({ email, password, name });

            res.status(201).json({
                success: true,
                message: 'Utilisateur créé avec succès',
                ...result
            });

        } catch (error) {
            res.status(error.message === 'Cet email est déjà utilisé' ? 400 : 500).json({
                success: false,
                message: error.message
            });
        }
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
}

module.exports = new AuthController();