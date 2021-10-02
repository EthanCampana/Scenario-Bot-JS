const commando = require('discord.js-commando');
const motherBrain = require('./motherBrain.js');
const { MessageEmbed } = require('discord.js');
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
        if("Title" in global.scenario){
            //helpful.Update();
           
            await message.guild.channels.create(global.scenario.Title, { type: "text" })
            let channel  = message.guild.channels.cache.find(channel => channel.name === "the-heros-dungeon");
            global.game = new motherBrain(channel,global.scenario);
            let embed = new MessageEmbed()
            .setColor('#61ff90')
            .setTitle(global.scenario.Title)
            .setAuthor(global.scenario.Author);
            await channel.send(embed);
            global.game.run();
            return;
        }
       message.say("There is no active game");
    }

}

module.exports = Gamestart;