const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    private: false,
    data: new SlashCommandBuilder()
        .setName('ping')
        .setDescription('Revisa la latencia del bot'),
    async execute(interaction) {
        await interaction.reply(`🏓 Pong! Latencia: ${interaction.client.ws.ping}ms`);
    },
};