const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => {res.status(200).json( sauces )})
  .catch((error) => {res.status(400).json({ error: error })});
};

exports.getOneSauce = (req, res, next) => {
	console.log(req.params.id);
	Sauce.findOne({
		_id: req.params.id
	})
	.then(sauce => res.status(200).json( sauce ))
	.catch(error => res.status(400).json({ error: error }));
}

exports.createSauce = (req, res, next) => {
	const sauceObject = JSON.parse(req.body.sauce);

	if(!sauceObject.userId || !sauceObject.name ||
	!sauceObject.manufacturer || !sauceObject.description ||
	!sauceObject.mainPepper || !sauceObject.heat ||
	!req.file.path) {
		console.log(sauceObject.imageUrl);
		return res.status(500).json({ error: 'Bad request' });
	}
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
		.then(() => res.status(201).json({ message: 'Sauce created' }))
		.catch(error => res.status(400).json({ error }));
};

exports.editSauce = (req, res, next) => {
	console.log(req.body);
	res.status(201).json({ message: 'Edited' });
}

exports.deleteSauce = (req, res, next) => {
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {
			const filename = sauce.imageUrl.split('/images/')[1];
			fs.unlink(`images/${filename}`, () => {
				Sauce.deleteOne({ _id: req.params.id })
					.then(() => res.status(200).json({ message: 'Sauce deleted' }))
					.catch(error => res.status(400).json({ error: error }))
			});
		})
		.catch(() => res.status(400).json({ message: 'Sauce not found' }));
};