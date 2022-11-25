const mongoose = require('mongoose');
const colors = require('colors');

module.exports = async (client) => {
	await mongoose.connect(client.config.db, {
		keepAlive: true,
	});
	if (mongoose.connect) {
		console.log(
			'[HANDLER] - ¡Conectado a la base de datos correctamente!'.blue,
		);
	} else {
		console.log(`[HANDLER] - ¡No se pudo conetar a la base de datos!`.blue);
	}
};
