const fs = require('fs');

module.exports = {
    name: 'messageCreate',
    async execute(message, client) {
        if (message.author.bot || !message.guild) return;

        const cleanContent = message.content.trim();
        const path = './BD.json';
        let bd = JSON.parse(fs.readFileSync(path, 'utf-8'));
        if (!(cleanContent.length <= 3 || /^[^a-zA-Z0-9]+$/.test(cleanContent))) {
            if (!bd.niveles) bd.niveles = {};
            if (!bd.niveles[message.guild.id]) bd.niveles[message.guild.id] = {};
            if (!bd.niveles[message.guild.id][message.author.id]) {
                bd.niveles[message.guild.id][message.author.id] = { xp: 0, nivel: 0 };
            }

            const dataUsuario = bd.niveles[message.guild.id][message.author.id];
            
            const xpGanada = Math.floor(Math.random() * 11) + 15; // 15-25 XP
            dataUsuario.xp += xpGanada;

            const xpNecesaria = 5 * Math.pow(dataUsuario.nivel, 2) + (50 * dataUsuario.nivel) + 100;

            if (dataUsuario.xp >= xpNecesaria) {
                dataUsuario.nivel++;
                dataUsuario.xp = 0;
                
                if(message.guild.id === "1425077837609828435"){
                    const logChannel = client.channels.cache.get("1463827480543760498");
                    if (logChannel) {
                        const tieneRolNoMention = member.roles.cache.some(role => role.name === "no mentions wifi");
                        const displayUser = tieneRolNoMention ? member.user.tag : `${member.user}`;
                        logChannel.send(`¡Felicidades ${message.author}! Has subido al **Nivel ${dataUsuario.nivel}** 🎉`);
                    }
                }else if(message.guild.id === "1286768449179222026"){
                    const logChannel = client.channels.cache.get("1465066038084370456");
                    if (logChannel) {
                        const tieneRolNoMention = member.roles.cache.some(role => role.name === "no mentions masoneria");
                        const displayUser = tieneRolNoMention ? member.user.tag : `${member.user}`;
                        logChannel.send(`¡Felicidades ${message.author}! Has subido al **Nivel ${dataUsuario.nivel}** 🎉`);
                    }
                }
            }

            fs.writeFileSync(path, JSON.stringify(bd, null, 2));   
        }

        const prefix = "!";
        if (!message.content.startsWith(prefix)) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.prefixCommands.get(commandName);

        if (command) {
            if (command.private === true) {
                const autorizados = bd.permisos?.[commandName] || [];
                if (!autorizados.includes(message.author.id)) {
                    const errorMsg = await message.reply("❌ Este comando es privado y no tienes permiso para usarlo.");
                    await message.delete();
                    setTimeout(() => errorMsg.delete().catch(() => {}), 3000);
                    return;
                }
            }

            command.execute(message, args);
            
            const logCmdChannel = client.channels.cache.get(process.env.LOGS_COMMANDS_CHANNEL_ID);
            if (logCmdChannel) {
                const logMsg = `El comando **${commandName}${args.length ? ' ' + args.join(' ') : ''}** fue usado por ${message.author.tag} en <#${message.channel.id}>`;
                logCmdChannel.send(logMsg);
            }
        }
    },
};