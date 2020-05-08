// Importation des packages
const express = require('express');
const router = express.Router();

// Importation des controllers
const userCtrl = require('../controllers/user');

// Définition des routes
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);

// Exportation des routes
module.exports = router;