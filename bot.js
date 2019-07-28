const Discord = require('discord.js');
const fetch = require("node-fetch");
var auth = require('./auth.json');
const commando = require('discord.js-commando');
const client = new commando.Client();


client.registry.registerGroup('doggo','Doggo');
client.registry.registerGroup('database','Database');
client.registry.registerGroup('scenario','Scenario');
client.registry.registerDefaultTypes();
client.registry.registerDefaultGroups();
client.registry.registerDefaultCommands();
client.registry.registerGroup('spanish','Spanish');
client.registry.registerCommandsIn(__dirname + "/commands");

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
  });

client.on('message', msg =>{
    if(msg.content.toUpperCase() == 'BORK'){
        fetch('https://dog.ceo/api/breed/chow/images/random').then(function(response){
            return response.json();
        }).then(function(json){
            msg.reply(json.message);
            msg.delete();
        });

    } 
    if(msg.content.toUpperCase() == 'BARK'){
        fetch('https://dog.ceo/api/breed/mountain/bernese/images/random').then(function(response){
            return response.json();
        }).then(function(json){
            msg.reply(json.message);
            msg.delete();
        });

    } 
    if(msg.content.toUpperCase() == 'WOOLF'){
        fetch('https://dog.ceo/api/breed/akita/images/random').then(function(response){
            return response.json();
        }).then(function(json){
            msg.reply(json.message);
            msg.delete();
        });

    } 
    if(msg.content.toUpperCase() == 'WOOF'){
        fetch('https://dog.ceo/api/breeds/image/random').then(function(response){
            return response.json();
        }).then(function(json){
            msg.reply(json.message);
            msg.delete();
        });


    }
});

client.login(auth.token);