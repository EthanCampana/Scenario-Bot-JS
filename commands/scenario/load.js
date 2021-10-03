const commando = require('discord.js-commando');
const fs = require('fs');
const helpful = require('./../functions/helpful.js')
const {MessageEmbed, DiscordAPIError } = require('discord.js');
class LoadGame extends commando.Command{
    constructor(client){
        super(client,{
           name: 'loadgame',
           group: 'scenario',
           memberName: 'loadgame',
           description: 'Loads a scenario to be played in chat!',
           aliases: ['lg'],
           args: [{key: 'story', prompt: "Which story do you want to load to play?", type: "string" }  ]

        });
    }

    async run(message,{story}){
    
        let rawdata = fs.readFileSync( __dirname + `/stories/${story}.json`);
        let game = JSON.parse(rawdata);
        let scenario = game;
        helpful.Update(scenario)
        message.say(`${scenario['Title']} has been loaded successfully.`);
        let embed = new MessageEmbed() 
            .setColor('#61ff90')
            .setTitle(scenario.Title)
            .setAuthor(scenario.Author)
            .setDescription('SETTINGS')
            .addField('minPlayers', scenario.Options.minPlayer, true)
	        .addField('maxPlayers', scenario.Options.maxPlayer, true)
            .addField('Creatable Characters', scenario.Options.canCreate, true);
            message.say(embed);
        let id = `${scenario.Title}-${Math.floor(Math.random() * 10) + 1}`
        global.games.set(id,scenario)
        global.pointer = id 
    }
}

module.exports = LoadGame;