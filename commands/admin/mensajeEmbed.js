const {
	SlashCommandBuilder,
	EmbedBuilder,
	PermissionFlagsBits,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mensajeembed')
		.setDescription('📨 | Envia un mensaje embed.')
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client) {
		const channel = interaction.guild.channels.cache.get(interaction.channelId);
		const embed = new EmbedBuilder()
			.setTitle('Los comandos de configuracion de canales generados ')
			.setDescription(
				`Los canales de configuracion son los siguientes:\n</configcanal:1045017840245293116>, este comando tiene subcomandos los cuales son: `,
			)
			.addFields(
				{
					name: 'nombre',
					value: 'Cambia el nombre del canal de voz generado por ti.',
				},
				{
					name: 'limite',
					value: 'Cambia el límite de miembros del canal de voz generado por ti.',
				},
				{
					name: 'modo',
					value: 'Cambia el canal de voz generado por ti a privado o publico.',
				},
				{
					name: 'remover',
					value: 'Remueve el acceso al canal de voz generado por ti.',
				},
				{
					name: 'invitar',
					value: 'Invita a un usuario a tu canal de voz.',
				},
			)
			.setColor('Green')
			.setFooter({
				text: `Traido a ti por: ${client.user.username}`,
				iconURL: `${client.user.displayAvatarURL({ dynamic: true, size: 4096 })}`,
			});
		await channel.send({
			embeds: [embed],
		});
		interaction.reply({
			content: 'Mensaje enviado correctamente.',
			ephemeral: true,
		});
	},
};
