const client = require('../../index');
const channels = require('../../constants/channels');

client.on('messageCreate', async (message) => {
	if (message.author.bot) return;
	if (message.channel.id === channels.principal.imagenes) {
		if (message.attachments?.size === 0) {
			return message.delete().catch(() => {});
		}
		if (message.content.startsWith('https://')) {
			return;
		}
	}
	if (message.channel.id === channels.principal.comandos) {
		return message.delete().catch(() => {});
	}
	if (message.channel.id === channels.soporte.reportes) {
		return message.delete().catch(() => {});
	}
	if (message.channel.id === channels.soporte.sugerencias) {
		return message.delete().catch(() => {});
	}
	if (message.channel.id === channels.soporte.soporte) {
		return message.delete().catch(() => {});
	}
	if (message.channel.id === channels.charlas.configChannel) {
		return message.delete().catch(() => {});
	}
});
