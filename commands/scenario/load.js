const commando = require('discord.js-commando');
const fs = require('fs');
const { RichEmbed } = require('discord.js');
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
        global.scenario = game;
        message.say(`${global.scenario['Title']} has been loaded successfully.`);
        let embed = new RichEmbed()
            .setColor('#61ff90')
            .setTitle(global.scenario.Title)
            .setAuthor(global.scenario.Author)
            .setDescription('SETTINGS')
            .addBlankField()
            .addField('minPlayers', global.scenario.Options.minPlayer, true)
	        .addField('maxPlayers', global.scenario.Options.maxPlayer, true)
            .addField('Creatable Characters', global.scenario.Options.canCreate, true);
            message.say(embed);
    }

}

module.exports = LoadGame;