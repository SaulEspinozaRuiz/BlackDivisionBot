const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('musica')
		.setDescription('馃幍 | Comandos de m煤sica')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('play')
				.setDescription('馃幎 | Reproduce una canci贸n')
				.addStringOption((option) =>
					option
						.setName('cancion')
						.setDescription('馃幎 | Nombre o link de la canci贸n o playlist')
						.setRequired(true)
						.setAutocomplete(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('pause').setDescription('馃幎 | Pausa la canci贸n'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('resume').setDescription('馃幎 | Reanuda la canci贸n'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('stop').setDescription('馃幎 | Detiene la canci贸n'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('volume')
				.setDescription('馃幎 | Cambia el volumen de la canci贸n')
				.addIntegerOption((option) =>
					option
						.setName('volumen')
						.setDescription('馃幎 | Volumen de la canci贸n')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('skip').setDescription('馃幎 | Salta a la siguiente canci贸n'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('loop').setDescription('馃幎 | Repite la canci贸n actual'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('nowplaying').setDescription('馃幎 | Muestra la canci贸n actual'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('queue').setDescription('馃幎 | Muestra la cola de canciones'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('lyrics')
				.setDescription('馃幎 | Muestra la letra de la canci贸n actual'),
		),
	async autocomplete(interaction, client) {
		const focusedValue = interaction.options.getFocused();
		const results = await client.player
			.search(focusedValue, {
				requestedBy: interaction.user,
				searchEngine: QueryType.AUTO,
			})
			.then((res) => res.tracks.slice(0, 25));
		const choices = results.map((track) => ({
			name:
				track.title.length > 99
					? `馃幍 | ${track.title.slice(0, 92)}...`
					: track.title.length < 1
					? `馃幍 | ${track.title}...`
					: `馃幍 | ${track.title}`,
			value: track.url,
		}));
		await interaction.respond(choices);
	},
	async execute(interaction, client) {
		const { options, member, guild, channel } = interaction;
		if (!member.voice.channel)
			return interaction.reply({
				content: '鉂? | Debes estar en un canal de voz para usar este comando.',
				ephemeral: true,
			});
		if (
			guild.members.me.voice.channelId &&
			member.voice.channelId !== guild.members.me.voice.channelId
		)
			return interaction.reply({
				content:
					'鉂? | Debes estar en el mismo canal de voz que yo para usar este comando.',
				ephemeral: true,
			});
		try {
			switch (options.getSubcommand()) {
				case 'play':
					const query = options.getString('cancion');
					const searchResult = await client.player
						.search(query, {
							requestedBy: interaction.user,
							searchEngine: QueryType.AUTO,
						})
						.catch(() => {});
					if (!searchResult || !searchResult.tracks.length)
						return interaction.reply({
							content: '鉂? | No se encontr贸 ninguna canci贸n con ese nombre.',
							ephemeral: true,
						});
					let queue = client.player.createQueue(guild, {
						metadata: channel,
					});
					try {
						if (!queue.connection) await queue.connect(member.voice.channel);
					} catch {
						queue.destroy();
						return interaction.reply({
							content: '鉂? | No se pudo unir al canal de voz.',
							ephemeral: true,
						});
					}
					if (!searchResult.playlist) {
						await interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle(`馃幍 | Cancion - ${searchResult.tracks[0].title}`)
									.setURL(searchResult.tracks[0].url)
									.setDescription(
										`\n馃幍 | Cancion ana帽adida a la cola\n鈴? | Duracion: **${searchResult.tracks[0].duration}**\n馃椏 | Autor: **${searchResult.tracks[0].author}**`,
									)
									.setThumbnail(searchResult.tracks[0].thumbnail)
									.setColor('Random')
									.setFooter({
										text: `馃幍 | Cancion a帽adida por ${interaction.user.tag}`,
										iconURL: interaction.user.displayAvatarURL(),
									}),
							],
							ephemeral: true,
						});
					} else {
						let duration = 0;
						await searchResult.tracks.forEach((track) => {
							const time = track.duration.split(':');
							if (time.length === 3) {
								duration += parseInt(time[0]) * 3600;
								duration += parseInt(time[1]) * 60;
								duration += parseInt(time[2]);
							} else {
								duration += parseInt(time[0]) * 60;
								duration += parseInt(time[1]);
							}
						});
						const time = secondsToString(duration);
						await interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle(`馃幍 | Playlist - ${searchResult.playlist.title}`)
									.setURL(searchResult.playlist.url)
									.setDescription(
										`\n馃幍 | Playlist a帽adida a la cola\n鈴? | Duracion: **${time}**\n馃椏 | Autor: **${searchResult.playlist.author.name}**`,
									)
									.setThumbnail(searchResult.playlist.thumbnail)
									.setColor('Random')
									.setFooter({
										text: `馃幍 | Playlist a帽adida por ${interaction.user.tag}`,
										iconURL: interaction.user.displayAvatarURL(),
									}),
							],
							ephemeral: true,
						});
					}
					searchResult.playlist
						? queue.addTracks(searchResult.tracks)
						: queue.addTrack(searchResult.tracks[0]);
					if (!queue.playing) await queue.play();
					break;
				case 'pause':
					const queue1 = client.player.getQueue(guild);
					const successPaused = queue1.setPaused(true);
					if (successPaused) {
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉁? 鈹? 脡XITO')
									.setDescription('Se ha pausado la reproducci贸n de m煤sica.')
									.setColor('Green')
									.setTimestamp(),
							],
							ephemeral: true,
						});
					} else {
						const reverse = queue1.setPaused(false);
						if (reverse) {
							interaction.reply({
								embeds: [
									new EmbedBuilder()
										.setTitle('鉁? 鈹? 脡XITO')
										.setDescription('Se ha reanudado la reproducci贸n de m煤sica.')
										.setColor('Green')
										.setTimestamp(),
								],
								ephemeral: true,
							});
						}
					}
					break;
				case 'resume':
					const queue2 = client.player.getQueue(guild);
					const success = queue2.setPaused(false);
					if (success) {
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉁? 鈹? 脡XITO')
									.setDescription('Se ha reanudado la reproducci贸n de m煤sica.')
									.setColor('Green')
									.setTimestamp(),
							],
							ephemeral: true,
						});
					} else {
						const reverse = queue2.setPaused(true);
						if (reverse) {
							interaction.reply({
								embeds: [
									new EmbedBuilder()
										.setTitle('鉁? 鈹? 脡XITO')
										.setDescription('Se ha pausado la reproducci贸n de m煤sica.')
										.setColor('Green')
										.setTimestamp(),
								],
								ephemeral: true,
							});
						}
					}
					break;
				case 'stop':
					const queue3 = client.player.getQueue(guild);
					queue3.destroy();
					interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('鉁? 鈹? 脡XITO')
								.setDescription('Se ha detenido la reproducci贸n de m煤sica.')
								.setColor('Green')
								.setTimestamp(),
						],
						ephemeral: true,
					});
					break;
				case 'volume':
					const queue4 = client.player.getQueue(guild);
					const volume = options.getInteger('volumen');
					if (isNaN(volume)) {
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉂? | ERROR.')
									.setDescription('El volumen debe ser un numero.')
									.setColor('Red'),
							],
							ephemeral: true,
						});
					}
					if (volume < 0 || volume > 100) {
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉂? | ERROR.')
									.setDescription('El volumen debe estar entre 0 y 100.')
									.setColor('Red'),
							],
							ephemeral: true,
						});
					}
					await queue4.setVolume(volume);
					interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle('鉁? 鈹? 脡XITO')
								.setDescription(`Se ha cambiado el volumen a ${volume}`)
								.setColor('Green')
								.setTimestamp(),
						],
						ephemeral: true,
					});
					break;
				case 'skip':
					const queue5 = client.player.getQueue(guild);
					try {
						if (queue5.tracks.length === 1) {
							interaction.reply({
								content: '鈿狅笍 No hay mas canciones en la cola',
								ephemeral: true,
							});
						}
						await queue5.skip();
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉁? 鈹? 脡XITO')
									.setDescription('Se ha saltado la cancion')
									.setColor('Green')
									.setTimestamp(),
							],
							ephemeral: true,
						});
					} catch (error) {
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉂? 鈹? ERROR')
									.setDescription('No hay mas canciones en la cola')
									.setColor('Red')
									.setTimestamp(),
							],
							ephemeral: true,
						});
					}
					break;
				case 'loop':
					const queue6 = client.player.getQueue(guild);
					if (queue6.repeatMode === 0) {
						await queue6.setRepeatMode(1);
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉁? 鈹? 脡XITO')
									.setDescription('Se ha activado el modo de repetici贸n de cancion')
									.setColor('Green')
									.setTimestamp(),
							],
							ephemeral: true,
						});
					}
					if (queue6.setRepeatMode === 1) {
						await queue6.setRepeatMode(2);
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉁? 鈹? 脡XITO')
									.setDescription('Se ha activado el modo de repetici贸n de cola')
									.setColor('Green')
									.setTimestamp(),
							],
							ephemeral: true,
						});
					}
					if (queue6.setRepeatMode === 2) {
						await queue6.setRepeatMode(0);
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉁? 鈹? 脡XITO')
									.setDescription('Se ha desactivado el modo de repetici贸n')
									.setColor('Green')
									.setTimestamp(),
							],
							ephemeral: true,
						});
					}
					break;
				case 'nowplaying':
					const queue7 = client.player.getQueue(guild);
					const trackProgress = queue7.createProgressBar({
						timecodes: true,
						length: 8,
					});
					const embed = new EmbedBuilder()
						.setTitle('馃幍 | Reproduciendo')
						.setDescription(
							`**[${queue7.current.title}](${queue7.current.url})**\n馃椏 | Solicitado por ${queue7.current.requestedBy.username}\n\n${trackProgress}`,
						)
						.setColor('Random')
						.setTimestamp();
					if (queue7.current.thumbnail) embed.setThumbnail(queue7.current.thumbnail);
					interaction.reply({ embeds: [embed], ephemeral: true });
					break;
				case 'queue':
					const queue8 = client.player.getQueue(guild);
					const trackProgress2 = queue8.createProgressBar({
						timecodes: true,
						length: 8,
					});
					const methods = ['鉂?', '馃攣 Cancion', '馃攤 Cola'];
					const songs = queue8.tracks.length;
					const nextSongs =
						songs > 5
							? `Y **${songs - 5}** canciones m谩s...`
							: `En la playlist hay **${songs}** canciones...`;
					const tracks = queue8.tracks.map(
						(track, i) =>
							`${i + 1} - 馃幍 **${track.title}** | **${track.author}** \n馃椏 - ${
								track.requestedBy.username
							}\n`,
					);
					const embedQueue = new EmbedBuilder()
						.setTitle('馃幎 鈹? Lista de reproduccion')
						.setColor('Random')
						.setThumbnail(queue8.current.thumbnail)
						.setAuthor({
							name: `Modo de repeticion actual: ${methods[queue8.repeatMode]}`,
							iconURL: client.user.displayAvatarURL({
								size: 1024,
								dynamic: true,
							}),
						})
						.setDescription(
							`Reproduciendo ahora: **${queue8.current.title} | ${
								queue8.current.author
							}**\nSolicitado por: **${
								queue8.current.requestedBy.username
							}**\n\n${trackProgress2}\n\n${tracks
								.slice(0, 5)
								.join('\n')}\n\n${nextSongs}`,
						)
						.setTimestamp()
						.setFooter({
							text: `Fiesta en casa scav`,
							iconURL: interaction.user.displayAvatarURL(),
						});
					interaction.reply({ embeds: [embedQueue], ephemeral: true });
					break;
				case 'lyrics':
					const queue9 = client.player.getQueue(guild);
					let song = queue9.current.title;
					const result = await client.lyrics.search(song);
					if (!result) {
						return interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('鉂? | ERROR.')
									.setDescription('No se encontro la letra de la cancion.')
									.setColor('Red'),
							],
							ephemeral: true,
						});
					}
					let lyrics =
						result.lyrics.length > 4095
							? result.lyrics.substring(0, 4092) + '...'
							: result.lyrics;
					interaction.reply({
						embeds: [
							new EmbedBuilder()
								.setTitle(`馃摐 | Letra de ${result.title}`)
								.setDescription(lyrics)
								.setColor('Random')
								.setThumbnail(result.thumbnail)
								.setFooter({
									text: client.user.username,
									iconUrl: client.user.displayAvatarURL({
										dynamic: true,
										size: 4096,
									}),
								}),
						],
						ephemeral: true,
					});
					break;
			}
		} catch (error) {
			const embed = new EmbedBuilder()
				.setColor('Red')
				.setTitle('Error')
				.setDescription(`\`\`\`${error}\`\`\``);
			return interaction.reply({ embeds: [embed], ephemeral: true });
		}
	},
};

function secondsToString(seconds) {
	var hour = Math.floor(seconds / 3600);
	hour = hour < 10 ? '0' + hour : hour;
	var minute = Math.floor((seconds / 60) % 60);
	minute = minute < 10 ? '0' + minute : minute;
	var second = seconds % 60;
	second = second < 10 ? '0' + second : second;
	return hour + ':' + minute + ':' + second;
}
