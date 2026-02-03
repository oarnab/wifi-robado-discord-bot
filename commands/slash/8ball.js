const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball')
        .setDescription('Hazle una pregunta a la bola 8 mágica')
        .addStringOption(option => 
            option.setName('pregunta')
                .setDescription('¿Qué quieres preguntarle a la bola?')
                .setRequired(true)),

    async execute(interaction) {
        const pregunta = interaction.options.getString('pregunta');
        
        const respuestas = [
            '¡Sí!', 'No.', 'Tal vez...', 'Probablemente.', 'Definitivamente sí.',
            'Ni lo sueñes.', 'No puedo predecirlo ahora.', 'Pregunta de nuevo más tarde.',
            'Mis fuentes dicen que no.', 'Es cierto.', 'Sin duda alguna.',
            'Concéntrate y pregunta otra vez.', 'Perspectiva buena.', 'Muy dudoso.'
        ];

        const respuestaFinal = respuestas[Math.floor(Math.random() * respuestas.length)];

        const embed = new EmbedBuilder()
            .setTitle('🎱 La Bola 8 Mágica dice...')
            .setThumbnail('https://cdn.pixabay.com/photo/2012/04/16/11/05/ball-35516_1280.png')
            .addFields(
                { name: 'Pregunta:', value: pregunta },
                { name: 'Respuesta:', value: `**${respuestaFinal}**` }
            )
            .setColor('Random')
            .setFooter({ text: `Preguntado por ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
            .setTimestamp();

        await interaction.reply({ embeds: [embed] });
    }
};