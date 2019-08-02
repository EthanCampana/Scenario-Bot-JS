//LIST OF HELPFUL FUNCTIONS
exports = module.exports  = {
        //array of functions to be loaded in easier
        "playerFunctions": {},
        "Range": function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
          },
        "Update":function(){
            let playerattack =function playerAttack(Target,array,message){
                let targetindex = array.findIndex((value, index, array) => {return value == Target;})
                //calculate damage here
                let damage =  (this.playerAttack * 300);
                console.log(damage);
                message.say(`you did ${damage} damage to ${array[targetindex].enemyName}`);
                array[targetindex].enemyHP -= damage;
                if(array[targetindex].enemyHP  < 0){ array[targetindex].isAlive = false; }
            }
            let enemyattack = function monsterAttack(Target,array,message){
                let targetindex = array.findIndex((value, index, array) => {return value == Target;})
                let damage =  (array[targetindex].playerDefense * 2) - (this.enemyAttack * 3);
                console.log(damage);
                message.say(`Monster did ${damage} to ${array[targetindex].playerName}`);
                array[targetindex].playerHP -= damage;
            }
            global.scenario.Players.forEach((value, index, array) => {
                value.attackEnemy = playerattack; 
                 value.Type = "Player"; 
                value.isAlive = true; });
            global.scenario.Enemies.forEach((value, index, array) => {value.attackPlayer = enemyattack;
              value.Type = "Enemy"  
              value.isAlive = true; });




        },
        "findSwap" : function(message,compare,contrast,array,callback){
                    if(array.length == 1){
                        return;
                    }
                    let index = array.findIndex((value,index,array) => {return value[compare] == contrast; });
                    if(index > -1){
                        callback(array,index);
                        message.say("You have swapped characters!");
                        return;
                    }
            return;
        },

        "showCharacter": function(embed,array){
            array.forEach((value, index, array)=> {
                embed.addField("Player " + index.toString(),JSON.stringify(value));
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