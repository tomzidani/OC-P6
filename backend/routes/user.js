// Importation des packages
const express = require('express');
const router = express.Router();

// Importation des middleware
const rateLimiter = require('../middleware/rate-limiter');

// Importation des controllers
const userCtrl = require('../controllers/user');

// Définition des routes
router.post('/signup', rateLimiter, userCtrl.signup);
router.post('/login', rateLimiter, userCtrl.login);

// Exportation des routes
module.exports = router;