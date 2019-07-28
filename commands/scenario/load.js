const commando = require('discord.js-commando');
const fs = require('fs');

class LoadGame extends commando.Command{
    constructor(client){
        super(client,{
           name: 'loadgame',
           group: 'scenario',
           memberName: 'loadgame',
           description: 'Loads a scenario to be played in chat!',
           args: [{key: 'story', prompt: "Which story do you want to load to play?", type: "string" }  ]

        });
    }

    async run(message,{story}){
    
        let rawdata = fs.readFileSync( __dirname + `/stories/${story}.json`);
        let game = JSON.parse(rawdata);
        global.scenario = game;
        message.say(`${global.scenario['Title']} has been loaded successfully.`);

    }

}

module.exports = LoadGame;