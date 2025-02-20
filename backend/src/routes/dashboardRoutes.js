// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const platController = require('../controllers/platController');

// Route pour récupérer un plat spécifique
router.get('/plats/:id', platController.getPlat);

// Route pour modifier un plat
router.post('/plats/modifier', platController.modifierPlat);

// Route pour ajouter un plat
router.post('/ajouter-plat', platController.ajouterPlat);

module.exports = router;
