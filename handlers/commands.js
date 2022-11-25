const { REST, Routes } = require('discord.js');
const { readdirSync } = require('fs');
const colors = require('colors');
const commands = [];
let errors = 0;

module.exports = async (client) => {
	const rest = new REST({ version: '10' }).setToken(client.config.bot.token);
	readdirSync('./commands/').forEach((dir) => {
		readdirSync(`./commands/${dir}/`).forEach((file) => {
			try {
				const command = require(`../commands/${dir}/${file}`);
				client.commands.set(command.data.name, command);
				commands.push(command.data.toJSON());
			} catch (error) {
				console.log(error);
				errors++;
			}
		});
	});
	(async () => {
		try {
			const data = await rest.put(
				Routes.applicationGuildCommands(
					client.config.bot.clientId,
					client.config.bot.guildId,
				),
				{ body: commands },
			);
			console.log(
				`[HANDLER] - ¡${data.length} comandos fueron cargados exitosamente!`
					.blue,
			);
			if (errors > 0) {
				console.log(`[HANDLER] - ¡${errors} comandos fallaron!`.blue);
			}
		} catch (error) {
			console.log(
				`[HANDLER] - ¡Ha ocurrido un error al momento de registrar los comandos!\n${error}`
					.red,
			);
		}
	})();
};
