const { EmbedBuilder } = require('discord.js');
const client = require('../../index');
const roles = require('../../constants/roles');
const channels = require('../../constants/channels');

client.on('guildMemberAdd', async (member) => {
	const embed = new EmbedBuilder()
		.setTitle(`👋 | Bienvenido a ${member.guild.name}`)
		.setDescription(
			`<@${member.user.id}>, Esperamos grandes cosas de ti para el corporativo`,
		)
		.setColor('Random')
		.setFields(
			{
				name: '**📚 | Reglas**',
				value: `<#994734209291784315> Sigue las directivas ofrecidas por la corporacion para evitar ser sancionado.`,
			},
			{
				name: '**Vires in Scientia. Scientia est fortist. Et Oculus Spectants Deus nobis.**',
				value:
					'La fuerza esta en el conocimiento. El conocimiento es la fuerza mas poderosa. Y el ojo que todo lo ve es Dios para nosotros.',
			},
		)
		.setThumbnail(`${member.displayAvatarURL({ dynamic: true, size: 4096 })}`)
		.setTimestamp()
		.setFooter({
			text: `Traido a ti por: ${client.user.username}`,
			iconURL: `${client.user.displayAvatarURL({ dynamic: true, size: 4096 })}`,
		});
	let welcomeChannel = member.guild.channels.cache.get(channels.inicio.entrada);
	let welcomeRole = member.guild.roles.cache.get(roles.miembro);
	await member.roles.add(welcomeRole);
	await welcomeChannel.send({ embeds: [embed] });
});
