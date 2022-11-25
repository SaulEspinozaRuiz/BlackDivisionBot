const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('configcanal')
		.setDescription('⚙️ | Configura el canal de voz generado por ti.')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('remover')
				.setDescription('🎙️ | Remueve el acceso al canal de voz generado por ti.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription(
							'👤 | Usuario al que se le remueve el acceso al canal de voz.',
						)
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('nombre')
				.setDescription('🎙️ | Cambia el nombre del canal de voz generado por ti.')
				.addStringOption((option) =>
					option
						.setName('nombre')
						.setDescription('📝 | Nombre del canal de voz.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('limite')
				.setDescription(
					'🎙️ | Cambia el límite de miembros del canal de voz generado por ti.',
				)
				.addIntegerOption((option) =>
					option
						.setName('limite')
						.setDescription('📝 | Límite de miembros del canal de voz.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('modo')
				.setDescription(
					'🎙️ | Cambia el canal de voz generado por ti a privado o publico.',
				)
				.addStringOption((option) =>
					option
						.setName('modo')
						.setDescription('📝 | Vuelve tu canal privado o publico.')
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
					'🎙️ | Invita a un usuario a tu canal de voz enviandole un mensaje al privado.',
				)
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que se le invita al canal de voz.')
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
						.setTitle('⚠️ | Debes estar en un canal de voz.')
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
						.setTitle('⚠️ | No tienes un canal de voz generado.')
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
								.setTitle('⚠️ | No puedes remover tu propio acceso.')
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
							.setTitle('🎙️ | Se ha removido el acceso al canal de voz.')
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
								.setTitle('⚠️ | El nombre debe tener entre 1 y 22 caracteres.')
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
							.setTitle('🎙️ | Se ha cambiado el nombre del canal de voz.')
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
								.setTitle('⚠️ | El límite debe estar entre 2 y 99.')
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
							.setTitle('🎙️ | Se ha cambiado el límite del canal de voz.')
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
									.setTitle('🎙️ | Se ha cambiado el modo a privado del canal de voz.')
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
									.setTitle('🎙️ | Se ha cambiado el modo a público del canal de voz.')
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
					.setTitle('🎙️ | Se te ha invitado al canal de voz.')
					.setDescription(`**Canal:** ${voiceChannel}`)
					.setColor('Green')
					.setTimestamp();
				targetMember2.send({
					embeds: [sendEmbed],
				});
				interaction.reply({
					embeds: [
						new EmbedBuilder()
							.setTitle('🎙️ | Se ha invitado al usuario al canal de voz.')
							.setColor('Green')
							.setTimestamp(),
					],
					ephemeral: true,
				});
				break;
		}
	},
};
