const commando = require('discord.js-commando');
const helpful = require('./../functions/helpful.js');
const motherBrain = require('./motherBrain.js');
const { RichEmbed } = require('discord.js');
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
            helpful.Update();
            let game = new motherBrain(message,global.scenario);
            let embed = new RichEmbed()
            .setColor('#61ff90')
            .setTitle(global.scenario.Title)
            .setAuthor(global.scenario.Author);
            await message.say(embed);
            game.run();
            return;
        }
       message.say("There is no active game");
    }

}

module.exports = Gamestart;