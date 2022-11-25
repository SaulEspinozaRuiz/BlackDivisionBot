require('dotenv').config();

module.exports = {
	bot: {
		token: process.env.BOT_TOKEN || 'Your bot token here',
		clientId: process.env.BOT_CLIENT_ID || 'Your client id bot here',
		guildId: process.env.GUILD_ID || 'Your guild id here',
	},
	lyrics: process.env.LYRICS || 'Your api token of lyrics page',
	developerId: process.env.DEVELOPER_ID || '618955575212113970',
	db: process.env.DB || 'a url of mongodb',
};
