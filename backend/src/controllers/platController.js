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
    const { id, nom, description, prix, categorie } = req.body;

    console.log('Données reçues:', req.body); // Ajout de log pour déboguer

    if (!id || !nom || !description || !prix || categorie === undefined) {
        return res.status(400).json({ error: 'Tous les champs sont obligatoires' });
    }

    platModel.modifierPlat(id, nom, description, prix, categorie, (err, result) => {
        if (err) {
            console.error('Erreur lors de la modification:', err); // Ajout de log pour déboguer
            return res.status(500).json({ error: 'Une erreur est survenue lors de la modification du plat' });
        }
        res.status(200).json({ message: 'Plat modifié avec succès' });
    });
};

const getPlat = (req, res) => {
    const id = req.params.id;

    if (!id) {
        return res.status(400).json({ error: 'ID du plat requis' });
    }

    platModel.getPlat(id, (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Erreur lors de la récupération du plat' });
        }
        if (!result) {
            return res.status(404).json({ error: 'Plat non trouvé' });
        }
        res.status(200).json(result);
    });
};

// Exporter les trois fonctions dans un seul objet
module.exports = {
    ajouterPlat,
    modifierPlat,
    getPlat
};


