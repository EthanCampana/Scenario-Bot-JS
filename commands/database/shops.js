const commando = require('discord.js-commando');
const fs = require('fs');
const helpful = require('../functions/helpful.js');
const { RichEmbed } = require('discord.js');


class Shop extends commando.Command{
    constructor(client){
        super(client,{
           name: 'shop',
           group: 'database',
           memberName: 'shop',
           description: 'shop'

        });
    }

    async run(message, args){
        message.delete();
        if(message.channel.id !== "605206992629530626"){
            message.say("I DONT SELL TO NIGGAS").then(m => {m.delete(7000);});
            return;
        }
        let rawdata = fs.readFileSync( __dirname +'/database.json');  
        let database = JSON.parse(rawdata);
        let rawdata2 = fs.readFileSync( __dirname +'/shop.json');   
        let shop = JSON.parse(rawdata2);
        let currentstock = [];
        let embed = new RichEmbed()
        .setColor('#61ff90')
        .setTitle('----SHOP----')
        .setThumbnail('https://previews.123rf.com/images/alexgorka/alexgorka1810/alexgorka181000131/110974013-now-open-sign-.jpg')
        .setDescription("WELCOME to my shop. You may look but not touch! Touching is only for buying customers!")
        .setImage('https://thepoodleanddogblog.typepad.com/.a/6a00d83451580669e20120a6e7e6bc970b-600wi')
        for(let i = 0; i < 3; i++){
           let item = shop.Items[helpful.Range(0,shop.Items.length-1)];
            currentstock.push(item);
            embed.addField(item.name, item.description + "\n" +  "price: " + item.cost);
        }
        console.log(embed.fields);
        message.say(embed).then(m => {m.delete(900000);});
        let hasLeft = false;
        let filter = m => m.author.id === message.author.id;
        let waittime = 5;
        do{
            await message.channel.awaitMessages(filter,{max: 1, time: 15000}).then(collected =>{
                if(waittime == 0){
                    hasLeft = true;
                    return;
                }
                if(collected.first() == undefined){
                    waittime -=1;
                    message.say("Arrrrrrge you gonna buy anything or just loiter??? ").then(m => {m.delete(7000);});
                    return
                }
                let action = collected.first().content;
                if(action.toUpperCase() == "LEAVE" || action.toUpperCase() == "BYE"){ message.say("see Yaa!").then(m => {m.delete(5000);}); return hasLeft = true;}
                let index = currentstock.findIndex((value, index, array) => {return value.name == action;});
                if(index > -1){
                    let item = currentstock[index];
                    let user = database[`${message.author.id}`];
                    let canbuy = function (item, user){
                        if(item.cost == "SOLD"){return false;}
                        if(user.merits > item.cost){return true;}
                        else{return false;}
                    }
                    if(canbuy(item,user)){
                        user.merits -= item.cost;
                        user.inventory.push(item);
                        database[`${message.author.id}`] = user;
                        currentstock[index].cost = "SOLD";
                        
                        let embed = new RichEmbed()
                        .setColor('#61ff90')
                        .setTitle('----SHOP----')
                        .setThumbnail('https://previews.123rf.com/images/alexgorka/alexgorka1810/alexgorka181000131/110974013-now-open-sign-.jpg')
                        .setDescription("WELCOME to my shop. You may look but not touch! Touching is only for buying customers!")
                        .setImage('https://thepoodleanddogblog.typepad.com/.a/6a00d83451580669e20120a6e7e6bc970b-600wi')
                        for(let i = 0; i < 3; i++){
                           let item = currentstock[i];
                            embed.addField(item.name, item.description + "\n" +  "price: " + item.cost);
                        }
                        message.say(embed).then(m => {m.delete(30000);});
                        return;
                    }
                    message.say("You cannot buy this Item!").then(m => {m.delete(9000);})
                    waittime -=1;
                    return;
                }
                message.say("I have no product of that name hmmm.. Maybe your thinking of something else???").then(m => {m.delete(9000);})
                waittime -=1;

             
            });

        }
        while(hasLeft == false)
        message.say("You have left the store.").then(m => {m.delete(20000);});
        let data = JSON.stringify(database);  
        fs.writeFileSync(__dirname +'/database.json', data); 
        return;
    }


}

module.exports = Shop;