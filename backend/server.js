// Importation du package "HTTP"
const http = require('http');

// Importation du fichier app.js
const app = require('./app');

// Fonction renvoyant un port valide
// peu importe sous la forme fournie?
const normalizePort = val => {
	const port = parseInt(val, 10);

	if(isNaN(port)){
		return val;
	}
	if(port >= 0){
		return port;
	}
	return false;
}

// Définition du port
const port = normalizePort(process.env.PORT || 3000);
app.set('port', port);

// Recherche les différentes erreurs et
// les gère de façon appropriée.
const errorHandler = error => {
	if(error.syscall !== 'listen'){
		throw error;
	}
	const address = server.address();
	const bind = typeof adress === 'string' ? ' pipe' + address : 'port' + port;
	switch(error.code){
		case 'EACCES':
			console.error(bind + ' requires elevated privileges.');
			process.exit(1);
			break;
		case 'EADDRINUSE':
			console.error(bind + ' is already in use.');
			process.exit(1);
			break;
		default:
			throw error;
	}
};

// Création d'un serveur avec une fonction qui
// renvoie les données de l'app lors de la
// connexion au serveur.
const server = http.createServer(app);

server.on('error', errorHandler);
server.on('listening', () => {
	const address = server.address();
	const bind = typeof address === 'string' ? ' pipe' + address : 'port' + port;
	console.log('Listening on ' + bind);
});

// Configuration du port
server.listen(port);