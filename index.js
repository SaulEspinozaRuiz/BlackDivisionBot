console.clear();

const { Client, Collection } = require('discord.js');
const { APIs, StringUtils } = require('devtools-ts');
const { readdirSync } = require('fs');
const colors = require('colors');

const client = new Client({ intents: [131071] });

client.config = require('./config/config');
client.commands = new Collection();
client.voiceGenerator = new Collection();
client.apis = new APIs();
client.tools = new StringUtils();

module.exports = client;

readdirSync('./handlers')
	.filter((file) => file.endsWith('.js'))
	.forEach(async (handler) => {
		require(`./handlers/${handler}`)(client);
	});

process.on('uncaughtException', (err) => {
	console.log(`[ERROR] - ¡Ha ocurrido un error inesperado!\n${err.stack}`.red);
});

process.on('unhandledRejection', (err) => {
	console.log(`[ERROR] - ¡Ha ocurrido un error inesperado!\n${err}`.red);
});

client.login(client.config.bot.token).catch((err) => {
	console.log(`\n[CLIENT] - Error al iniciar sesion: \n\n${err.message}`.red);
});
