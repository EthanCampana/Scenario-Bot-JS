//LIST OF HELPFUL FUNCTIONS
exports = module.exports  = {
        //array of functions to be loaded in easier
        "playerFunctions": {
            "useSkill": function(index, Target, array, message){
                let skill = this.Skills[index];
                let type = skill.type;
                if(type == "Buff"){
                    this.MP -= skill.cost;
                    if(skill.length > 0){
                        //Buffs that last longer than one turn code here... Create an Array like BuffName, Turncount. Buffname Should start at index 1, position 2.
                    }
                    let targetStat = skill.stat;
                    let targetindex = array.findIndex((value, index, array) => {return value.playerName.toUpperCase() == Target.toUpperCase();})
                    array[targetindex][targetStat] += skill.amount;
                }
                if(type == "Physical"){
                    this.MP -= skill.cost;
                    let targetindex = array.findIndex((value, index, array) => {return value.enemyName.toUpperCase() == Target.toUpperCase();})
                    message.say(`${this.playerName} inflicted ${skill.damage} to ${Target}`)
                    array[targetindex].HP -= skill.damage;
                    if(array[targetindex].HP  < 0){ array[targetindex].isAlive = false; }
                }
            },

            "PlayerAttack": function playerAttack(Target,array,message){
                let targetindex = array.findIndex((value, index, array) => {return value.enemyName.toUpperCase() == Target.toUpperCase();})
                //calculate damage here
                let damage =  (this.Attack * 3) - (array[targetindex].Defense *2);
                console.log(damage);
                message.say(`${this.playerName} did ${damage} damage to ${array[targetindex].enemyName}`).then(m => {m.delete(100000);});
                array[targetindex].HP -= damage;
                if(array[targetindex].HP  < 0){ array[targetindex].isAlive = false; }
            },

            "Defend": function Defend(message)
            {  
            if(this.Type == 'Player'){
                message.say(`${this.playerName} has Defended!`).then(m => {m.delete(100000);});
                this.Defense *=2;
                this.hasDefended = true;
                return;
            }
            message.say(`${this.enemyName} has Defended!`).then(m => {m.delete(100000);});
            this.Defense *=2;
            this.hasDefended = true;
      
            
            
            },
                
            "EnemyAttack": function monsterAttack(Target,array,message){
                let targetindex = array.findIndex((value, index, array) => {return value == Target;})
                let damage =   (this.Attack * 3) - (array[targetindex].Defense * 2);
                console.log(damage);
                message.say(`${this.enemyName} did ${damage} to ${array[targetindex].playerName}`).then(m => {m.delete(100000);});
                array[targetindex].HP -= damage;
                if(array[targetindex].HP  < 0){ array[targetindex].isAlive = false; }



            }

            },
            
        "Range": function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
         },
        "Update":function(){
            global.scenario.Players.forEach((value, index, array) => {
                value.defend = this.playerFunctions.Defend;
                value.useSkill = this.playerFunctions.useSkill;
                value.attackEnemy = this.playerFunctions.PlayerAttack;
                value.currentBuffs = [null]; // Moves that buff characters 
                value.Type = "Player"; 
                value.isAlive = true;
                value.hasDefended = false;
                value.hasFled = false; });
            global.scenario.Enemies.forEach((value, index, array) => {
              value.attackPlayer = this.playerFunctions.EnemyAttack;
              value.currentBuffs = [null]; 
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
                embed.addField("Player " + index.toString(), "Name: " + JSON.stringify(value.playerName) + "\n HP: " + JSON.stringify(value.HP) + "\n Attack: " +
                JSON.stringify(value.Attack) + "\n Defense:" + JSON.stringify(value.Defense)
                );
            })

            

        },
        
        "replaceKeyword": function(keyword,phrase,array){
                if(keyword === 'PLAYERS'){
                    let text = "";
                    for(i= 0; i < array.length; i++){
                        let andindex = array.length - 1;
                        if(andindex == 0){
                            text += array[i].playerName;
                            break;
                        }
                        if(i == andindex){
                          text += "and " + array[i].playerName;
                          break;
                        }
                        text += array[i].playerName + ", "
                      }
                       phrase = phrase.replace(keyword,text);
                      return phrase;
                }
                return phrase;
        },
        "randomnize": function(array){
            array.sort(function(a, b){return 0.5 - Math.random()});
            return array
        }



}