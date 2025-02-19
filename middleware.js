// middleware.js

// Vérifie si l'utilisateur est authentifié
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.status(401).send('Accès non autorisé. Veuillez vous connecter.');
    }
}

// Vérifie si l'utilisateur est un administrateur
function isAdmin(req, res, next) {
    if (req.session && req.session.role === 'admin') {
        return next();
    } else {
        res.status(403).send('Accès interdit. Vous devez être administrateur.');
    }
}

module.exports = { isAuthenticated, isAdmin };
