const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('š | Devuelve el ping del bot y de la API de Discord.'),
	async execute(interaction, client) {
		await interaction.deferReply({ ephemeral: true }).catch(() => {});
		await interaction.editReply({
			embeds: [
				new EmbedBuilder()
					.setTitle('š | Pong!')
					.setDescription(
						`š” | Ping del bot: \`${
							client.ws.ping
						}ms\`\nš” | Ping de la API de Discord: \`${
							Date.now() - interaction.createdTimestamp
						}ms\``,
					)
					.setColor('Random'),
			],
			ephemeral: true,
		});
	},
};
