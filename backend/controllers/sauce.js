// Importation des packages et modèles
const Sauce = require('../models/sauce');
const fs = require('fs');

// Récupérer toutes les sauces
exports.getAllSauces = (req, res, next) => {
    Sauce.find()
        .then((sauces) => {
            res.status(200).json(sauces)
        })
        .catch((error) => {
            res.status(400).json({
                error: error
            })
        });
};

// Récupérer une seule sauce
exports.getOneSauce = (req, res, next) => {
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => res.status(200).json(sauce))
        .catch(error => res.status(400).json({
            error: error
        }));
}
// Créer une sauce
exports.createSauce = (req, res, next) => {

    // Récupération des champs de la sauce
    const sauceObject = JSON.parse(req.body.sauce);

    // Si il manque un des champs de la création de la
    // sauce, on retourne un statut 500 avec un Bad Request
    if (!sauceObject.userId || !sauceObject.name ||
        !sauceObject.manufacturer || !sauceObject.description ||
        !sauceObject.mainPepper || !sauceObject.heat ||
        !req.file.path) {
        return res.status(500).json({
            error: 'Bad request'
        });
    }

    // Création et sauvegarde de la sauce
    const sauce = new Sauce({
        userId: sauceObject.userId,
        name: sauceObject.name,
        manufacturer: sauceObject.manufacturer,
        description: sauceObject.description,
        mainPepper: sauceObject.mainPepper,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        heat: sauceObject.heat,
        likes: 0,
        dislikes: 0,
        usersLiked: [],
        usersDisliked: []
    });
    sauce.save()
        .then(() => res.status(201).json({
            message: 'Sauce created'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

// Modification de la sauce
exports.editSauce = (req, res, next) => {

    // Récupération des informations du formulaire
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
    } : {
        ...req.body
    };

    // Mise à jour de la sauce à partir de sauceObject
    Sauce.updateOne({
            _id: req.params.id
        }, {
            ...sauceObject,
            _id: req.params.id
        })
        .then(() => res.status(200).json({
            message: 'Sauce edited'
        }))
        .catch(error => res.status(400).json({
            error
        }));
};

// Suppression d'une sauce
exports.deleteSauce = (req, res, next) => {

    // Récupération des informations de la sauce, si la sauce existe
    // on supprime son image et on supprime ensuite la sauce
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {
            const filename = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${filename}`, () => {
                Sauce.deleteOne({
                        _id: req.params.id
                    })
                    .then(() => res.status(200).json({
                        message: 'Sauce deleted'
                    }))
                    .catch(error => res.status(400).json({
                        error: error
                    }))
            });
        })
        .catch(() => res.status(400).json({
            message: 'Sauce not found'
        }));
};

// Like/Dislike d'une sauce
exports.likeSauce = (req, res, next) => {

    // On récupère les informations de la sauce
    Sauce.findOne({
            _id: req.params.id
        })
        .then(sauce => {

            // On donne la valeur du sauceObject en fonction de la valeur du like
            switch (req.body.like) {
                case -1:
                    sauce.dislikes = sauce.dislikes + 1;
                    sauce.usersDisliked.push(req.body.userId);
                    sauceObject = {
                        "dislikes": sauce.dislikes,
                        "usersDisliked": sauce.usersDisliked
                    }
                    break;
                case 0:
                    if (sauce.usersDisliked.find(user => user === req.body.userId)) {
                        sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== req.body.userId);
                        sauce.dislikes = sauce.dislikes - 1;
                        sauceObject = {
                            "dislikes": sauce.dislikes,
                            "usersDisliked": sauce.usersDisliked
                        }
                    } else {
                        sauce.usersLiked = sauce.usersLiked.filter(user => user !== req.body.userId);
                        sauce.likes = sauce.likes - 1;
                        sauceObject = {
                            "likes": sauce.likes,
                            "usersLiked": sauce.usersLiked
                        }
                    }
                    break;
                case 1:
                    sauce.likes = sauce.likes + 1;
                    sauce.usersLiked.push(req.body.userId);
                    sauceObject = {
                        "likes": sauce.likes,
                        "usersLiked": sauce.usersLiked
                    }
                    break;
                default:
                    return res.status(500).json({
                        error: 'Bad request'
                    });
                    break;
            }

            // Et on met la sauce à jour à partir du sauceObject
            Sauce.updateOne({
                    _id: req.params.id
                }, {
                    $set: sauceObject
                })
                .then(() => res.status(200).json({
                    message: 'Updated notice'
                }))
                .catch(error => res.status(400).json({
                    error
                }));
        })
        .catch(() => res.status(400).json({
            error: 'Sauce not found'
        }));
}