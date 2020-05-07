const express = require('express');
const router = express.Router();

const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

const sauceCtrl = require('../controllers/sauce');

router.put('/:id', sauceCtrl.editSauce);
router.post('/', auth, multer, sauceCtrl.createSauce);
router.post('/:id/like', sauceCtrl.likeSauce);
router.get('/', auth, sauceCtrl.getAllSauces);
router.get('/:id', sauceCtrl.getOneSauce);
router.delete('/:id', sauceCtrl.deleteSauce);

module.exports = router;