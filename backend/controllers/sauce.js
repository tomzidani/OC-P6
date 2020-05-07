const Sauce = require('../models/sauce');
const fs = require('fs');

exports.getAllSauces = (req, res, next) => {
  Sauce.find()
  .then((sauces) => {res.status(200).json( sauces )})
  .catch((error) => {res.status(400).json({ error: error })});
};

exports.getOneSauce = (req, res, next) => {
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
	const sauceObject = req.file ?
	{
		...JSON.parse(req.body.sauce),
		imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
	} : { ...req.body };
	Sauce.updateOne({ _id: req.params.id }, { ...sauceObject, _id: req.params.id })
		.then(() => res.status(200).json({ message: 'Sauce edited' }))
		.catch(error => res.status(400).json({ error }));
};

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

exports.likeSauce = (req, res, next) => {
	console.log('Like');
	Sauce.findOne({ _id: req.params.id })
		.then(sauce => {

			if(req.body.like === -1){

				sauce.dislikes = sauce.dislikes + 1;
				sauce.usersDisliked.push(req.body.userId);
				Sauce.updateOne(
					{ _id: req.params.id },
					{$set: {
						"dislikes": sauce.dislikes,
						"usersDisliked": sauce.usersDisliked
					}})
					.then(() => res.status(200).json({ message: 'Sauce disliked' }))
					.catch(error => res.status(400).json({ error }));
			}
			else if(req.body.like === 0){
				if(sauce.usersDisliked.find(user => user === req.body.userId)){	
					sauce.usersDisliked = sauce.usersDisliked.filter(user => user !== req.body.userId);
					sauce.dislikes = sauce.dislikes - 1;
					sauceObject = { "dislikes": sauce.dislikes, "usersDisliked": sauce.usersDisliked }				
				}
				else{
					sauce.usersLiked = sauce.usersLiked.filter(user => user !== req.body.userId);
					sauce.likes = sauce.likes - 1;
					sauceObject = { "likes": sauce.likes, "usersLiked": sauce.usersLiked }
				}
				Sauce.updateOne({ _id: req.params.id }, {$set: sauceObject})
					.then(() => res.status(200).json({ message: 'Sauce likes/dislikes removed' }))
					.catch(error => res.status(400).json({ error }));								
			}
			else if(req.body.like === 1){
				sauce.likes = sauce.likes + 1;
				sauce.usersLiked.push(req.body.userId);
				Sauce.updateOne(
					{ _id: req.params.id },
					{$set: {
						"likes": sauce.likes,
						"usersLiked": sauce.usersLiked
					}})
					.then(() => res.status(200).json({ message: 'Sauce Liked' }))
					.catch(error => res.status(400).json({ error }));				
			}
		})
		.catch(() => res.status(400).json({ error: 'Sauce not found' }));
}





