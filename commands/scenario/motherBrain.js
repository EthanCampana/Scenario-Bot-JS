const helpful = require('./../functions/helpful.js');
global.scenario = {}
class motherBrain {

    constructor(message, scenario,){
        this.message = message;
        this.scenario = scenario;
        this.player = null;
    }
    
    deletePlayers(){
        let playablecast = this.scenario.Players.filter((value, index, array)=> {return value.playerID !== "";});
        this.scenario.Players = playablecast;    
    }
    //CHECKS GAME START CONDITIONS
    checkConditions(){
        let activePlayers = 0;
        this.scenario.Players.forEach((value, index, array) =>{
            if(value.playerID !== ""){
                activePlayers += 1;
            }
        })
        if(this.scenario.Options.minPlayer <= activePlayers){
            return true;}
        this.message.say("You dont have enough players to start the game");
        return false;
    }
    //NEED TO PASS BATTLEINDEX INCASE OF MULTIPLE BATTLES?
    createTurns(battleindex){
        let turnorder = [];
        this.scenario.Players.forEach((value, index, array) =>{turnorder.push(value)})
        for( let i=0; i < this.scenario.Battle[battleindex].enemyID.length; i++){
            this.scenario.Enemies.forEach((value, index, array) => {if(this.scenario.Battle[battleindex].enemyID[i] == value.enemyID){turnorder.push(value)}});
        }
        turnorder = helpful.randomnize(turnorder);
        return turnorder;
    }
    
    whichBattle(currentLine){
       let isBattle = this.scenario.Battle.some((value, index, array) => {return value.lineOccurs == currentLine;});
       return isBattle;
    }

    getBattleIndex(currentLine){
        let battleindex = this.scenario.Battle.findIndex((value, index, array) => {return value.lineOccurs == currentLine;})
        return battleindex;
    }
    
    logging(text){
        console.log(text); 
    }

    whoAlive(array){
        let playablecast = array.filter((value, index, array)=> {return value.isAlive == true;});
       return playablecast;
    }

    checkBattleStatus(array){
       let isPlayersAlive = array.some((value, index, array) => {return value.Type == "Player";});
       let isMonstersAlive = array.some((value, index, array) => {return value.Type == "Enemy";});
       if(isMonstersAlive == false){
           return true;
       }
       if(isPlayersAlive == false){
           return true;
       }
       return false;
    }

    //PLAYERS TURN ALL PLAYER OPTIONS GO HERE
    async playerAct(player){
        this.player = player;
        let filter = player => this.player.playerID === this.message.author.id;
        let waittime = 5;
        var optionChosen = false;
        await this.message.say(`${player.playerName} it is your turn`);
        await this.message.say(`Attack    Run      Defend`);
        do{
            await this.message.channel.awaitMessages(filter,{max: 1, time: 150000000}).then(collected =>{
                if(waittime == 0){
                   console.log("turn has been skipped");
                   optionChosen = true;
                 return;
                }
                if(collected.first() == undefined){
                    waittime -=1;
                    console.log("undefined was passed nothing was said")
                    return;
                }
                let action = collected.first().content;
                if(action.toUpperCase() === "ATTACK"){
                    player.attackEnemy(this.scenario.Enemies[0],this.scenario.Enemies,this.message);
                    optionChosen = true;
                    return;
                }
                waittime -=1
                
            });
        }
        while(optionChosen == false)
        console.log("TURN ENDED")
    }
    //ENEMY AI BASICALLY NEEDS TO BE UPDATED
    enemyAct(enemy){
        enemy.attackPlayer(this.scenario.Players[Math.floor(Math.random() * this.scenario.Players.length)], this.scenario.Players,this.message);
    }
    //BATTLE FUNCTION DETERMINES WHO TURN IT IS AND WHEN THE BATTLE IS OVER
    async commenceBattle(turnorder){
        let isBattleOver = false;
        var i = 0;
        this.logging(turnorder);
        this.logging(i);
        while(isBattleOver == false){
            turnorder = this.whoAlive(turnorder);
            this.logging(turnorder);
            this.logging(i);
            if(turnorder.length == 1){
                isBattleOver = true;
                break;
            }
            if(i === turnorder.length){
                i = 0;
            }

            isBattleOver = this.checkBattleStatus(turnorder);
            this.logging(isBattleOver);
            if(isBattleOver){
                this.logging("Returning");
                break;
            }
            if(turnorder[i].Type == "Player"){
                 await this.playerAct(turnorder[i]);
                
            }
            else{
                this.enemyAct(turnorder[i]);
                
            }
            i++;
    
        };
        this.logging("Battle has ended");
        }

  //MAIN FUNCTION WHAT STARTS THE GAME
   async run(){
        this.logging("Checking Requirements.....") ;
        let checked = this.checkConditions();
        if(checked == false){ 
            this.logging("Game start requirements not met!");
            return;}
        this.logging("Deleting Players.....");
        this.deletePlayers();
        // MAIN Game Loop
        this.logging("Game Started");
        for(let i = 0; i < this.scenario.Story.length; i++){
            let line = scenario.Story[i];
            let isBattle = this.whichBattle(i);
            line = helpful.replaceKeyword('PLAYERS',line,this.scenario.Players);
            if(isBattle){
                this.logging("Setting up current Battle....");
                let battleindex = this.getBattleIndex(i);
                let turnorder = this.createTurns(battleindex);
                this.logging('Commencing Battle');
                await this.commenceBattle(turnorder);
            }
            this.message.say(line);
        }
    }
}

module.exports = motherBrain;