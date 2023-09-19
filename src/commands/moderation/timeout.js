const {Client, Interaction, ApplicationCommandOptionType, PermissionsBitField} = require('discord.js');
const ms = require('ms');
module.exports = {
    /**
     * 
     * @param {Client} client 
     * @param {Interaction} interaction 
     */
callback: async (client, interaction) =>{
    const mentionable = interaction.options.get('target-user').value;
    const duration = interaction.options.get('duration').value;
    const reason = interaction.options.get('reason')?.value || "No reason provided";

    await interaction.deferReply();

    const targetUser = await interaction.guild.members.fetch(mentionable);
    if(!targetUser){
        await interaction.editReply("That user doesn't exist on this server");
        return;
    }
    if(targetUser.user.bot){
        await interaction.editReply("I can't put a bot in timeout");
        return;
    }

    const msDuration = ms(duration);
    if(isNaN(msDuration)){
        await interaction.editReply("Please provide a valid timeout duration");
        return;
    }

    if(msDuration < 5000 || msDuration > 2.419e9){
        await interaction.editReply("Timeout duration cannot be less than 5 seconds/greater than 28 days");
        return;
    }

    const targetUserRolePosition = targetUser.roles.highest.position; //highest role of the target user
    const requestUserRolePosition = interaction.member.roles.highest.position; // highest role of the user running the command
    const botRolePosition = interaction.guild.members.me.roles.highest.position; // highest role of the bot

    //console.log(interactions.guild.members);
    // compare roles
    if(targetUserRolePosition >= requestUserRolePosition){
        await interaction.editReply("You can't put that user in timeout, they have the same/greater role than you.");
        return;
    }

    if(targetUserRolePosition >= botRolePosition){
       await interaction.editReply("I can't put this user in timeout because they have the same/greater role than me");
       return;
    }

    // timeout the user
    try {
        const {default: prettyMs} = await import('pretty-ms');

        if(targetUser.isCommunicationDisabled()){
            await targetUser.timeout(msDuration, reason);
            await interaction.editReply(`${targetUser}'s timeout has been updated to ${prettyMs(msDuration, {verbose: true})}\nReason: ${reason}`);
            return;
        }

        await targetUser.timeout(msDuration, reason);
        await interaction.editReply(`${targetUser} has been put in timeout for ${prettyMs(msDuration, {verbose: true})}\nReason: ${reason}`);

    } catch (error) {
       console.log(`There was an error while trying to timeout someone: ${error}`); 
    }
},

    name: 'timeout',
    description: 'Puts a user in timeout',
    options: [{
        name: 'target-user',
        description: 'The user to put in timeout',
        type: ApplicationCommandOptionType.Mentionable,
        required: true
    },
    {
        name: 'duration',
        description: 'Duration of the timeout (30m, 1h, 1 day)',
        type: ApplicationCommandOptionType.String,
        required: true,
    },
    {
        name: 'reason',
        description: 'Reason for timeout',
        type: ApplicationCommandOptionType.String,
        
    },
],
permissionsRequired: [PermissionsBitField.Flags.MuteMembers],
botPermissions: [PermissionsBitField.Flags.MuteMembers],
}