// Importation des packages
const express = require('express');
const router = express.Router();

// Importation des middleware
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

// Importation des controllers
const sauceCtrl = require('../controllers/sauce');

// Définition des routes
router.put('/:id', auth, multer, sauceCtrl.editSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', auth, sauceCtrl.likeSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', auth, sauceCtrl.getOneSauce);
router.delete('/:id', auth, sauceCtrl.deleteSauce);

// Exportation des routes
module.exports = router;