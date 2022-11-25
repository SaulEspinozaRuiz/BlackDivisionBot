const {
	SlashCommandBuilder,
	PermissionFlagsBits,
	EmbedBuilder,
} = require('discord.js');
const joinToCreateSchema = require('../../models/joinToCreate');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('admin')
		.setDescription('⚙️ | Comandos de administración.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('jointocreatechannel')
				.setDescription('⚙️ | Establece el canal de Joint to Create en el servidor.')
				.addChannelOption((option) =>
					option
						.setName('canal')
						.setDescription('🎙️ | Canal de Joint to Create.')
						.setRequired(true),
				),
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
	async execute(interaction, client) {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case 'jointocreatechannel':
				const channel = interaction.options.getChannel('canal');
				data =
					(await joinToCreateSchema.findOne({ guildId: interaction.guild.id })) ||
					(await joinToCreateSchema.create({ guildId: interaction.guild.id }));
				data.channel = channel.id;
				await data.save();
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('✅ | Canal de "Crear para unirse" ha sido creado exitosamente')
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
				break;
		}
	},
};
