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
            await interaction.editReply("You can't ban them, they're the server owner!");
            return;
        }

        const targetUserRolePosition = targetUser.roles.highest.position; //highest role of the target user
        const requestUserRolePosition = interaction.member.roles.highest.position; // highest role of the user running the command
        const botRolePosition = interaction.guild.members.me.roles.highest.position; // highest role of the bot

        //console.log(interactions.guild.members);
        // compare roles
        if(targetUserRolePosition >= requestUserRolePosition){
            await interaction.editReply("You can't ban that user, they have the same/greater role than you.");
            return;
        }

        if(targetUserRolePosition >= botRolePosition){
           await interaction.editReply("I can't ban this user because they have the same/greater role than me");
           return;
        }

        // ban the targetUser
        try {
            await targetUser.ban({ reason });
            await interaction.editReply(`User ${targetUser} was banned. \nReason: ${reason}`);
        } catch (error) {
            console.log(`There was an error when banning: ${error}`);
        }
    },

    //deleted: true,
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
            //required: true,
            type: ApplicationCommandOptionType.String,
        },
    ],

    permissionsRequired : [PermissionsBitField.Flags.BanMembers],
    botPermissions : [PermissionsBitField.Flags.BanMembers],

    
};