const commando = require('discord.js-commando');
const fs = require('fs');
const motherBrain = require('./motherBrain');
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
       if(!(global.games.get(global.pointer) instanceof motherBrain)){
           message.say("You must use this command on a selected Active Game")
           return
       }
       if(message.channel.id == global.games.get(global.pointer).channel.id){
        global.games.get(global.pointer).quit();
        global.games.delete(global.pointer)
        return
       }
       message.say("You Must Call this command in an activate Game Channel!")
    }

}

module.exports = LoadGame;