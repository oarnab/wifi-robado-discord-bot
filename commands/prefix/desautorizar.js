const fs = require('fs');

function leerPermisos() {
    const data = fs.readFileSync('./BD.json');
    return JSON.parse(data);
}

function guardarPermisos(datos) {
    fs.writeFileSync('./BD.json', JSON.stringify(datos, null, 2));
}

module.exports = {
    name: 'desautorizar',
    async execute(message, args) {
        const text = args.join(' ');
        let users_permitted = ['434063809209171968'];
        if(users_permitted.includes(message.author.id)) {
            const target = message.mentions.users.first() || args[0];
            const comando = args[1];
            if (!target) {
                const errorMsg = await message.reply('Menciona a alguien o pon su ID');
                
                setTimeout(async () => {
                    try {
                        await errorMsg.delete();
                        await message.delete();
                    } catch (err) {
                        console.log("El mensaje ya había sido borrado o falta de permisos.");
                    }
                }, 1000);
                
                return;
            }
            if(!comando){
                const errorMsg = await message.reply('Introduzca el comando a autorizar');
                
                setTimeout(async () => {
                    try {
                        await errorMsg.delete();
                        await message.delete();
                    } catch (err) {
                        console.log("El mensaje ya había sido borrado o falta de permisos.");
                    }
                }, 1000);
                
                return;
            }

            const targetId = typeof target === 'string' ? target : target.id;
            let permisos = leerPermisos();
            
            if(!permisos.permisos){
                permisos.permisos = {};
            }

            if (!permisos.permisos[comando]) {
                permisos.permisos[comando] = [];
            }

            if (permisos.permisos[comando].includes(targetId)) {
                permisos.permisos[comando] = permisos.permisos[comando].filter(id => id !== targetId);
                guardarPermisos(permisos);
                const replyMsg = await message.reply(`Usuario ${targetId} desautorizado.`);
                setTimeout(async () => {
                try {
                    await message.delete();
                    await replyMsg.delete();
                } catch (err) {
                    console.log("El mensaje ya había sido borrado o falta de permisos." +  err);
                }
            }, 1000);
            } else {
                const errorMsg = await message.reply("Ese usuario no tiene permisos.");
                setTimeout(async () => {
                try {
                    await errorMsg.delete();
                    await message.delete();
                } catch (err) {
                    console.log("El mensaje ya había sido borrado o falta de permisos." +  err);
                }
            }, 1000);
            } 
            
        }
    },
};