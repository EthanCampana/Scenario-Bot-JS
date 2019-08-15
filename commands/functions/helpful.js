//LIST OF HELPFUL FUNCTIONS
exports = module.exports  = {
        //array of functions to be loaded in easier
        "playerFunctions": {},
        "Range": function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
          },
        "Update":function(){
            let playerattack =function playerAttack(Target,array,message){
                let targetindex = array.findIndex((value, index, array) => {return value.enemyName == Target;})
                //calculate damage here
                let damage =  (this.Attack * 3) - (array[targetindex].Defense *2);
                console.log(damage);
                message.say(`${this.playerName} did ${damage} damage to ${array[targetindex].enemyName}`).then(m => {m.delete(100000);});
                array[targetindex].HP -= damage;
                if(array[targetindex].HP  < 0){ array[targetindex].isAlive = false; }
            }
            let defend = function Defend(message)
            {
                message.say(`Defense Mode Activated`).then(m => {m.delete(100000);});
                this.Defense *=2;
                this.hasDefended = true;
            }
            let enemyattack = function monsterAttack(Target,array,message){
                let targetindex = array.findIndex((value, index, array) => {return value == Target;})
                let damage =   (this.Attack * 3) - (array[targetindex].Defense * 2);
                console.log(damage);
                message.say(`${this.enemyName} did ${damage} to ${array[targetindex].playerName}`).then(m => {m.delete(100000);});
                array[targetindex].HP -= damage;
                if(array[targetindex].HP  < 0){ array[targetindex].isAlive = false; }
            }
            global.scenario.Players.forEach((value, index, array) => {
                value.defend = defend;
                value.attackEnemy = playerattack; 
                value.Type = "Player"; 
                value.isAlive = true;
                value.hasDefended = false; });
            global.scenario.Enemies.forEach((value, index, array) => {
              value.attackPlayer = enemyattack;
              value.Type = "Enemy";
              value.defend = defend;
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