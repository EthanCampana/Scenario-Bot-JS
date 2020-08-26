//LIST OF HELPFUL FUNCTIONS
exports = module.exports  = {
        //array of functions to be loaded in easier
        "Range": function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
         },

        "playerFunctions": {
            "useSkill": function(index, Target, array, message){
                let skill = this.Skills[index];
                let type = skill.type;
                switch(type){
                    case "Buff":
                        this.MP -= skill.cost;
                        if(skill.length > 0){
                            let buff = {};
                            if(skill.hasOwnProperty('everyTurn')){buff.everyTurn = true;}else{buff.everyTurn = false;}
                            buff.stat = skill.stat;
                            buff.length = skill.length;
                            buff.amount = skill.amount;
                            let targetindex = array.findIndex((value, index, array) => {return value.Name.toUpperCase() == Target.toUpperCase();});
                            array[targetindex].currentBuffs.push(buff);
                            break;
                        }
                        let targetStat = skill.stat;
                        let targetindex = array.findIndex((value, index, array) => {return value.Name.toUpperCase() == Target.toUpperCase();});
                        array[targetindex][targetStat] += skill.amount;
                    case "Physical":
                        this.MP -= skill.cost;
                        let targetindex = array.findIndex((value, index, array) => {return value.Name.toUpperCase() == Target.toUpperCase();});
                        message.say(`${this.Name} inflicted ${skill.damage} to ${Target}`);
                        array[targetindex].HP -= skill.damage;
                        if(array[targetindex].HP  < 0){ array[targetindex].isAlive = false; 
                            message.say(`${array[targetindex].Name} has been slain!`);}
                        break;
                    case "Magic":
                        this.MP -= skill.cost;
                        let targetStat = skill.stat;
                        let targetindex = array.findIndex((value, index, array) => {return value.Name.toUpperCase() == Target.toUpperCase();});
                        message.say(`${this.Name} casted ${skill.name} on ${Target}`);
                        message.say(`${this.Name} inflicted ${skill.amount} to ${Target}`);
                        array[targetindex][targetStat] -= skill.amount;
                        if(array[targetindex].HP  < 0){ array[targetindex].isAlive = false; 
                            message.say(`${array[targetindex].Name} has been slain!`); break;}
                        if(skill.hasOwnProperty('Debuff')){
                            let roll = Math.floor((Math.random() * 100) +1);
                            if(roll < skill.chance){
                                message.say(`${array[targetindex].Name} has been inflicted with ` + skill.Debuff.name);
                                array[targetindex].Debuffs.push(skill.Debuff);
                            }  
                        }
                        break;     
                }
            },

            "Action": function Action(Target,array,message){
                let targetindex = array.findIndex((value, index, array) => {return value.Name.toUpperCase() == Target.toUpperCase();})
                let Range = function(min, max) {
                    return Math.floor(Math.random() * (max - min + 1) ) + min;
                 }
                 let min = this.Attack * 0.5;
                 let max = this.Attack / 0.5;
                 let damage =  Math.round((Range(min,max)) - (array[targetindex].Defense * 0.75));
                console.log(`Damage: ${damage}`);
                if(damage < 0) { damage = 0;}
                message.say(`${this.Name} did ${damage} damage to ${array[targetindex].Name}`).then(m => {m.delete(100000);});
                array[targetindex].HP -= damage;
                if(array[targetindex].HP  < 0){ array[targetindex].isAlive = false;
                message.say(`${array[targetindex].Name} has been slain!`);
                }
            },

            "Defend": function Defend(message)
            {  
                switch(this.Type){
                    case "Player":
                        message.say(`${this.Name} has Defended!`).then(m => {m.delete(100000);});
                        this.Defense *=2;
                        this.hasDefended = true;
                        break;
                    case "Enemy":
                        message.say(`${this.Name} has Defended!`).then(m => {m.delete(100000);});
                        this.Defense *=2;
                        this.hasDefended = true;
                        break;
                }            
        }
            },
                
            
        "Update":function(){
            global.scenario.Players.forEach((value, index, array) => {
                value.defend = this.playerFunctions.Defend;
                value.useSkill = this.playerFunctions.useSkill;
                value.Act = this.playerFunctions.Action;
                value.currentBuffs = []; // Moves that buff characters 
                value.Type = "Player"; 
                value.Debuffs = [];
                value.isAlive = true;
                value.hasDefended = false;
                value.hasFled = false; });
            global.scenario.Enemies.forEach((value, index, array) => {
              value.Act = this.playerFunctions.Action;
              value.useSkill = this.playerFunctions.useSkill;
              value.currentBuffs = [];
              value.Debuffs = []; 
              value.Type = "Enemy";
              value.defend = this.playerFunctions.Defend;
              value.isAlive = true;
              value.hasDefended = false; });
        },
        "findSwap" : function(message,compare,contrast,array,callback){
                    if(array.length == 1){
                        return;
                    }
                    let index = array.findIndex((value,index,array) => {console.log(value[compare] + " + " + contrast); return value[compare] == contrast; });
                    console.log(index);
                    if(index  == array.length - 1){
                        return;
                    }
                    if(index > -1){
                        callback(array,index);
                        message.say("You have swapped characters!").then(m => {m.delete(100000);});
                        return;
                    }
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
            
        
        "replaceKeyword": function(keyword,phrase,array){
                if(keyword === 'PLAYERS'){
                    let text = "";
                    for(i= 0; i < array.length; i++){
                        let andindex = array.length - 1;
                        if(andindex == 0){
                            text += array[i].Name;
                            break;
                        }
                        if(i == andindex){
                          text += "and " + array[i].Name;
                          break;
                        }
                        text += array[i].Name + ", "
                      }
                       phrase = phrase.replace(keyword,text);
                      return phrase;
                }
                return phrase;
        },

        "randomnize": function(array){
            array.sort(function(a, b){return 0.5 - Math.random()});
            return array
        },

        "enemyAppeared": function(value, arr, message){
            const { RichEmbed } = require('discord.js');
            if(value.hasOwnProperty("image")){
                let embed = new RichEmbed()
                .setTitle(value.Name)
                .setImage(value.image)
                .setDescription(`${value.Name} has appeared!`);
                message.say(embed).then(m => {m.delete(100000);})
             }
             else{
              message.say(`${value.Name} has appeared!`).then(m => {m.delete(100000);})
             }
             arr.push(value);
             return arr;

        }
    
    }