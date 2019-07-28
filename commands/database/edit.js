const commando = require('discord.js-commando');

class Edit extends commando.Command{
    constructor(client){
        super(client,{
           name: 'edit',
           group: 'database',
           memberName: 'edit',
           description: 'edit'

        });
    }

    async run(message, args){
      console.log(message);
        message.edit('This is my new content!')
        .then(msg => console.log(`New message content: ${msg}`))
        .catch(console.error);
    }


}

module.exports = Edit;