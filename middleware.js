// middleware.js

// Vérifie si l'utilisateur est authentifié
function isAuthenticated(req, res, next) {
    console.log("Session reçue:", req.session); // 🔍 Debug
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ message: "Non autorisé. Veuillez vous connecter." });
    }
    next();
}


// Vérifie si l'utilisateur est un administrateur
function isAdmin(req, res, next) {
    console.log("Middleware Admin - Rôle actuel :", req.session ? req.session.role : "Aucun rôle"); // 🔍 Debug

    if (req.session && req.session.role === 'admin') {
        return next();
    }

    // Si c'est un appel API (AJAX / fetch), renvoyer une réponse JSON au lieu d'une redirection
    if (req.xhr || req.headers.accept.indexOf('json') > -1) {
        return res.status(403).json({ message: "Accès refusé. Vous devez être administrateur." });
    }

    return res.redirect('/index'); // Redirige si ce n'est pas une requête AJAX
}

module.exports = { isAuthenticated, isAdmin };
