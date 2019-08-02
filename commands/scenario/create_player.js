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
           args: [{key: 'Name', prompt: "Name of the character you want to create.", type: "string" }  ]

        });
    }

    async run(message,{Name}){
    if(global.scenario.Options == undefined){
        message.say("NO GAME");
        return;
    }
    if(global.scenario.Options.canCreate){
        let player = {   
            "playerID": message.author.id,
            "playerName": `${Name}`,
            "playerHP": helpful.Range(global.scenario.Options.canCreateOptions.HP[0],global.scenario.Options.canCreateOptions.HP[1]),
            "playerAttack": helpful.Range(global.scenario.Options.canCreateOptions.Attack[0],global.scenario.Options.canCreateOptions.Attack[1]),
            "playerDefense": helpful.Range(global.scenario.Options.canCreateOptions.Defense[0],global.scenario.Options.canCreateOptions.Defense[1])
    }

       global.scenario.Players.push(player);
       let swap = function(array,index){array[index].playerID = "";return;};
       helpful.findSwap(message,"playerID", message.author.id, global.scenario.Players, swap);
    
        message.say("Player Created!");

    return;
    }
    message.say("Player cannot not be created!");


    }

}

module.exports = CreatePlayer;