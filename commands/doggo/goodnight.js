const commando = require('discord.js-commando');

class Goodnight extends commando.Command{
    constructor(client){
        super(client,{
           name: 'goodnight',
           group: 'doggo',
           memberName: 'goodnight',
           description: 'Pets a dog'

        });
    }

    async run(message, args){
        message.delete();   
         let filter = m => m.author.id === message.author.id;
         message.channel.awaitMessages(filter,{max: 1, time: 50000})
         .then(collected => {
            console.log(collected.first().content);
            let name = collected.first().content;
                message.say(`${name} is gay`).then(m => m.delete(50000))
         }).catch(err => {console.log(err)})
    }


}

module.exports = Goodnight;