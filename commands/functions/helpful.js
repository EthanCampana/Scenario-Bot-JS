//LIST OF HELPFUL FUNCTIONS
exports = module.exports  = {

        "Range": function(min, max) {
            return Math.floor(Math.random() * (max - min + 1) ) + min;
          },

        "addUser" :function(player){
            player.attackEnemy = function (Target){
                let targetindex = global.scenario.Enemies.findIndex((value, index, array) => {
                    return value == Target;
                })
                //calculate damage here
                let damage =  10;
                global.scenario.Enemies[targetindex].HP -= damage;
            }
            global.scenario.Players.push(player);
        }



}