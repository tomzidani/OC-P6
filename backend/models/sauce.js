// Importation des packages
const mongoose = require('mongoose');

// Création du schéma des sauces
const sauceSchema = new mongoose.Schema({
	userId: { type: String, required: true },
	name: { type: String, required: true },
	manufacturer: { type: String, required: true },
	description: { type: String, required: true },
	mainPepper: { type: String, required: true },
	imageUrl: { type: String, required: true },
	heat: { type: Number, required: true },
	likes: { type: Number },
	dislikes: { type: Number },
	usersLiked: { type: [String] },
	usersDisliked: { type: [String] }
});

// Exportation du modèle de Sauce
module.exports = mongoose.model('Sauce', sauceSchema);