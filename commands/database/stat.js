const commando = require('discord.js-commando');
const fs = require('fs');
const { RichEmbed } = require('discord.js');
class Stats extends commando.Command{
    constructor(client){
        super(client,{
           name: 'stats',
           group: 'database',
           memberName: 'stats',
           description: 'Get your personal player Stats.'

        });
    }

    async run(message, args){
    message.delete();
    let rawdata = fs.readFileSync( __dirname +'/database.json');  
    let database = JSON.parse(rawdata);  
    const exampleEmbed = new RichEmbed()
	.setColor('#0099ff')
	.setTitle(`${message.author.username}`)
	.setAuthor('USER STATS')
	.setDescription('User personal stats and information')
	.addBlankField()
	.addField('Merits', `${database[`${message.author.id}`]['merits']}`, true)
	.addField('Demerits', `${database[`${message.author.id}`]['demerits']}`, true)
	.addField('Inventory', `none`, true)
    
    message.say(exampleEmbed).then(m => m.delete(20000));

}


}

module.exports = Stats;