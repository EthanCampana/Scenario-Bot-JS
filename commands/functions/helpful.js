//LIST OF HELPFUL FUNCTIONS
exports = module.exports  = {
        //array of functions to be loaded in easier
        "Range": function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
         },

        "playerFunctions": {
            //Function needed to use a skill in the game.. Need the skill object, Target and array that holds the Target object that the skill will affect
            // Message is passed just to update the UI
            "useSkill": function(skill,target,channel){
                switch(skill.type){
                    case "Buff":
                        this.MP -= skill.cost;
                        if(skill.length > 0){
                            let buff = {};
                            if(skill.hasOwnProperty('everyTurn')){buff.everyTurn = true;}else{buff.everyTurn = false;}
                            buff.stat = skill.stat;
                            buff.length = skill.length;
                            buff.amount = skill.amount;
                            target.currentBuffs.push(buff);
                            break;
                        }
                        target[skill.stat] += skill.amount;
                        break;
                    case "Physical":
                        this.MP -= skill.cost;
                        channel.send(`${this.Name} inflicted ${skill.damage} to ${target.Name}`);
                        target.HP -= skill.damage;
                        if(target.HP  < 0){ target.isAlive = false; 
                            channel.send(`${target.Name} has been slain!`);}
                        break;
                    case "Magic":
                        this.MP -= skill.cost;
                        channel.send(`${this.Name} casted ${skill.name} on ${target.Name}`);
                        channel.send(`${this.Name} inflicted ${skill.amount} to ${target.Name}`);
                        target[skill.stat] -= skill.amount;
                        if(target.HP  < 0){ target.isAlive = false; 
                            channel.send(`${target.Name} has been slain!`); break;}
                        if(skill.hasOwnProperty('Debuff')){
                            let roll = Math.floor((Math.random() * 100) +1);
                            if(roll < skill.chance){
                                channel.send(`${target.Name} has been inflicted with ` + skill.Debuff.name);
                                target.Debuffs.push(skill.Debuff);
                            }  
                        }
                        break;     
                }
                return target;
            },

            "Action": function Action(target,channel){
                let Range = function(min, max) {
                    return Math.floor(Math.random() * (max - min + 1) ) + min;
                 }
                let min = this.Attack * 0.5;
                let max = this.Attack / 0.5;
                let damage =  Math.round((Range(min,max)) - (target.Defense * 0.75));
                console.log(`Damage: ${damage}`);
                Math.max(0,damage);
                channel.send(`${this.Name} did ${damage} damage to ${target.Name}`).then(m => {m.delete(100000);});
                target.HP -= damage;
                if(target.HP  < 0){ target.isAlive = false;
                channel.send(`${target.Name} has been slain!`);
                }
                return target;
            },

            "Defend": function Defend(channel)
            {  
                channel.send(`${this.Name} has Defended!`).then(m => {m.delete(100000);});
                this.Defense *=2;
                this.hasDefended = true;
                },            
        
                
            
        "Update":function(){
            //Maps player names to the player object
            let playerMap = new Map();

            //Maps Enemy names to the enemy objects
            let enemyMap = new Map();
            
            global.scenario.Players.forEach((value, index, array) => {
                let skillMap = new Map();
                value.defend = this.playerFunctions.Defend;
                value.useSkill = this.playerFunctions.useSkill;
                value.Act = this.playerFunctions.Action;
                value.currentBuffs = []; // Moves that buff characters 
                value.Type = "Player"; 
                value.Debuffs = [];
                value.isAlive = true;
                value.hasDefended = false;
                value.hasFled = false;
                value.Skills.forEach((skill) => {skillMap.set(skill.name.toUpperCase(),value)});
                value.Skills = skillMap;
                skillMap = null;
                playerMap.set(value.Name.toUpperCase(), value);
                });
            global.scenario.Enemies.forEach((value, index, array) => {
              value.Act = this.playerFunctions.Action;
              value.useSkill = this.playerFunctions.useSkill;
              value.currentBuffs = [];
              value.Debuffs = []; 
              value.Type = "Enemy";
              value.defend = this.playerFunctions.Defend;
              value.isAlive = true;
              value.hasDefended = false; 
              enemyMap.set(value.Name.toUpperCase(), value);
            });
            // replaces arrays with Maps
            global.scenario.Players = playerMap;
            global.scenario.Enemies = enemyMap;


        },
        "findSwap" : function(message,map,id){
                    map.forEach((value,key) => {
                        if(value.playerID ==  id){
                            value.playerID = null;
                           message.say("You have swapped characters!").then(m => {m.delete(100000);})
                        }
                    });
    
            return;
        },

        "showCharacter": function(embed,array){
            array.forEach((value, index, array)=> {
                index +=1;
                embed.addField("Player " + index.toString(), "Name: " + JSON.stringify(value.Name) + "\n HP: " + JSON.stringify(value.HP) + "\n Attack: " +
                JSON.stringify(value.Attack) + "\n Defense:" + JSON.stringify(value.Defense)
                );
            });
        },
            
        
        "replaceKeyword": function(keyword,phrase,map){
                if(keyword === 'PLAYERS'){
                    let text = "";
                    let nameIterator = map.values();
                    for(let i= 1; i <= map.size; i++){
                        let andindex = map.size - 1;
                        if(andindex == 1){
                            text += nameIterator.next().value.Name;
                            break;
                        }
                        if(i == andindex){
                          text += "and " + nameIterator.next().value.Name;
                          break;
                        }
                        text += nameIterator.next().value.Name + ", "
                      }
                             
                return phrase.replace(keyword,text);
            }
                return phrase;
        },

        "randomnize": function(array){
            array.sort(function(a, b){return 0.5 - Math.random()});
            return array
        },

        "enemyAppeared": function(value, arr, channel){
            const { RichEmbed } = require('discord.js');
            if(value.hasOwnProperty("image")){
                let embed = new RichEmbed()
                .setTitle(value.Name)
                .setImage(value.image)
                .setDescription(`${value.Name} has appeared!`);
                channel.send(embed).then(m => {m.delete(100000);})
             }
             else{
                channel.send(`${value.Name} has appeared!`).then(m => {m.delete(100000);})
             }
             arr.push(value);
             return arr;

        }
    
}
}