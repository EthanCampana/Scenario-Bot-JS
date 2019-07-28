const helpful = require('d:/Bots/commands/functions/helpful');
global.scenario = {}

function playerAttack(Target){

    let targetindex = global.scenario.Enemies.findIndex((value, index, array) => {
        return value == Target;
    })
    //calculate damage here
    let damage =  10;
    
    global.scenario.Enemies[targetindex].HP -= damage;


}