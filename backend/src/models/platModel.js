// models/platModel.js

const db = require('../config/database.js');  // Assurez-vous d'importer votre configuration de connexion à la base de données

// Fonction pour ajouter un plat dans la base de données
const ajouterPlat = (nom, description, prix, categorie, image, callback) => {
    const query = 'INSERT INTO plats (nom, description, prix, categorie, image) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nom, description, prix, categorie, image], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

const modifierPlat = (id, nom, description, prix, categorie, image, callback) => {
    const query = 'UPDATE plats SET nom = ?, description = ?, prix = ?, categorie = ?, image = ? WHERE id = ?';
    db.query(query, [nom, description, prix, categorie, image, id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result);
    });
};

module.exports = {
    ajouterPlat,
    modifierPlat
};

