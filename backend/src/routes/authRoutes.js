const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/form_register', authController.form_register);
//router.post('/admin', authController.admin);
router.post('/index', authController.index);
router.post('/add-dish', authController.addDish);

module.exports = router;
    