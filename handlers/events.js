const colors = require('colors');
const { readdirSync } = require('fs');
let success = 0;
let errors = 0;

module.exports = async (client) => {
	readdirSync('./events/').forEach((dir) => {
		readdirSync(`./events/${dir}/`).forEach((file) => {
			try {
				require(`../events/${dir}/${file}`);
				success++;
			} catch (error) {
				errors++;
				console.log(error);
			}
		});
	});
	console.log(`[HANDLER] - ¡${success} eventos cargados correctamente!`.blue);
	if (errors > 0) {
		console.log(`[HANDLER] - ¡${errors}! eventos que fallaron`.blue);
	}
};
