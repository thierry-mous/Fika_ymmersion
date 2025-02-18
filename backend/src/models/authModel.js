const User = require('./userModel');
const jwt = require('jsonwebtoken');

class AuthModel {
    async createUser(userData) {
        try {
            const existingUser = await User.findOne({ email: userData.email });
            if (existingUser) {
                throw new Error('Cet email est déjà utilisé');
            }

            const user = new User(userData);
            await user.save();

            const token = this.generateToken(user._id);

            return {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (error) {
            throw error;
        }
    }

    async loginUser(email, password) {
        try {
            const user = await User.findOne({ email });
            if (!user) {
                throw new Error('Email ou mot de passe incorrect');
            }

            const isValidPassword = await user.comparePassword(password);
            if (!isValidPassword) {
                throw new Error('Email ou mot de passe incorrect');
            }

            const token = this.generateToken(user._id);

            return {
                token,
                user: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            };
        } catch (error) {
            throw error;
        }
    }

    generateToken(userId) {
        return jwt.sign(
            { userId: userId },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );
    }
}

module.exports = new AuthModel();