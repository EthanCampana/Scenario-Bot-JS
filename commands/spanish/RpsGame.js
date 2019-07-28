const { RichEmbed } = require('discord.js');


var MagMixup = {
    //OVERVIEW OF THE SITUATION AND MIXUP
            MessageEmbed : function() { 

                let exampleEmbed = new RichEmbed()
                .setColor('#4f0b59')
                .setTitle('MIXUP')
                .setAuthor('DIFFICULTY: HARD  ★★★')
                .setDescription(`Lord Magneto is about to mix you shit up. You have five seconds to determine
                                where you must block. He can hit you both sides high and low. He can grab you or
                                fake a crossup and call psylocke assist. Time to guess the mixup!`)
                .setImage('https://media.giphy.com/media/THHOlhFmaKRnQxdc43/giphy.gif')
                .setThumbnail('https://i.imgur.com/wSTFkRM.png')
                .addBlankField()
                .addField('Options', 'bl-l, bl, bl-o-l , bl-o, grab')
                return exampleEmbed;
            },
            //NEED AI TO DETERMINE ATTACK CHOICES
            AI : {
                actions : ['at-h',
                       'at-l',
                       'call-assist',
                       'at-o-h',
                       'at-o-l',
                       'grab',
                         ],
            act: function(){
                return this.actions[Math.floor(Math.random() * this.actions.length)]
            }

            },
            //DEFENSE MAPPING
            defense :  new Map([['at-h','bl'],['call-assist','bl'],['at-l','bl-l'],['at-o-h','bl-o'],['at-o-l','bl-o-l'],['grab','grab']]),

            //NEED TO FIGURE OUT CASES AND FILLEM OUT BELOW
            0 : ['Magneto instant overheaded your ass and opened your ass up','https://media.giphy.com/media/lp7xEfgyIZyXNPNOrw/giphy.gif'],
            1 : ['Magento went low and is now cookin your ass.. Probably time to think about game two','https://media.giphy.com/media/lp7xEfgyIZyXNPNOrw/giphy.gif'],
            2 : ['Magneto stared you in your face and grabbed. GET SCOOPED BITCH. your dead','https://media.giphy.com/media/lp7xEfgyIZyXNPNOrw/giphy.gif'],
            3 : ['Magneto box jumped to the other side and overheaded your ass and snapped you out. Time to Guess again','https://media.giphy.com/media/lp7xEfgyIZyXNPNOrw/giphy.gif'],
            4 : ['Mageneto box jumped to the other side and went low. Psylocke came out with the uppercut now you getting bodied :)','https://media.giphy.com/media/lp7xEfgyIZyXNPNOrw/giphy.gif'],
            5 : ['Magento box jumped and called psylocke assist on the left side. You got schmixed b now die','https://media.giphy.com/media/lp7xEfgyIZyXNPNOrw/giphy.gif']

}

exports = module.exports = {

        mixups : [MagMixup],
        module :  rest = require('discord.js')

}