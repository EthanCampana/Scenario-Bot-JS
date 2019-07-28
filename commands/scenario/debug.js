const commando = require('discord.js-commando');

class Debug extends commando.Command{
    constructor(client){
        super(client,{
           name: 'debug',
           group: 'doggo',
           memberName: 'debug',
           description: 'Debugging for the game'

        });
    }

    async run(message, args){

        message.delete();
        console.log(global.scenario);
        message.say("debug mode enabled");
        var debugmode = true;
        while (debugmode == true){
        let filter = m => m.author.id === message.author.id;
        await message.channel.awaitMessages(filter,{max: 1, time: 500000}).then(collected =>{
            console.log(collected.first().content);
            let action = collected.first().content;


            if(action.toUpperCase() == "PLAYERINFO"){
                console.log(global.scenario.Players);
                continue;
            }
            if(action.toUpperCase() == "OFF"){
                message.say("Debug mode Disabled"); 
                debugmode = false;
                return;
            }
            else{
                continue; 
            }
         })
        }
        message.say("End has been reached");
    }

}

module.exports = Debug;