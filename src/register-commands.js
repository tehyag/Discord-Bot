require('dotenv').config();
const { REST, Routes, ApplicationCommandOptionType} = require('discord.js');

const commands = [
    {
       name: 'embed',
       description: 'sends an embed',   
    },
];

const rest = new REST({ version: '10'}).setToken(process.env.TOKEN);

(async() => {
    try {
        console.log('Registering slash commands...');

        await rest.put(
            Routes.applicationGuildCommands(
                process.env.CLIENT_ID, 
                process.env.GUILD_ID
                ),
            {body: commands}
       );

        console.log('Slash commands have been registered successfully');
    } catch (error) {
        console.log(`there was an error: ${error}`);
    }
})();