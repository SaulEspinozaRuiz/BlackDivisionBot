const { PermissionsBitField, ChannelType } = require('discord.js');
const client = require('../../index');
const joinToCreateSchema = require('../../models/joinToCreate');

client.on('voiceStateUpdate', async (oldState, newState) => {
	const data = await joinToCreateSchema.findOne({
		guildId: oldState.guild.id || newState.guild.id,
	});
	if (!data) return;
	if (newState?.channel == data?.channel) {
		const { guild, user, voice, id } = newState.member;
		const parent = newState.channel?.parentId;
		const parentId = parent ? { parent } : {};
		const voiceChannel = await guild.channels.create({
			name: `『🔊』Canal de ${user.username}`,
			type: ChannelType.GuildVoice,
			...parentId,
			permissionOverwrites: [
				{
					id: id,
					allow: [PermissionsBitField.Flags.Speak, PermissionsBitField.Flags.Stream],
				},
			],
		});
		// client.voiceGenerator.set(voiceChannel.id, newState.member);
		client.voiceGenerator.set(newState.member.id, voiceChannel.id);
		voice.setChannel(voiceChannel.id);
		const interval = setInterval(() => {
			if (voiceChannel.members.size === 0) {
				voiceChannel.delete();
				clearInterval(interval);
			}
		}, 500);
	}
});
