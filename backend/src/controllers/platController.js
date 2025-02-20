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

const modifierPlat = (req, res) => {
    const { id, nom, description, prix, categorie, image } = req.body;

    if (!id || !nom || !description || !prix || !categorie) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    platModel.modifierPlat(id, nom, description, prix, categorie, image, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Une erreur est survenue lors de la modification du plat' });
        }
        res.status(200).json({ message: 'Plat modifié avec succès' });
    });
};

// Exporter les deux fonctions dans un seul objet
module.exports = {
    ajouterPlat,
    modifierPlat
};


