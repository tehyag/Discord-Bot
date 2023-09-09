require('dotenv').config();
const {Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require('discord.js'); //

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds, 
        GatewayIntentBits.GuildMembers, 
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ],
});

const roles = [
    {
        id:'1138937952953700423',
        label: 'lil-guy',
    },
    {
        id:'1138938048512536660',
        label: 'babygirl',
    },
]

client.on('ready', async (c) =>{
    try {
        const channel = await client.channels.cache.get('939652274970562602');
        if(!channel) return;

        const row = new ActionRowBuilder();

        roles.forEach((role) => {
            row.components.push(
                new ButtonBuilder().setCustomId(role.id).setLabel(role.label).setStyle(ButtonStyle.Primary)
            )
        })

        await channel.send({
            content: 'Claim or remove a role below.',
            components: [row],
        });
        process.exit();
    } catch (error) {
        console.log(error);
    }
});

client.login(process.env.TOKEN);