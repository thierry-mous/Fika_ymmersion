// middleware.js

// Vérifie si l'utilisateur est authentifié
function isAuthenticated(req, res, next) {
    if (req.session && req.session.userId) {
        return next();
    } else {
        res.redirect('/login');
    }
}

// Vérifie si l'utilisateur est un administrateur
function isAdmin(req, res, next) {
    if (req.session && req.session.role === 'admin') {
        return next();
    } else {
        res.redirect('/index');
    }
}

module.exports = { isAuthenticated, isAdmin };
