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
                let damage =  (this.playerAttack * 3) - (array[targetindex].enemyDefense *2);
                console.log(damage);
                message.say(`you did ${damage} damage to ${array[targetindex].enemyName}`);
                array[targetindex].enemyHP -= damage;
                if(array[targetindex].enemyHP  < 0){ array[targetindex].isAlive = false; }
            }
            let defend = function Defend(message)
            {
                message("You have defended");
                this.playerDefense *=2;
                this.hasDefended = true;
            }
            let enemyattack = function monsterAttack(Target,array,message){
                let targetindex = array.findIndex((value, index, array) => {return value == Target;})
                let damage =   (this.enemyAttack * 3) - (array[targetindex].playerDefense * 2);
                console.log(damage);
                message.say(`Monster did ${damage} to ${array[targetindex].playerName}`);
                array[targetindex].playerHP -= damage;
                if(array[targetindex].playerHP  < 0){ array[targetindex].isAlive = false; }
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