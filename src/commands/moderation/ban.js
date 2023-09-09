const {ApplicationCommandOptionType, PermissionFlagsBits, PermissionsBitField} = require('discord.js');
module.exports = {
    deleted: true,
    name: 'ban',
    description: 'bans a member from the server >:0',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'the user to ban',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'the reason for banning',
            required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    permissionsRequired : [PermissionsBitField.Flags.Administrator],
    botPermissions : [PermissionsBitField.Flags.Administrator],

    callback: (client, interaction) =>{
        interaction.reply('ban...>:(');
    },
};