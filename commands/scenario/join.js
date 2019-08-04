const commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const helpful = require('./../functions/helpful.js');

class Join extends commando.Command{
    constructor(client){
        super(client,{
           name: 'join',
           group: 'scenario',
           memberName: 'join',
           description: 'join',
        });
    }

    async run(message, args){
        if(global.scenario.Players){
            if(global.scenario.Players.length == 0){
                message.say("There are no playable characters in this scenario. create some or add them to the scenario manually");
                return;
            }
            let embed = new RichEmbed()
            .setColor('#61ff90')
            .setTitle('PLAYERS')
            .setAuthor(global.scenario.Title)
            .setDescription(`Welcome! These are the heroes, villians, friends and foes that will be on this journey..
                            Choose wisely who you want to become... and reach the end of the scenario if you dare.`)
            .addBlankField();

            helpful.showCharacter(embed,global.scenario.Players);
            message.say(embed);

            let chosen = false;
            var waitattempts = 5;
            do{
                let filter = m => m.author.id === message.author.id;
                await message.channel.awaitMessages(filter,{max: 1, time: 200000}).then(collected =>{
                if(waitattempts == 0){
                    chosen = true;
                    return;
                }
                if(collected.first() == undefined){
                    waitattempts -=1;
                    message.say("please say something");
                    return;
                }
                if(collected.first().content){
                    let choice = collected.first().content;
                    let chosenindex = global.scenario.Players.findIndex((value, index, array) =>{
                        if(value.playerID  !== null){return;}
                        return value.playerName == choice;})
                    if(chosenindex > -1){
                        let swap = function(array,index){array[index].playerID = "";return;};
                        helpful.findSwap(message,"playerID", message.author.id, global.scenario.Players, swap);
                        global.scenario.Players[chosenindex].playerID = message.author.id;
                        message.say("Chosen")
                        return chosen = true;
                    }
                    message.say("Player is not available or does not exist! You have " + waitattempts.toString() + "  attempts remaining." );
                    waitattempts -=1;
                    return;
                }
                });
            }
            while(chosen == false);
            return;
        }
        message.say("Their is no game to join");
    }

}

module.exports = Join;