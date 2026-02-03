const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('ranking')
        .setDescription('Muestra el top 10 de usuarios con más nivel')
        .addStringOption(option => 
            option.setName('tipo')
                .setDescription('¿Ranking de texto o de voz?')
                .setRequired(true)
                .addChoices(
                    { name: 'Texto', value: 'texto' },
                    { name: 'Voz', value: 'voz' }
                )),

    async execute(interaction) {
        const tipo = interaction.options.getString('tipo');
        const bd = JSON.parse(fs.readFileSync('./BD.json', 'utf-8'));
        
        const categoria = tipo === 'texto' ? 'niveles' : 'niveles_voz';
        const usuarios = bd[categoria]?.[interaction.guild.id];

        if (!usuarios || Object.keys(usuarios).length === 0) {
            return interaction.reply({ content: `No hay datos de niveles de **${tipo}** en este servidor.`, ephemeral: true });
        }

        const sorted = Object.entries(usuarios)
            .sort((a, b) => b[1].nivel - a[1].nivel || b[1].xp - a[1].xp)
            .slice(0, 10);

        let descripcion = "";
        for (let i = 0; i < sorted.length; i++) {
            const [id, data] = sorted[i];
            const medalla = i === 0 ? "🥇" : i === 1 ? "🥈" : i === 2 ? "🥉" : `**${i + 1}.**`;
            descripcion += `${medalla} <@${id}> - Nivel ${data.nivel} (XP: ${data.xp})\n`;
        }

        const embed = new EmbedBuilder()
            .setTitle(`🏆 Ranking de ${tipo.toUpperCase()} - ${interaction.guild.name}`)
            .setDescription(descripcion || "Aún no hay nadie en el ranking.")
            .setColor(tipo === 'voz' ? 'Green' : 'Gold')
            .setThumbnail(interaction.guild.iconURL())
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};