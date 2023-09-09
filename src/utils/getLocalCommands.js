const path = require('path');
const getAllFiles = require('./getAllFiles');
module.exports = (exceptions = []) =>{
    let localCommands = [];

    const commandCatagories = getAllFiles(path.join(__dirname, '..', 'commands'), true);


    for(const commandCatagory of commandCatagories){
        const commandFiles = getAllFiles(commandCatagory);
        //console.log(commandFiles);

        for(const commandFile of commandFiles){
            const commandObject = require(commandFile);

            if(exceptions.includes(commandObject.name)){
                continue;
            }
            //console.log(commandObject);
            localCommands.push(commandObject);
            
        }

    }
    return localCommands;
};