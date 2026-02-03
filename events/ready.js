const { REST, Routes, ActivityType } = require('discord.js');
const fs = require('fs');
const pathBD = './BD.json';

module.exports = {
    name: 'ready',
    once: true,
    async execute(client) {
        console.log(`✅ Conectado como ${client.user.tag}`);

        // Estado personalizado
        client.user.setPresence({
            activities: [{ name: 'Hector desnudo', type: ActivityType.Watching }],
            status: 'online',
        });

    
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        
        try {
            const commandsJSON = client.slashCommands.map(cmd => cmd.data.toJSON());
            
            console.log(`Cargando ${commandsJSON.length} comandos Slash en el servidor...`);

            await rest.put(
                //Routes.applicationGuildCommands(process.env.CLIENT_ID, process.env.GUILD_ID),
                Routes.applicationCommands(process.env.CLIENT_ID),
                { body: commandsJSON }
            );

            console.log('¡Comandos Slash registrados correctamente en el servidor!');
        } catch (error) {
            console.error('Error al registrar comandos:', error);
        }
        try{
            client.channels.cache.get('1463878923279405066').send(`✅ Bot reiniciado y listo. Conectado como ${client.user.tag}`);
        } catch(err){
            console.log("No se pudo enviar el mensaje de reinicio al canal de logs.");
        }

        console.log(`Sistema de niveles por voz activado para ${client.user.tag}`);

        setInterval(async () => { // Añadimos async aquí
            let bd = JSON.parse(fs.readFileSync(pathBD, 'utf-8'));
            if (!bd.niveles_voz) bd.niveles_voz = {};

            for (const [guildId, guild] of client.guilds.cache) {
                if (!bd.niveles_voz[guildId]) bd.niveles_voz[guildId] = {};

                const voiceChannels = guild.channels.cache.filter(c => c.isVoiceBased());

                for (const [channelId, channel] of voiceChannels) {
                    const members = channel.members; 

                    const realMembers = members.filter(m => 
                        !m.user.bot && 
                        !m.voice.selfDeaf && 
                        !m.voice.selfMute &&
                        !m.voice.serverMute &&
                        !m.voice.serverDeaf
                    );
                    //console.log(`Canal: ${channel.name} | Miembros reales activos: ${realMembers.size}`);
                    if (realMembers.size >= 2) {
                        realMembers.forEach(member => {
                            // Verificación extra de seguridad
                            if (!member.voice.channelId || member.voice.channelId !== channel.id) return;
                            if (member.voice.selfDeaf || member.voice.selfMute) {
                                //console.log(`Skipping ${member.user.tag}: Está muteado o ensordecido.`);
                                return;
                            }

                            if (!bd.niveles_voz[guildId][member.id]) {
                                bd.niveles_voz[guildId][member.id] = { xp: 0, nivel: 0 };
                            }

                            const dataUsuario = bd.niveles_voz[guildId][member.id];
                            const xpGanada = Math.floor(Math.random() * 6) + 15; // 15-20 XP
                            dataUsuario.xp += xpGanada;

                            client.channels.cache.get("1464593631481696465").send(`+${xpGanada} XP de voz a ${member.user.tag} en ${guild.name} (Canal: ${channel.name})`);

                            const xpNecesaria = 5 * Math.pow(dataUsuario.nivel, 2) + (50 * dataUsuario.nivel) + 100;
                            if (dataUsuario.xp >= xpNecesaria) {
                                dataUsuario.nivel++;
                                dataUsuario.xp = 0;
                                if (guild.id === "1425077837609828435") {
                                    const logChannel = client.channels.cache.get("1463827480543760498");
                                    if (logChannel) {
                                        const tieneRolNoMention = member.roles.cache.some(role => role.name === "no mentions wifi");

                                        const displayUser = tieneRolNoMention ? member.user.tag : `${member.user}`;

                                        logChannel.send(`🎙️ ¡${displayUser}! Has subido al **Nivel ${dataUsuario.nivel}** por voz.`);
                                    }
                                }else if (guild.id === "1286768449179222026") {
                                    const logChannel = client.channels.cache.get("1465066038084370456");
                                    if (logChannel) {
                                        const tieneRolNoMention = member.roles.cache.some(role => role.name === "no mentions masoneria");

                                        const displayUser = tieneRolNoMention ? member.user.tag : `${member.user}`;

                                        logChannel.send(`🎙️ ¡${displayUser}! Has subido al **Nivel ${dataUsuario.nivel}** por voz.`);
                                    }
                                }
                            }
                        });
                    }
                }
            }
            fs.writeFileSync(pathBD, JSON.stringify(bd, null, 2));
        }, 60000); // 60 segundos
    },
};