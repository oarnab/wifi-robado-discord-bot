module.exports = {
    name: 'decirmason',
    private: true,
    async execute(message, args) {
        // 1. Verificación: ¿Hay texto o hay imágenes adjuntas?
        if (args.length === 0 && message.attachments.size === 0) {
            const errorMsg = await message.reply('❌ Debes escribir un mensaje o subir una imagen.');
            
            setTimeout(async () => {
                try {
                    await errorMsg.delete();
                    await message.delete();
                } catch (err) {
                    console.log("Error al limpiar mensajes.");
                }
            }, 3000);
            return;
        }

        const targetChannel = message.mentions.channels.first();
        let text;
        let sendChannel;

        // 2. Lógica de detección de canal
        if (targetChannel && args[0] && args[0].includes(targetChannel.id)) {
            text = args.slice(1).join(' ');
            sendChannel = targetChannel;
        } else {
            text = args.join(' ');
            sendChannel = message.channel;
        }

        // 3. Recopilar todos los archivos adjuntos (imágenes)
        // Usamos .map para obtener la URL de cada archivo si hay varios
        const attachments = message.attachments.map(a => a.url);

        try {
            // Borramos el comando original para que no se vea quién lo usó
            await message.delete();

            // 4. Envío del mensaje
            await sendChannel.send({
                content: text || null, // Si no hay texto, se envía solo la imagen
                files: attachments     // Esto hace que se rendericen como imágenes en el chat
            });

        } catch (error) {
            console.error('Error al enviar el mensaje con imagen:', error);
        }
    },
};