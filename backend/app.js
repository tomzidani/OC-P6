// Importation des packages
const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

// Importation des models
const User = require('./models/user');
const Sauce = require('./models/sauce');

// Importation des routes
const userRoutes = require('./routes/user');
const sauceRoutes = require('./routes/sauce');

// Définition de l'app
const app = express();

// Connexion à la base de données MongoDB
mongoose.connect('mongodb+srv://admin:admin@fullstack-iznll.mongodb.net/test?retryWrites=true&w=majority',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connection to MongoDB successful'))
  .catch(() => console.log('Connection to MongoDB failed'));

// Ajout des headers
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  next();
});

// Utilisation de l'administration de la route d'image
app.use('/images', express.static(path.join(__dirname, 'images')));

// Utilisation du body-parser sur le document
app.use(bodyParser.json());

// Utilisation des routes
app.use('/api/auth', userRoutes);
app.use('/api/sauces', sauceRoutes);

// Exportation de l'app
module.exports = app;