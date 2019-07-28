const commando = require('discord.js-commando');
const r = require('./Translate')

class Trans extends commando.Command{
    constructor(client){
        super(client,{
           name: 'translate',
           group: 'spanish',
           memberName: 'translate',
           description: 'Translate given text to a given language',
           args: [{key: 'lang', prompt: 'Language you want to be translated to', type: 'string'},
                {key: 'words', prompt: 'What words you want to be translated', type: 'string',}]

        });
    }

    async run(message, { words, lang }) {
        let key = 'trnsl.1.1.20190713T230010Z.25fcdc2375ca3a1e.ad79a448e0cc04c00fa325d5d930f1c91a25a345';
        var url = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${key}&text=${words}&lang=${lang}`;
        console.log(url)
        var answer
        r.Translate(url).then(res => {console.log(res.text);  return answer = res.text[0]; }).then(answer =>{
            message.say(`Here how you say, ${words} in ${lang} : ${answer}`)
        });
       



    }


}

module.exports = Trans;