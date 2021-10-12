const commando = require('discord.js-commando');
const helpful = require('./../functions/helpful.js');
const debugBrain = require('./debugBrain.js');
const { DiscordAPIError } = require('discord.js');
class Debug extends commando.Command{
    constructor(client){
        super(client,{
           name: 'debug',
           group: 'scenario',
           memberName: 'debug',
           description: 'Debugging for the game'

        });
    }

    async run(message, args){
        let scenario
        if(global.games.has(global.pointer)){
        scenario = global.games.get(global.pointer)
        }
        if("Title" in scenario){
            let c_name = `debug-room-${Math.Floor(Math.random()*10)}`
            await message.guild.channels.create(c_name,helpful.createDebugChannel(message))
            let channel  = message.guild.channels.cache.find(channel => channel.name === c_name);
            let debugRoom = new debugBrain(channel,scenario,message.author)
            debugRoom.run() 
        }
        else{
            message.say("You can only open Debug Mode on an inactive Game")
        }
    }
}
module.exports = Debug;