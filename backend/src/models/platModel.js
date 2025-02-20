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

const modifierPlat = (id, nom, description, prix, categorie, callback) => {
    const query = 'UPDATE plats SET nom = ?, description = ?, prix = ?, categorie_id = ? WHERE id = ?';
    db.query(query, [nom, description, prix, categorie, id], (err, result) => {
        if (err) {
            console.error('Erreur SQL:', err);
            return callback(err, null);
        }
        callback(null, result);
    });
};

const getPlat = (id, callback) => {
    const query = 'SELECT * FROM plats WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return callback(err, null);
        }
        callback(null, result[0]); // Retourne le premier résultat
    });
};

const supprimerPlat = (id, callback) => {
    const query = 'DELETE FROM plats WHERE id = ?';
    db.query(query, [id], (err, result) => {
        callback(err, result);
    });
};
module.exports = {
    ajouterPlat,
    modifierPlat,
    getPlat,
    supprimerPlat
};

