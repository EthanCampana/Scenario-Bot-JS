const commando = require('discord.js-commando');
const fs = require('fs');
const helpful = require('./../functions/helpful.js');
const motherBrain = require('./motherBrain.js');
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
        ///NEW DEBUG STUFF NEEDS TO IMPLEMENTED

}
}
module.exports = Debug;