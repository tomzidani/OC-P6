// Importation des packages
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Création du schéma des utilisateurs
const userSchema = new mongoose.Schema({
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true }
});

// Permet de s'assurer qu'aucun des deux
// utilisateurs ne partageront la même adresse e-mail
userSchema.plugin(uniqueValidator);

// Exportation du modèle d'utilisateur
module.exports = mongoose.model('User', userSchema);