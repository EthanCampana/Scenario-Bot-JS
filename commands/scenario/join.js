const commando = require('discord.js-commando');
const { MessageEmbed } = require('discord.js');
const helpful = require('./../functions/helpful.js');

class Join extends commando.Command{
    constructor(client){
        super(client,{
           name: 'join',
           group: 'scenario',
           memberName: 'join',
           description: 'join',
           aliases: ['j', 'play']
        });
    }

    async run(message, args){
        let scenario
        if(global.games.has(global.pointer)){
            scenario = global.games.get(global.pointer)
        }else{
            message.say("Their is no game to join").then(m => {m.delete({"timeout":30000});});

        }
        if(scenario.Players){
            if(scenario.Players.length == 0){
                message.say("There are no playable characters in this scenario. create some or add them to the scenario manually");
                return;
            }
            let embed = new MessageEmbed()
            .setColor('#61ff90')
            .setTitle('PLAYERS')
            .setAuthor(scenario.Title)
            .setDescription(`Welcome! These are the heroes, villians, friends and foes that will be on this journey..
                            Choose wisely who you want to become... and reach the end of the scenario if you dare.`);

    
            helpful.displayCharacters(embed,scenario.Players);
            message.say(embed);

            let chosen = false;
            let waitattempts = 2;
          
            do{
                let filter = m => m.author.id === message.author.id;
                await message.channel.awaitMessages(filter,{max: 1, time: 200000}).then(collected =>{
                if(waitattempts == 0){
                    chosen = true;
                    return;
                }
                if(collected.first() == undefined){
                    waitattempts -=1;
                    message.say("please choose a character").then(m => {m.delete({"timeout":30000});});
                    return;
                }
                let choice = collected.first().content.toUpperCase();
                if(scenario.Players.has(choice) && scenario.Players.get(choice).playerID == null){
                    let char = scenario.Players.get(choice);
                    helpful.findSwap(message,scenario.Players,message.author.id);
                    char.playerID = message.author.id;
                    scenario.Players.set(choice,char);
                    message.say(`${message.author} has chosen ${choice}`).then(m => {m.delete({"timeout":30000});})
                    return chosen = true;
                }
                message.say("Player is not available or does not exist! You have " + waitattempts.toString() + "  attempts remaining." ).then(m => {m.delete(30000);});
                waitattempts -=1;
                return;
                });
            }
            while(chosen == false);
            console.log(scenario.Players);
            return;
        }
        message.say("Their is no game to join").then(m => {m.delete({"timeout":30000});});
    }

}

module.exports = Join;