const mongoose = require('mongoose');

const joinToCreateSchema = mongoose.model(
	'joinToCreate',
	new mongoose.Schema({
		guildId: String,
		channel: String,
	}),
);

module.exports = joinToCreateSchema;
