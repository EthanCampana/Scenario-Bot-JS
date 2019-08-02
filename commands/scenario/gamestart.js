const commando = require('discord.js-commando');
const helpful = require('./../functions/helpful.js');
const motherBrain = require('./motherBrain.js');
class Gamestart extends commando.Command{
    constructor(client){
        super(client,{
           name: 'gamestart',
           group: 'scenario',
           memberName: 'gamestart',
           description: 'Starts the game'

        });
    }

    async run(message, args){
        if("Title" in global.scenario){
            helpful.Update();
            let game = new motherBrain(message,global.scenario);
            game.run();
            return;
        }
       message.say("There is no active game");
    }

}

module.exports = Gamestart;