const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('anime')
		.setDescription('🐈 | Comandos de anime (Acciones y demas).')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('abrazar')
				.setDescription('🤗 | Abrazar a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres abrazar.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('acurrucarse')
				.setDescription('🤗 | Acurrucarse con un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario con el que quieres acurrucarte.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('besar')
				.setDescription('🤗 | Besar a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres besar.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('bonk')
				.setDescription('🤗 | Bonkear a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres bonkear.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('cachetea')
				.setDescription('🤗 | Cachetear a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres cachetear.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('chocalas')
				.setDescription('🤗 | Chocalas a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres chocalas.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('cringe')
				.setDescription('🤗 | Cringe a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres cringe.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('frotar')
				.setDescription('🤗 | Frotar a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres frotar.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('guiño')
				.setDescription('🤗 | Guiñarle a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres guiñarle.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('lamer')
				.setDescription('🤗 | Lamer a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres lamer.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('manitas')
				.setDescription('🤗 | Darle manitas a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres darle manitas.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('morder')
				.setDescription('🤗 | Morder a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres morder.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('picar')
				.setDescription('🤗 | Picar a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres picar.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('sonrojarse')
				.setDescription('🤗 | Sonrojarse con un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario con el que quieres sonrojarte.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('taclear')
				.setDescription('🤗 | Taclear a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres taclear.')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('tocar')
				.setDescription('🤗 | Tocar a un usuario.')
				.addUserOption((option) =>
					option
						.setName('usuario')
						.setDescription('👤 | Usuario al que quieres tocar.')
						.setRequired(true),
				),
		),
	async execute(interaction, client) {
		const subcommand = interaction.options.getSubcommand();
		switch (subcommand) {
			case 'abrazar':
				const user = interaction.options.getUser('usuario');
				const abrazo = await client.apis.request(
					'https://nekos.life/api/v2/img/hug' || 'https://api.waifu.pics/sfw/hug',
				);
				const channel = interaction.guild.channels.cache.get(interaction.channelId);
				const embedAbrazo = new EmbedBuilder()
					.setTitle('🤗 | Abrazo')
					.setDescription(`**${interaction.user}** abrazo a **${user}**`)
					.setImage(abrazo.url)
					.setColor('Random')
					.setTimestamp()
					.setFooter({
						text: `Solicitado por ${interaction.user.tag}`,
						iconURL: interaction.user.displayAvatarURL(),
					});
				await channel.send({ embeds: [embedAbrazo] });
				interaction.reply({
					content: '🤗 | Abrazo enviado.',
					ephemeral: true,
				});
				break;
			default:
				interaction.reply({
					content: '⚙️ | Comando en desarrollo.',
					ephemeral: true,
				});
				break;
			case 'acurrucarse':
				const user2 = interaction.options.getUser('usuario');
				const channel2 = interaction.guild.channels.cache.get(interaction.channelId);
				const acurrucarse = await client.apis.request(
					'https://nekos.life/api/v2/img/cuddle' || 'https://api.waifu.pics/sfw/cuddle',
				);
				await channel2.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Acurrucarse')
							.setDescription(`**${interaction.user}** se acurrucó con **${user2}**`)
							.setImage(acurrucarse.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Acurrucarse enviado.',
					ephemeral: true,
				});
				break;
			case 'besar':
				const user3 = interaction.options.getUser('usuario');
				const channel3 = interaction.guild.channels.cache.get(interaction.channelId);
				const beso = await client.apis.request(
					'https://nekos.life/api/v2/img/kiss' || 'https://api.waifu.pics/sfw/kiss',
				);
				await channel3.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Beso')
							.setDescription(`**${interaction.user}** beso a **${user3}**`)
							.setImage(beso.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Beso enviado.',
					ephemeral: true,
				});
				break;
			case 'bonk':
				const user4 = interaction.options.getUser('usuario');
				const channel4 = interaction.guild.channels.cache.get(interaction.channelId);
				const bonk = await client.apis.request('https://api.waifu.pics/sfw/bonk');
				await channel4.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Bonk')
							.setDescription(`BONK **${user4}**`)
							.setImage(bonk.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Bonk enviado.',
					ephemeral: true,
				});
				break;
			case 'cachetea':
				const user5 = interaction.options.getUser('usuario');
				const channel5 = interaction.guild.channels.cache.get(interaction.channelId);
				const slap = await client.apis.request(
					'https://nekos.life/api/v2/img/slap' || 'https://api.waifu.pics/sfw/slap',
				);
				await channel5.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Cachetada')
							.setDescription(
								`**${interaction.user}** le dio una cachetada a **${user5}**`,
							)
							.setImage(slap.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Cachetada enviada.',
					ephemeral: true,
				});
				break;
			case 'chocalas':
				const user6 = interaction.options.getUser('usuario');
				const channel6 = interaction.guild.channels.cache.get(interaction.channelId);
				const chocalas = await client.apis.request(
					'https://api.waifu.pics/sfw/highfive',
				);
				await channel6.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Chocalas')
							.setDescription(`**${interaction.user}** las choco **${user6}**`)
							.setImage(chocalas.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Chocalas enviadas.',
					ephemeral: true,
				});
				break;
			case 'cringe':
				const user7 = interaction.options.getUser('usuario');
				const channel7 = interaction.guild.channels.cache.get(interaction.channelId);
				const cringe = await client.apis.request('https://api.waifu.pics/sfw/cringe');
				await channel7.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Cringe')
							.setDescription(`**${interaction.user}** le dio cringe a **${user7}**`)
							.setImage(cringe.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Cringe enviado.',
					ephemeral: true,
				});
				break;
			case 'frotar':
				const user8 = interaction.options.getUser('usuario');
				const channel8 = interaction.guild.channels.cache.get(interaction.channelId);
				const frotar = await client.apis.request(
					'https://api.waifu.pics/sfw/pat' || 'https://nekos.life/api/v2/img/pat',
				);
				await channel8.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Frotar')
							.setDescription(`**${interaction.user}** frotó a **${user8}**`)
							.setImage(frotar.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Frotar enviado.',
					ephemeral: true,
				});
				break;
			case 'guiño':
				const user9 = interaction.options.getUser('usuario');
				const channel9 = interaction.guild.channels.cache.get(interaction.channelId);
				const guiño = await client.apis.request('https://api.waifu.pics/sfw/wink');
				await channel9.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Guiño')
							.setDescription(`**${interaction.user}** le guiñó a **${user9}**`)
							.setImage(guiño.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Guiño enviado.',
					ephemeral: true,
				});
				break;
			case 'lamer':
				const user10 = interaction.options.getUser('usuario');
				const channel10 = interaction.guild.channels.cache.get(interaction.channelId);
				const lamer = await client.apis.request('https://api.waifu.pics/sfw/lick');
				await channel10.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Lamer')
							.setDescription(`**${interaction.user}** lamio a **${user10}**`)
							.setImage(lamer.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Lamer enviado.',
					ephemeral: true,
				});
				break;
			case 'manitas':
				const user11 = interaction.options.getUser('usuario');
				const channel11 = interaction.guild.channels.cache.get(interaction.channelId);
				const holdhands = await client.apis.request(
					'https://api.waifu.pics/sfw/handhold',
				);
				await channel11.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Manitas')
							.setDescription(`**${interaction.user}** le dio manitas a **${user11}**`)
							.setImage(holdhands.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Manitas enviado.',
					ephemeral: true,
				});
				break;
			case 'morder':
				const user12 = interaction.options.getUser('usuario');
				const channel12 = interaction.guild.channels.cache.get(interaction.channelId);
				const bite = await client.apis.request('https://api.waifu.pics/sfw/bite');
				await channel12.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Morder')
							.setDescription(`**${interaction.user}** mordió a **${user12}**`)
							.setImage(bite.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Morder enviado.',
					ephemeral: true,
				});
				break;
			case 'picar':
				const user13 = interaction.options.getUser('usuario');
				const channel13 = interaction.guild.channels.cache.get(interaction.channelId);
				const poke = await client.apis.request('https://api.waifu.pics/sfw/poke');
				await channel13.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Picar')
							.setDescription(`**${interaction.user}** picó a **${user13}**`)
							.setImage(poke.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Picar enviado.',
					ephemeral: true,
				});
				break;
			case 'sonrojarse':
				const user14 = interaction.options.getUser('usuario');
				const channel14 = interaction.guild.channels.cache.get(interaction.channelId);
				const blush = await client.apis.request('https://api.waifu.pics/sfw/blush');
				await channel14.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Sonrojarse')
							.setDescription(`**${interaction.user}** se sonrojó por **${user14}**`)
							.setImage(blush.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Sonrojarse enviado.',
					ephemeral: true,
				});
				break;
			case 'taclear':
				const user15 = interaction.options.getUser('usuario');
				const channel15 = interaction.guild.channels.cache.get(interaction.channelId);
				const glomp = await client.apis.request('https://api.waifu.pics/sfw/glomp');
				await channel15.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Taclear')
							.setDescription(`**${interaction.user}** tacleó a **${user15}**`)
							.setImage(glomp.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Taclear enviado.',
					ephemeral: true,
				});
				break;
			case 'tocar':
				const user16 = interaction.options.getUser('usuario');
				const channel16 = interaction.guild.channels.cache.get(interaction.channelId);
				const pat = await client.apis.request('https://api.waifu.pics/sfw/pat');
				await channel16.send({
					embeds: [
						new EmbedBuilder()
							.setTitle('🤗 | Tocar')
							.setDescription(`**${interaction.user}** tocó a **${user16}**`)
							.setImage(pat.url)
							.setColor('Random')
							.setTimestamp()
							.setFooter({
								text: `Solicitado por ${interaction.user.tag}`,
								iconURL: interaction.user.displayAvatarURL(),
							}),
					],
				});
				interaction.reply({
					content: '🤗 | Tocar enviado.',
					ephemeral: true,
				});
				break;
		}
	},
};
