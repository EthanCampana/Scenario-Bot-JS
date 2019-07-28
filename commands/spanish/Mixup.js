const commando = require('discord.js-commando');
const { RichEmbed } = require('discord.js');
const m = require('./RpsGame')
class Mixup extends commando.Command{
    constructor(client){
        super(client,{
           name: 'mixup',
           group: 'spanish',
           memberName: 'mixup',
           description: 'Will you be able to block the mixup'

        });
    }

    async run(message, args){  
        message.delete()
        let mixup = m.mixups[0];


    message.say(mixup.MessageEmbed()).then(m => {m.delete(30000);});
    
    let defense = mixup.defense;


    let attack = mixup.AI.act();
    let index = mixup.AI.actions.indexOf(attack);

    let filter = m => m.author.id === message.author.id;
    message.say('Choose your option Now Hurry').then(m => {m.delete(30000);});

    message.channel.awaitMessages(filter,{max: 1, time: 10000})
        .then(collected => {
            if(defense.get(attack) === collected.first().content ){
                message.say('You successfuly defended against Magneto onslaught.').then(m => m.delete(10000));
                return;
            }
            message.say('You got cooked').then(m => m.delete(10000));

            switch(index){
                case 0:
                    mixup[0].forEach(function(element) {
                        message.say(element).then(m => m.delete(10000));
                    })
                    break;
                case 1:
                    mixup[1].forEach(function(element) {
                        message.say(element).then(m => m.delete(10000));
                    })
                    break;
                case 2:
                    mixup[2].forEach(function(element) {
                        message.say(element).then(m => m.delete(10000));
                    })
                    break;
                case 3:
                    mixup[3].forEach(function(element) {
                        message.say(element).then(m => m.delete(10000));
                    })
                    break;
                case 4:
                    mixup[4].forEach(function(element) {
                        message.say(element).then(m => m.delete(10000));
                    })
                    break;
                case 5:
                    mixup[5].forEach(function(element) {
                        message.say(element).then(m => m.delete(10000));
                    })
                    break;

            }
        })
         

       


}
}
module.exports = Mixup;
