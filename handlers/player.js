const { Player } = require('discord-player');
const { Lyrics } = require('@discord-player/extractor');
const colors = require('colors');

module.exports = async (client) => {
	const player = new Player(client, {
		ytdlOptions: {
			quality: 'highestaudio',
			highWaterMark: 1 << 25,
			liveBuffer: 60000,
		},
	});
	client.player = player;
	client.lyrics = Lyrics.init(client.config.lyrics);
	console.log('[HANDLER] - ¡El modulo de musica se cargo exitosamente!'.blue);
};
