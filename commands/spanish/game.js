const commando = require('discord.js-commando');
const r = require('./Translate')

class Game extends commando.Command{
    constructor(client){
        super(client,{
           name: 'game',
           group: 'spanish',
           memberName: 'game',
           description: 'play a spanish game with your spanish teacher',
           args: [{ key: 'words', prompt: 'What words you want to be translated', type: 'string',}]

        });
    }

    async run(message, { words }) {
        let key = 'trnsl.1.1.20190713T230010Z.25fcdc2375ca3a1e.ad79a448e0cc04c00fa325d5d930f1c91a25a345';
        var url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${words}&lang=es`;
        console.log(url)
        var answer
        r.Translate(url).then(res => {console.log(res.text[0]); answer = res.text[0]; });
        message.reply(`¿Cómo se dice ${words} en español?`).then(m => m.delete(10000));
        let filter = m => m.author.id === message.author.id;
        message.channel.awaitMessages(filter,{max: 1, time: 30000})
        .then(collected => {
            if(collected.first().content === answer){
                message.say('Yipeee correcto')
            }
            else{
                message.say('Idiot >:(').then(m => m.delete(10000));
                message.say('the answer was: ' + answer).then(m => m.delete(10000));
            }
        });




    }


}

module.exports = Game;