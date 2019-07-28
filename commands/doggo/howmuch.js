const commando = require('discord.js-commando');

class Howmuch extends commando.Command{
    constructor(client){
        super(client,{
           name: 'howmuch',
           group: 'doggo',
           memberName: 'howmuch',
           description: 'Determine howmuch you love or hate someone',
           args: [{key: 'person', prompt: "who do you wanna ask?", type: "user" }  ] 
        });
    }

    async run(message, {person}){
    await message.delete();
    let num = Math.floor(Math.random()*1000)+1;
    console.log(message);
    console.log(person);
    message.say(`${message.author.username} Loves ${person.username} ${num}% :heart:`);   

    }


}

module.exports = Howmuch;