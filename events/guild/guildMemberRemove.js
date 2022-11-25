const client = require('../../index');
const { EmbedBuilder } = require('discord.js');
const channels = require('../../constants/channels');

client.on('guildMemberRemove', async (member) => {
	const embed = new EmbedBuilder()
		.setTitle(`👋 | Adios`)
		.setDescription(`<@${member.user.id}>, Abandono la compañia`)
		.setColor('Random')
		.setThumbnail(`${member.displayAvatarURL({ dynamic: true, size: 4096 })}`)
		.setTimestamp()
		.setFooter({
			text: `Traido a ti por: ${client.user.username}`,
			iconURL: `${client.user.displayAvatarURL({ dynamic: true, size: 4096 })}`,
		});
	let channel = client.channels.cache.get(channels.inicio.salida);
	await channel.send({ embeds: [embed] });
});
