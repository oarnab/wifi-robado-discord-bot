require('dotenv').config();
const { Client, GatewayIntentBits, Collection } = require('discord.js');
const fs = require('fs');
const path = require('path');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.MessageContent
    ]
});

client.prefixCommands = new Collection();
client.slashCommands = new Collection();

// 1. Cargar Comandos de Prefijo
const prefixPath = path.join(__dirname, 'commands/prefix');
if (fs.existsSync(prefixPath)) {
    fs.readdirSync(prefixPath).forEach(file => {
        const cmd = require(path.join(prefixPath, file));
        client.prefixCommands.set(cmd.name, cmd);
    });
}

// 2. Cargar Slash Commands
const slashPath = path.join(__dirname, 'commands/slash');
if (fs.existsSync(slashPath)) {
    fs.readdirSync(slashPath).forEach(file => {
        const cmd = require(path.join(slashPath, file));
        client.slashCommands.set(cmd.data.name, cmd);
    });
}

// 3. Cargar Eventos
const eventsPath = path.join(__dirname, 'events');
fs.readdirSync(eventsPath).forEach(file => {
    const event = require(path.join(eventsPath, file));
    client.on(event.name, (...args) => event.execute(...args, client));
});


const sendErrorToDiscord = async (error, type) => {
    const channelId = process.env.ERROR_CHANNEL_ID;
    if (!channelId) return;

    try {
        const channel = await client.channels.fetch(channelId);
        if (channel) {
            const embed = {
                title: `🚨 Error Detectado: ${type}`,
                description: `\`\`\`js\n${error.stack || error}\n\`\`\``,
                color: 0xff0000, // Rojo
                timestamp: new Date(),
            };
            await channel.send({ embeds: [embed] });
        }
    } catch (err) {
        console.error('No se pudo enviar el error a Discord:', err);
    }
};

client.on('error', (error) => sendErrorToDiscord(error, 'Client Error'));

process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    sendErrorToDiscord(error, 'Uncaught Exception');
});

process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
    sendErrorToDiscord(reason, 'Unhandled Rejection');
});


client.login(process.env.DISCORD_TOKEN);