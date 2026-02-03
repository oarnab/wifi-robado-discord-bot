const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const fs = require('fs');

// Función auxiliar para leer los permisos
function obtenerPermisos() {
    try {
        const data = fs.readFileSync('./BD.json', 'utf-8');
        const parsed = JSON.parse(data);
        return parsed.permisos || {};
    } catch (error) {
        return {};
    }
}

module.exports = {
    data: new SlashCommandBuilder()
        .setName('listar_perms')
        .setDescription('Muestra la lista de usuarios con permisos especiales para un comando')
        .addStringOption(option => 
            option.setName('comando')
                .setDescription('Nombre del comando a consultar')
                .setRequired(true)),

    async execute(interaction) {
        const comando = interaction.options.getString('comando');
        const permisos = obtenerPermisos();
        const listaIds = permisos[comando];

        // Verificamos si existen IDs para ese comando
        if (!listaIds || listaIds.length === 0) {
            return interaction.reply({ 
                content: `❌ No hay usuarios con permisos especiales para el comando \`${comando}\`.`, 
                ephemeral: true 
            });
        }

        // Diferimos la respuesta ya que fetch de usuarios puede tardar
        await interaction.deferReply();

        try {
            // Buscamos los usuarios para obtener sus nombres
            const listaUsuarios = await Promise.all(
                listaIds.map(async (id) => {
                    try {
                        const user = await interaction.client.users.fetch(id);
                        return `• **${user.tag}** (\`${id}\`)`;
                    } catch {
                        return `• ❓ Usuario desconocido (\`${id}\`)`;
                    }
                })
            );

            const embed = new EmbedBuilder()
                .setTitle(`🔐 Permisos del comando: ${comando}`)
                .setColor(0x5865F2)
                .setDescription(listaUsuarios.join('\n'))
                .setFooter({ 
                    text: `Solicitado por ${interaction.user.tag}`, 
                    iconURL: interaction.user.displayAvatarURL() 
                })
                .setTimestamp();

            await interaction.editReply({ embeds: [embed] });

        } catch (error) {
            console.error(error);
            await interaction.editReply({ content: 'Hubo un error al intentar listar los permisos.' });
        }
    },
};