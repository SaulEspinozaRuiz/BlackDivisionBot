const { EmbedBuilder } = require('discord.js');
const client = require('../../index');

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isAutocomplete()) return;
	const { commands } = client;
	const { commandName } = interaction;
	const command = commands.get(commandName);
	if (!command) return;
	try {
		await command.autocomplete(interaction, client);
	} catch (error) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('❌ ┃ ERROR')
					.setDescription(
						'El comando no existe o no se pudo cargar correctamente.',
					)
					.setColor('Red')
					.addFields(
						{
							name: '📝 Comando',
							value: `/${interaction.commandName}`,
							inline: true,
						},
						{
							name: '👤 Usuario',
							value: `<@${interaction.user.id}>`,
							inline: true,
						},
						{
							name: '📌 Contacto',
							value: `Este es el desarrollador ➡️ <@${client.config.developerId}>\nFavor de contactarse con el desarrollador del bot para mas informacion.`,
							inline: true,
						},
						{
							name: '📋 Informacion del error',
							value: `\`\`\`js\n${error}\n\`\`\``,
							inline: true,
						},
					),
			],
			ephemeral: true,
		});
	}
});
