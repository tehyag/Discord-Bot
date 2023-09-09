const path = require('path');
const getAllFiles = require("../utils/getAllFiles");

module.exports = (client) => {
    const eventFolders = getAllFiles(path.join(__dirname, '..', 'events'), true);

    // gets files in folder
    for(const eventFolder of eventFolders){
        const eventFiles = getAllFiles(eventFolder); 
        eventFiles.sort((a, b) => a > b);
        
        
        // conversion of slashes for Windows
        const eventName = eventFolder.replace(/\\/g, '/').split('/').pop();
        

        client.on(eventName, async (arg) => {
            for(const eventFile of eventFiles){
                const eventFunction = require(eventFile);
                await eventFunction(client,arg);
            }
        })
    }
};