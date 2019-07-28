const commando = require('discord.js-commando');

class Slothme extends commando.Command{
    constructor(client){
        super(client,{
           name: 'sloth',
           group: 'doggo',
           memberName: 'sloth',
           description: 'summon a sloth hug'

        });
    }

    async run(message, args){
        let urls ={
                url: [ 'https://i.imgur.com/n1F0GgP.mp4',
                        'https://i.imgur.com/yLQVpWg.jpg',
                        'https://i.imgur.com/p1zI1rv.jpg',
                        'https://i.imgur.com/zKph6Ua.jpg',
                        'https://i.imgur.com/kbY89u4.jpg',
                        'https://i.imgur.com/5mSnK5z.jpg',
                        'https://i.imgur.com/5mSnK5z.jpg',
                        'https://i.imgur.com/rExoS0Y.jpg',
                        'https://i.imgur.com/jAPylse.jpg',
                        'https://i.imgur.com/w20niCw.gif',
                        'https://i.imgur.com/8ssrfH6.mp4',
                        'https://i.imgur.com/OHmItyp.gif',
                        'https://i.imgur.com/KwwjuNT.gif',
                        'https://i.imgur.com/50EV49Y.jpg',
                        'https://i.imgur.com/muqhKtt.mp4',
                        'https://i.imgur.com/iOYpz99.jpg',
                        'https://i.imgur.com/CIfMsqu.mp4',
                        'https://i.imgur.com/J9Uuj0Q.png',
                        'https://i.imgur.com/cumVBKV.jpg'

                     ],
                slothme : function() {
                    return this.url[Math.floor(Math.random() * this.url.length)]
                }
        }
            message.delete()
            message.reply(urls.slothme()).then(m => m.delete(20000));

        }
    }



module.exports = Slothme;