const { SlashCommandBuilder } = require('discord.js');
const fs = require('fs');

function leerInsultos() {
    const data = fs.readFileSync('./BD.json');
    return JSON.parse(data);
}

function guardarInsultos(datos) {
    fs.writeFileSync('./BD.json', JSON.stringify(datos, null, 2));
}
module.exports = {
    private : true,
    data: new SlashCommandBuilder()
        .setName('agregar_ins')
        .setDescription('Agrega un insulto a la lista')
        .addStringOption(option => 
            option.setName('insulto')
                .setDescription('El insulto a agregar')
                .setRequired(true)),
    async execute(interaction) {
        const insultos = JSON.parse(fs.readFileSync('./BD.json', 'utf-8')).insultos || [];
        const lista = leerInsultos();
        if(!lista.insultos){
            lista.insultos = [];
        }
        const nuevoInsulto = interaction.options.getString('insulto');
        lista.insultos.push(nuevoInsulto);
        guardarInsultos(lista);
        await interaction.reply({content: `Insulto "${nuevoInsulto}" agregado a la lista.`, ephemeral: true});
    },
};