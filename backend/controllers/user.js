// Importation des packages
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Importation du modèle
const User = require('../models/user');

// Déclaration des regex
const emailRegex = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const passwordRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;

// Inscription de l'utilisateur
exports.signup = (req, res, next) => {

    // Si l'adresse e-mail est valide
    if (!emailRegex.test(req.body.email)) {
        return res.status(500).json({
            error: 'Please enter a valid email address'
        });
    }
    // Si le mot de passe a une sécurité moyenne
    if (!passwordRegex.test(req.body.password)) {
        return res.status(500).json({
            error: 'Password must contain 8 characters with 1 lowercase and 1 uppercase letter and 1 number'
        });
    }
    // Hash du mot de passe avec bcrypt, s'il fonctionne on créé
    // l'utilisateur, sinon on affiche l'erreur
    bcrypt.hash(req.body.password, 10)
        .then(hash => {

            // Création et sauvegarde de l'utilisateur
            const user = new User({
                email: req.body.email,
                password: hash
            });
            user.save()
                .then(() => res.status(201).json({
                    message: 'Account created'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(error => res.status(500).json({
            error
        }));
};

// Connexion de l'utilisateur
exports.login = (req, res, next) => {

    // On cherche l'utilisateur à partir de l'email renseigné
    User.findOne({
            email: req.body.email
        })
        .then(user => {

            // On compare les mots de passe, s'ils sont valides
            // on renvoie un token JWT à l'utilisateur
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if (!valid) {
                        return res.status(401).json({
                            error: 'Password incorrect'
                        });
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign({
                                userId: user._id
                            },
                            'RANDOM_TOKEN_SECRET', {
                                expiresIn: '2h'
                            }
                        )
                    });
                })
                .catch(error => res.status(500).json({
                    error
                }));
        })
        .catch(() => res.status(404).json({
            error: 'User not found'
        }));
};