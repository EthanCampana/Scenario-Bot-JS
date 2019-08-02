const commando = require('discord.js-commando');

class Pet extends commando.Command{
    constructor(client){
        super(client,{
           name: 'pet',
           group: 'doggo',
           memberName: 'pet',
           description: 'Pets a dog'

        });
    }

    async run(message, args){
    }

}

module.exports = Pet;