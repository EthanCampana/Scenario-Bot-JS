const commando = require('discord.js-commando');
const motherBrain = require('./motherBrain.js');
const { MessageEmbed } = require('discord.js');
const helpful = require('../functions/helpful.js');
class Gamestart extends commando.Command{
    constructor(client){
        super(client,{
           name: 'gamestart',
           group: 'scenario',
           memberName: 'gamestart',
           description: 'Starts the game',
           aliases: ['start', 'startgame', 'sg', 's']

        });
    }

    async run(message, args){
        let scenario
        if(global.games.has(global.pointer)){
        scenario = global.games.get(global.pointer)
        }
        if("Title" in scenario){
            let category = message.guild.channels.cache.get('894284353780199575')
            await message.guild.channels.create(scenario.Title, helpful.createChannel(scenario,message,category) )
            let channel  = message.guild.channels.cache.find(channel => channel.name === helpful.channelFormat(scenario.Title));
            global.games.set(global.pointer,new motherBrain(channel,scenario));
            let embed = new MessageEmbed()
            .setColor('#61ff90')
            .setTitle(scenario.Title)
            .setAuthor(scenario.Author);
            await channel.send(embed);
            global.games.get(global.pointer).run()
            return;
        }
       message.say("There is no active game");
    }

}

module.exports = Gamestart;