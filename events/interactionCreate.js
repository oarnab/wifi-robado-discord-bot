const fs = require('fs');

module.exports = {
    name: 'interactionCreate',
    async execute(interaction, client) {
        if (!interaction.isChatInputCommand()) return;

        const command = client.slashCommands.get(interaction.commandName);
        if (!command) return;

        // --- LÓGICA DE PRIVACIDAD ---
        if (command.private === true) {
            const permisos = JSON.parse(fs.readFileSync('./BD.json', 'utf-8')).permisos;
            const autorizados = permisos[command.data.name] || [];
            if (!autorizados.includes(interaction.user.id)) {
                return interaction.reply({ 
                    content: "❌ No tienes permiso para usar este comando privado.", 
                    ephemeral: true 
                });
            }
        }
        // ----------------------------

        try {
            await command.execute(interaction);
            const logCmdChannel = client.channels.cache.get(process.env.LOGS_COMMANDS_CHANNEL_ID);
            logCmdChannel.send(`El comando de slash **${interaction.commandName}** fue usado por ${interaction.user.tag} en <#${interaction.channel.id}> (${interaction.channel.name}).`);
        } catch (error) {
            console.error(error);
            await interaction.reply({ content: 'Error ejecutando el comando.', ephemeral: true });
        }
    },
};