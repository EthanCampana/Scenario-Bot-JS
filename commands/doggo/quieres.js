const commando = require('discord.js-commando');

class Quieres extends commando.Command{
    constructor(client){
        super(client,{
           name: 'quieres',
           group: 'doggo',
           memberName: 'quireres',
           description: '?Quieres?'

        });
    }

    async run(message, args){
     let obj = {urls: ['https://preview.redd.it/sqc83gtay0r21.png?width=960&crop=smart&auto=webp&s=88e0ab5c3eee395703574db1cdcf90f4ad15b3fa',
                        'https://i.redd.it/kdgx1qm9f8r21.jpg','https://i.ytimg.com/vi/MiU0ZeXN17U/hqdefault.jpg','https://i.redd.it/qr6ivn00m9s21.jpg',
                        'https://pics.me.me/quieres-46429301.png']}
    message.delete();
    let url = Math.floor(Math.random()*obj.urls.length);
    message.reply(obj.urls[url]).then(m => m.delete(10000));
    }
       

}
module.exports = Quieres;