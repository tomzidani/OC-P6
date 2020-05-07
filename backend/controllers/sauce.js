const Sauce = require('../models/sauce');

exports.getAllSauces = (req, res, next) => {
  Sauce.find().then(
    (sauces) => {
      res.status(200).json(sauces);
    }
  ).catch(
    (error) => {
      res.status(400).json({
        error: error
      });
    }
  );
};

exports.getOneSauce = (req, res, next) => {

}

exports.createSauce = (req, res, next) => {
	const sauceFields = JSON.parse(req.body.sauce);

	if(!sauceFields.userId || !sauceFields.name ||
	!sauceFields.manufacturer || !sauceFields.description ||
	!sauceFields.mainPepper || !sauceFields.heat ||
	!req.file.path) {
		console.log(sauceFields.imageUrl);
		return res.status(500).json({ error: 'Bad request' });
	}
	const sauce = new Sauce({
		userId: sauceFields.userId,
		name: sauceFields.name,
		manufacturer: sauceFields.manufacturer,
		description: sauceFields.description,
		mainPepper: sauceFields.mainPepper,
		imageUrl: req.file.path,
		heat: sauceFields.heat,
		likes: 0,
		dislikes: 0,
		usersLiked: [],
		usersDisliked: []
	});
	sauce.save()
		.then(() => res.status(201).json({ message: 'Sauce created' }))
		.catch(error => res.status(400).json({ error }));
};

exports.deleteSauce = (req, res, next) => {

}