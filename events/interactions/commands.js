const { EmbedBuilder } = require('discord.js');
const client = require('../../index');

client.on('interactionCreate', async (interaction) => {
	if (!interaction.isChatInputCommand()) return;
	const command = client.commands.get(interaction.commandName);
	if (!command) return client.commands.delete(interaction.commandName);
	try {
		await command.execute(interaction, client);
	} catch (error) {
		await interaction.reply({
			embeds: [
				new EmbedBuilder()
					.setTitle('❌ | Error')
					.setDescription(
						'````Ocurrio un error, el comando no existe o no se pudo cargar adecuadamente```',
					)
					.setColor('Random')
					.addFields(
						{
							name: '📝 | Comando',
							value: `/${interaction.commandName}`,
							inline: true,
						},
						{
							name: '👤 | Usuario',
							value: `<@${interaction.user.id}>`,
							inline: true,
						},
						{
							name: '📌 | Contacto',
							value: `Este es el desarrollador ➡️ <@${client.config.developerId}>\nFavor de contactarse con el desarrollador del bot para mas informacion.`,
							inline: true,
						},
						{
							name: '📋 | Informacion del error',
							value: `\`\`\`js\n${error}\n\`\`\``,
							inline: true,
						},
					),
			],
			ephemeral: true,
		});
		console.log(error);
	}
});
