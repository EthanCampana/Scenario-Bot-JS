const commando = require('discord.js-commando');
const fs = require('fs');
const helpful = require('./../functions/helpful.js');
const motherBrain = require('./motherBrain.js');
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
        console.log(message);
        message.delete();
        console.log(global.scenario);
        message.say("debug mode enabled");
        var debugmode = true;
        let filter = m => m.author.id === message.author.id;
        while (debugmode == true){
        await message.channel.awaitMessages(filter,{max: 1, time: 500000}).then(collected =>{
            console.log(collected.first().content);
            let action = collected.first().content;
            if(action.toUpperCase().replace(/ /g,'') ==="SECRETRUN"){
                helpful.Update();
                let game = new motherBrain(message,global.scenario);
                game.run();
            }
            if(action.toUpperCase().replace(/ /g,'') ==="LOADBASIC" ){
                let rawdata = fs.readFileSync( __dirname + `/stories/game.json`);
                let game = JSON.parse(rawdata);
                global.scenario = game;
                let player1 = {   
                    "playerID": "",
                    "playerName": `a`,
                    "playerHP": 100,
                    "playerAttack": 20,
                    "playerDefense": 30
                        }
                        let player3 = {   
                        "playerID": "",
                        "playerName": `b`,
                        "playerHP": 100,
                        "playerAttack": 20,
                        "playerDefense": 30
                        }
                    let player2 = {   
                    "playerID": "",
                    "playerName": `c`,
                    "playerHP": 100,
                    "playerAttack": 20,
                    "playerDefense": 30
                        }
                    helpful.addUser(player1);
                    helpful.addUser(player2);
                    helpful.addUser(player3);
            }
            if(action.toUpperCase() == "PLAYERINFO"){
                console.log(global.scenario.Players);
                
            }
            if(action.toUpperCase() == "OFF"){
                message.say("Debug mode Disabled"); 
                debugmode = false;
                return;
            }
            else{
            }
         });
        }
        message.say("End has been reached");
    }

}

module.exports = Debug;