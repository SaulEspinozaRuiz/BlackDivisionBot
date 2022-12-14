const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configcanal')
		.setDescription('βοΈ | Configura el canal de voz generado por ti.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remover')
				.setDescription('ποΈ | Remueve el acceso al canal de voz generado por ti.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription(
							'π€ | Usuario al que se le remueve el acceso al canal de voz.',
						)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('nombre')
				.setDescription('ποΈ | Cambia el nombre del canal de voz generado por ti.')
				.addStringOption((option) =>
					option
						.setName('nombre')
						.setDescription('π | Nombre del canal de voz.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('limite')
				.setDescription(
					'ποΈ | Cambia el lΓ­mite de miembros del canal de voz generado por ti.',
				)
				.addIntegerOption((option) =>
					option
						.setName('limite')
						.setDescription('π | LΓ­mite de miembros del canal de voz.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('modo')
				.setDescription(
					'ποΈ | Cambia el canal de voz generado por ti a privado o publico.',
				)
				.addStringOption((option) =>
					option
						.setName('modo')
						.setDescription('π | Vuelve tu canal privado o publico.')
						.setRequired(true)
						.addChoices(
							{ name: 'Privado', value: 'privado' },
							{ name: 'Publico', value: 'publico' },
						),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('invitar')
				.setDescription(
					'ποΈ | Invita a un usuario a tu canal de voz enviandole un mensaje al privado.',
				)
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('π€ | Usuario al que se le invita al canal de voz.')
						.setRequired(true),
				),
		),
	async execute(interaction, client) {
		const { options, member, guild } = interaction;
		const subcommand = options.getSubcommand();
		const voiceChannel = member.voice.channel;
		const ownedChannel = client.voiceGenerator.get(member.id);
		if (!voiceChannel) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('β οΈ | Debes estar en un canal de voz.')
						.setColor('Red')
						.setTimestamp(),
				],
				ephemeral: true,
			});
		}
		if (!ownedChannel || voiceChannel.id !== ownedChannel) {
			return interaction.reply({
				embeds: [
					new EmbedBuilder()
						.setTitle('β οΈ | No tienes un canal de voz generado.')
						.setColor('Red')
						.setTimestamp(),
				],
				ephemeral: true,
			});
		}
		switch (subcommand) {
			case 'remover':
				const targetMember = options.getMember('usuario');
				if (targetMember.id === member.id) {
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('β οΈ | No puedes remover tu propio acceso.')
								.setColor('Red')
								.setTimestamp(),
						],
						ephemeral: true,
					});
				}
				voiceChannel.permissionOverwrites.edit(targetMember, { Connect: false });
				if (
					targetMember.voice.channel &&
					targetMember.voice.channel.id == voiceChannel.id
				)
					targetMember.voice.setChannel(null);
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('ποΈ | Se ha removido el acceso al canal de voz.')
							.setColor('Green')
							.setTimestamp(),
					],
					ephemeral: true,
				});
				break;
			case 'nombre':
				const name = options.getString('nombre');
				if (name.length > 22 || name.length < 1) {
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('β οΈ | El nombre debe tener entre 1 y 22 caracteres.')
								.setColor('Red')
								.setTimestamp(),
						],
						ephemeral: true,
					});
				}
				voiceChannel.edit({ name: name });
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('ποΈ | Se ha cambiado el nombre del canal de voz.')
							.setColor('Green')
							.setTimestamp(),
					],
					ephemeral: true,
				});
				break;
			case 'limite':
				const limit = options.getInteger('limite');
				if (limit > 99 || limit < 2) {
					return interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('β οΈ | El lΓ­mite debe estar entre 2 y 99.')
								.setColor('Red')
								.setTimestamp(),
						],
						ephemeral: true,
					});
				}
				voiceChannel.edit({ userLimit: limit });
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('ποΈ | Se ha cambiado el lΓ­mite del canal de voz.')
							.setColor('Green')
							.setTimestamp(),
					],
					ephemeral: true,
				});
				break;
			case 'modo':
				const turnChoice = options.getString('modo');
				switch (turnChoice) {
					case 'privado':
						voiceChannel.permissionOverwrites.edit(guild.id, { Connect: false });
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('ποΈ | Se ha cambiado el modo a privado del canal de voz.')
									.setColor('Green')
									.setTimestamp(),
							],
							ephemeral: true,
						});
						break;
					case 'publico':
						voiceChannel.permissionOverwrites.edit(guild.id, { Connect: true });
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('ποΈ | Se ha cambiado el modo a pΓΊblico del canal de voz.')
									.setColor('Green')
									.setTimestamp(),
							],
							ephemeral: true,
						});
						break;
				}
				break;
			case 'invitar':
				const targetMember2 = options.getMember('usuario');
				voiceChannel.permissionOverwrites.edit(targetMember2, { Connect: true });
				const sendEmbed = new EmbedBuilder()
					.setTitle('ποΈ | Se te ha invitado al canal de voz.')
					.setDescription(`**Canal:** ${voiceChannel}`)
					.setColor('Green')
					.setTimestamp();
				targetMember2.send({
					embeds: [sendEmbed],
				});
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('ποΈ | Se ha invitado al usuario al canal de voz.')
							.setColor('Green')
							.setTimestamp(),
					],
					ephemeral: true,
				});
				break;
		}
	},
};
