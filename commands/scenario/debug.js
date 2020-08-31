const commando = require('discord.js-commando');
const Discord = require('discord.js');
const fs = require('fs');
const helpful = require('./../functions/helpful.js');
const motherBrain = require('./motherBrain.js');
const { DiscordAPIError } = require('discord.js');
class Debug extends commando.Command{
    constructor(client){
        super(client,{
           name: 'debug',
           group: 'scenario',
           memberName: 'debug',
           description: 'Debugging for the game'

        });
    }

    async run(message, args){
        console.log(message);
        let server = message.guild;
         await server.createChannel("test", { type: "text" })  .then(channel => {
            let category = server.channels.find(c => c.name == "Text Channels" && c.type == "category");
        
            if (!category) throw new Error("Category channel does not exist");
            channel.setParent(category.id);
          }).catch(console.error);
        //let channel = message.guild.channels.get('631974109881827375')
        let channel2 = message.guild.channels
        //console.log(server);
        //console.log(channel2);
        //channel2.create("test");
        let d = server.channels.find(channel => channel.name === "test");
        let t = null;
       await d.send("hi");
        t = d.lastMessage;
        t.react('🍎');
        // message.channel.send("A message!");
}
}
module.exports = Debug;