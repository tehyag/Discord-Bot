const {Client, Interaction, ApplicationCommandOptionType, PermissionsBitField} = require('discord.js');
module.exports = {

    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */

    callback: async (client, interaction) =>{
        //interaction.reply('ban...>:(');
        const targetUserId = interaction.options.get('target-user').value;
        const reason = interaction.options.get('reason')?.value || "No reason provided";

        await interaction.deferReply();

        const targetUser = await interaction.guild.members.fetch(targetUserId);

        if(!targetUser){
            await interaction.editReply("That user doesn't exist in this server.");
            return;
        }

        if(targetUser.id === interaction.guild.ownerId){
            await interaction.editReply("You can't kick them, they're the server owner!");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; //highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // highest role of the user running the command
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // highest role of the bot

        //console.log(interactions.guild.members);
        // compare roles
        if(targetUserRolePosition >= requestUserRolePosition){
            await interaction.editReply("You can't kick that user, they have the same/greater role than you.");
            return;
        }

        if(targetUserRolePosition >= botRolePosition){
           await interaction.editReply("I can't kick this user because they have the same/greater role than me");
           return;
        }

        // ban the targetUser
        try {
            await targetUser.kick(reason);
            await interaction.editReply(`User ${targetUser} was kicked. \nReason: ${reason}`);
        } catch (error) {
            console.log(`There was an error when banning: ${error}`);
        }
    },

    //deleted: true,
    name: 'kick',
    description: 'kicks a member from the server >:0',
    // devOnly: Boolean,
    // testOnly: Boolean,
    options: [
        {
            name: 'target-user',
            description: 'the user to kick',
            required: true,
            type: ApplicationCommandOptionType.Mentionable,
        },
        {
            name: 'reason',
            description: 'the reason for kicking',
            //required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    permissionsRequired : [PermissionsBitField.Flags.KickMembers],
    botPermissions : [PermissionsBitField.Flags.KickMembers],

    
};