const commando = require('discord.js-commando');
const fs = require('fs');
class LoadGame extends commando.Command{
    constructor(client){
        super(client,{
           name: 'quit',
           group: 'scenario',
           memberName: 'quit',
           description: 'Stops the current game',
           aliases: ['stop','qg']

        });
    }

    async run(message){
       global.game.quit();
    }

}

module.exports = LoadGame;