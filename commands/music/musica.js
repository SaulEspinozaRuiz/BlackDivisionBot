const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require('discord-player');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('musica')
		.setDescription('🎵 | Comandos de música')
		.addSubcommand((subcommand) =>
			subcommand
				.setName('play')
				.setDescription('🎶 | Reproduce una canción')
				.addStringOption((option) =>
					option
						.setName('cancion')
						.setDescription('🎶 | Nombre o link de la canción o playlist')
						.setRequired(true)
						.setAutocomplete(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('pause').setDescription('🎶 | Pausa la canción'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('resume').setDescription('🎶 | Reanuda la canción'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('stop').setDescription('🎶 | Detiene la canción'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('volume')
				.setDescription('🎶 | Cambia el volumen de la canción')
				.addIntegerOption((option) =>
					option
						.setName('volumen')
						.setDescription('🎶 | Volumen de la canción')
						.setRequired(true),
				),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('skip').setDescription('🎶 | Salta a la siguiente canción'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('loop').setDescription('🎶 | Repite la canción actual'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('nowplaying').setDescription('🎶 | Muestra la canción actual'),
		)
		.addSubcommand((subcommand) =>
			subcommand.setName('queue').setDescription('🎶 | Muestra la cola de canciones'),
		)
		.addSubcommand((subcommand) =>
			subcommand
				.setName('lyrics')
				.setDescription('🎶 | Muestra la letra de la canción actual'),
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
					? `🎵 | ${track.title.slice(0, 92)}...`
					: track.title.length < 1
					? `🎵 | ${track.title}...`
					: `🎵 | ${track.title}`,
			value: track.url,
		}));
		await interaction.respond(choices);
	},
	async execute(interaction, client) {
		const { options, member, guild, channel } = interaction;
		if (!member.voice.channel)
			return interaction.reply({
				content: '❌ | Debes estar en un canal de voz para usar este comando.',
				ephemeral: true,
			});
		if (
			guild.members.me.voice.channelId &&
			member.voice.channelId !== guild.members.me.voice.channelId
		)
			return interaction.reply({
				content:
					'❌ | Debes estar en el mismo canal de voz que yo para usar este comando.',
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
							content: '❌ | No se encontró ninguna canción con ese nombre.',
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
							content: '❌ | No se pudo unir al canal de voz.',
							ephemeral: true,
						});
					}
					if (!searchResult.playlist) {
						await interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle(`🎵 | Cancion - ${searchResult.tracks[0].title}`)
									.setURL(searchResult.tracks[0].url)
									.setDescription(
										`\n🎵 | Cancion anañadida a la cola\n⏳ | Duracion: **${searchResult.tracks[0].duration}**\n🗿 | Autor: **${searchResult.tracks[0].author}**`,
									)
									.setThumbnail(searchResult.tracks[0].thumbnail)
									.setColor('Random')
									.setFooter({
										text: `🎵 | Cancion añadida por ${interaction.user.tag}`,
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
									.setTitle(`🎵 | Playlist - ${searchResult.playlist.title}`)
									.setURL(searchResult.playlist.url)
									.setDescription(
										`\n🎵 | Playlist añadida a la cola\n⏳ | Duracion: **${time}**\n🗿 | Autor: **${searchResult.playlist.author.name}**`,
									)
									.setThumbnail(searchResult.playlist.thumbnail)
									.setColor('Random')
									.setFooter({
										text: `🎵 | Playlist añadida por ${interaction.user.tag}`,
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
									.setTitle('✅ ┃ ÉXITO')
									.setDescription('Se ha pausado la reproducción de música.')
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
										.setTitle('✅ ┃ ÉXITO')
										.setDescription('Se ha reanudado la reproducción de música.')
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
									.setTitle('✅ ┃ ÉXITO')
									.setDescription('Se ha reanudado la reproducción de música.')
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
										.setTitle('✅ ┃ ÉXITO')
										.setDescription('Se ha pausado la reproducción de música.')
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
								.setTitle('✅ ┃ ÉXITO')
								.setDescription('Se ha detenido la reproducción de música.')
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
									.setTitle('❌ | ERROR.')
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
									.setTitle('❌ | ERROR.')
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
								.setTitle('✅ ┃ ÉXITO')
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
								content: '⚠️ No hay mas canciones en la cola',
								ephemeral: true,
							});
						}
						await queue5.skip();
						interaction.reply({
							embeds: [
								new EmbedBuilder()
									.setTitle('✅ ┃ ÉXITO')
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
									.setTitle('❌ ┃ ERROR')
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
									.setTitle('✅ ┃ ÉXITO')
									.setDescription('Se ha activado el modo de repetición de cancion')
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
									.setTitle('✅ ┃ ÉXITO')
									.setDescription('Se ha activado el modo de repetición de cola')
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
									.setTitle('✅ ┃ ÉXITO')
									.setDescription('Se ha desactivado el modo de repetición')
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
						.setTitle('🎵 | Reproduciendo')
						.setDescription(
							`**[${queue7.current.title}](${queue7.current.url})**\n🗿 | Solicitado por ${queue7.current.requestedBy.username}\n\n${trackProgress}`,
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
					const methods = ['❌', '🔁 Cancion', '🔂 Cola'];
					const songs = queue8.tracks.length;
					const nextSongs =
						songs > 5
							? `Y **${songs - 5}** canciones más...`
							: `En la playlist hay **${songs}** canciones...`;
					const tracks = queue8.tracks.map(
						(track, i) =>
							`${i + 1} - 🎵 **${track.title}** | **${track.author}** \n🗿 - ${
								track.requestedBy.username
							}\n`,
					);
					const embedQueue = new EmbedBuilder()
						.setTitle('🎶 ┃ Lista de reproduccion')
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
									.setTitle('❌ | ERROR.')
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
								.setTitle(`📜 | Letra de ${result.title}`)
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
