// routes/dashboardRoutes.js

const express = require('express');
const router = express.Router();
const platController = require('../controllers/platController');

// Route protégée pour ajouter un plat, accessible uniquement par un admin
router.post('/ajouter-plat', platController.ajouterPlat);

module.exports = router;
