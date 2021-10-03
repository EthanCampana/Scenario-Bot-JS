const commando = require('discord.js-commando');
const fs = require('fs');
const helpful = require('./../functions/helpful.js');

class CreatePlayer extends commando.Command{
    constructor(client){
        super(client,{
           name: 'create',
           group: 'scenario',
           memberName: 'create',
           description: 'Use this command to create a random player for the current scenario. ONLY WORKS IF CUSTOM CHARACTERS ARE ENABLED!',
           aliases: ['cp'],
           args: [{key: 'Name', prompt: "Name of the character you want to create.", type: "string" }  ]

        });
    }

    async run(message,{Name}){
        let scenario
        if(global.games.has(global.pointer)){
            scenario = global.games.get(global.pointer)
        }else{
            message.say("Their is no game to join").then(m => {m.delete({"timeout":30000});});
            return
        }
        if(scenario.Options == undefined){
            message.say(`${message.author} NO GAME LOADED`).then(m => {m.delete(30000);});
            return;
        }
        if(scenario.Options.canCreate){
            let player = {   
                "playerID": message.author.id,
                "playerName": `${Name}`,
                "HP": helpful.Range(scenario.Options.canCreateOptions.HP[0],scenario.Options.canCreateOptions.HP[1]),
                "Attack": helpful.Range(scenario.Options.canCreateOptions.Attack[0],scenario.Options.canCreateOptions.Attack[1]),
                "Defense": helpful.Range(scenario.Options.canCreateOptions.Defense[0],scenario.Options.canCreateOptions.Defense[1])
        }
        scenario.Players.set(player.playerName.toUpperCase(),player);
        helpful.findSwap(message,scenario.Players,message.author.id);
        message.say("Player Created!").then(m => {m.delete(30000);});
        return;
        }
        message.say("Player cannot not be created!").then(m => {m.delete(30000);});


    }

}

module.exports = CreatePlayer;