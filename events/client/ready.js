const client = require('../../index');
const colors = require('colors');

client.on('ready', async () => {
	const activitys = [
		{ name: `${client.guilds.cache.size} Servidores`, type: 2 },
		{ name: `${client.channels.cache.size} Usuarios`, type: 0 },
		{ name: `${client.users.cache.size} Canales`, type: 3 },
	];
	let i = 0;
	setInterval(() => {
		if (i > activitys.length) i = 0;
		client.user.setActivity(activitys[i]);
		i++;
	}, 5000);
	setTimeout(() => {
		console.log(
			`\n[CLIENT] - Iniciando sesion como ${client.user.tag}\n`.green,
		);
	}, 2000);
});
