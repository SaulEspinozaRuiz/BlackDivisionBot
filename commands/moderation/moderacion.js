const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('moderacion')
		.setDescription('🔨 | Comandos de moderacion')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('limpiar')
				.setDescription('🧹 | Limpia el chat')
				.addIntegerOption((option) =>
					option
						.setName('cantidad')
						.setDescription('🧹 | Cantidad de mensajes a borrar')
						.setRequired(true),
				),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),
	async execute(interaction, client) {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case 'limpiar':
				try {
					const cantidad = interaction.options.getInteger('cantidad');
					if (cantidad > 100) {
						cantidad = 100;
					}
					if (cantidad < 1) {
						cantidad = 1;
					}
					await interaction.channel.bulkDelete(cantidad);
					interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('🧹 ┃ Limpieza de mensajes exitosa')
								.setDescription(`Se han borrado ${cantidad} mensajes exitosamente`)
								.setColor('Green')
								.setTimestamp()
								.setFooter({
									text: `Traido a ti por: ${client.user.username}`,
									iconURL: `${client.user.displayAvatarURL({
										dynamic: true,
										size: 4096,
									})}`,
								}),
						],
						ephemeral: true,
					});
				} catch (error) {
					interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('❌ ┃ ERROR')
								.setDescription(
									'Ha ocurrido un error al momento de borrar los mensajes',
								)
								.setColor('Red')
								.addFields({
									name: 'Error',
									value: `\`\`\`${error}\`\`\``,
								})
								.setTimestamp(),
						],
						ephemeral: true,
					});
				}
				break;
		}
	},
};
