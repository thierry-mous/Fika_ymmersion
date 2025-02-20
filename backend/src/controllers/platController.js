// controllers/platController.js

const platModel = require('../models/platModel');

// Fonction pour gérer l'ajout d'un plat
const ajouterPlat = (req, res) => {
    const { nom, description, prix, categorie, image } = req.body;

    if (!nom || !description || !prix || !categorie || !image) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    platModel.ajouterPlat(nom, description, prix, categorie, image, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Une erreur est survenue lors de l\'ajout du plat' });
        }
        res.status(201).json({ message: 'Plat ajouté avec succès', platId: result.insertId });
    });
};

module.exports = {
    ajouterPlat
};
