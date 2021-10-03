
const commando = require('discord.js-commando');
const Discord = require('discord.js');
const { MessageEmbed } = require('discord.js');
class selectgame extends commando.Command{
    constructor(client){
        super(client,{
           name: 'selectgame',
           group: 'scenario',
           memberName: 'selectgame',
           description: 'Select an Active game you want to work on',
           aliases: ['p','select']
        });
    }

    async run(message, args){
        let embed = new MessageEmbed()
        embed.setTitle("Loaded Games")
        for( let x of global.games.entries()){
            if(x[0] == global.pointer){
            embed.addField(`* ${x[0]}`,`not-Running`) 
            continue   
            }
            embed.addField(x[0],`not-Running`)
        }
        message.say(embed)
        let filter = m => m.author.id === message.author.id;
        await message.channel.awaitMessages(filter,{max: 1, time: 200000}).then(collected =>{
            if(global.games.has(collected.first().content)){
                global.pointer = collected.first().content
                message.say(`${collected.first().content} has been selected`)
            }
        })
        .catch(collected => this.logging(`The user chose no option because collected is ${collected}`));

}
}
module.exports = selectgame;