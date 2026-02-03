const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    private : true,
    data: new SlashCommandBuilder()
        .setName('listar_ins')
        .setDescription('Lista los insultos disponibles'),
    async execute(interaction) {
        const insultos = JSON.parse(fs.readFileSync('./BD.json', 'utf-8')).insultos || [];
        const lista_insultos = insultos.join('\n- ');
        const chunks = lista_insultos.match(/[\s\S]{1,2000}/g);
        for (const chunk of chunks) {
            if (!interaction.replied) {
                await interaction.reply({ content: chunk, ephemeral: true });
            } else {
                await interaction.followUp({ content: chunk, ephemeral: true });
            }
        }
    },
};