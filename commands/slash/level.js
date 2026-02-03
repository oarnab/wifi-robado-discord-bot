const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('level')
        .setDescription('Muestra tu nivel actual o el de otro usuario')
        .addStringOption(option => 
            option.setName('tipo')
                .setDescription('¿Quieres ver el nivel de texto o de voz?')
                .setRequired(true)
                .addChoices(
                    { name: 'Texto', value: 'texto' },
                    { name: 'Voz', value: 'voz' }
                ))
        .addUserOption(option => 
            option.setName('usuario')
                .setDescription('Usuario a consultar')),

    async execute(interaction) {
        const user = interaction.options.getUser('usuario') || interaction.user;
        const tipo = interaction.options.getString('tipo');
        
        const bd = JSON.parse(fs.readFileSync('./BD.json', 'utf-8'));
        let stats;
        if(tipo === 'texto'){
            stats = bd.niveles?.[interaction.guild.id]?.[user.id];
        }else{
            stats = bd.niveles_voz?.[interaction.guild.id]?.[user.id];
        }
        

        if (!stats) {
            return interaction.reply({ 
                content: `Este usuario aún no tiene nivel de **${tipo}**.`, 
                ephemeral: true 
            });
        }

        const xpSiguienteNivel = 5 * Math.pow(stats.nivel, 2) + (50 * stats.nivel) + 100;

        const embed = new EmbedBuilder()
            .setTitle(`Nivel de ${tipo.toUpperCase()} - ${user.username}`)
            .setThumbnail(user.displayAvatarURL())
            .addFields(
                { name: 'Nivel', value: `⭐ ${stats.nivel}`, inline: true },
                { name: 'Experiencia (XP)', value: `📊 ${stats.xp} / ${xpSiguienteNivel}`, inline: true }
            )
            .setColor(tipo === 'voz' ? 'Green' : 'Blue')
            .setFooter({ text: `Consultado por ${interaction.user.tag}` })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};