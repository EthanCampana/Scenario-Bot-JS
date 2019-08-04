const helpful = require('./../functions/helpful.js');
global.scenario = {}
class motherBrain {
    
    
    
    constructor(message, scenario,){
        this.message = message;
        this.scenario = scenario;
        this.player = null;
        this.battletext = ["A raging battle is about to brew", "Unexpected foes have been encountered", "PLAYERS can't escape from clashing with foes","A battle is about to commence"];
        this.Time = 0;
        this.turnorder = []
        
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
            this.scenario.Enemies.forEach((value, index, array) => {if(this.scenario.Battle[battleindex].enemyID[i] == value.enemyID){
                this.message.say(`${value.enemyName} has appeared!`)
                turnorder.push(value);}});
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
    //Gets all the names of the Enemies in the current battle
    getEnemyName(){
        let text =""
        this.turnorder.forEach((value, index, array) => {
        if (value.Type == "Enemy"){
            text += value.enemyName + "\n";
        }
        })
        return text
    }
    //Checks to see if the Enemy the player wants to attack is in the battle
    checkAttack(name){
        let checked = this.turnorder.some((value, index, array) => {return value.enemyName == name;});
        return checked;
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


    normalize(player){
        if(player.hasDefened == true){
            player.hasDefened = false;
            player.playerDefense /=2;
            return player;
        }
    }

    
    //PLAYERS TURN ALL PLAYER OPTIONS GO HERE
    async playerAct(player){
        this.player = player;
        this.logging(this.player);
        let filter = message => this.player.playerID === message.author.id;
        let waittime = 5;
        let action = "";
        var optionChosen = false;
        await this.message.say(`${player.playerName} it is your turn`);
        await this.message.say(`Attack      Run      Defend`);
        do{
           await this.message.channel.awaitMessages(filter,{max: 1, time: this.Time}).then(collected =>{
                if(waittime == 0){
                    this.logging("turn has been skipped");
                   optionChosen = true;
                 return;
                }
                if(collected.first() == undefined){
                    waittime -=1;
                    this.logging("undefined was passed nothing was said")
                    return;
                }
                 action = collected.first().content;
                 waittime -=1
                
            });
            if(action.toUpperCase() === "Defend"){this.player.defend(this.message); optionChosen = true;}
            if(action.toUpperCase() === "ATTACK"){
               await this.attackOptions(); 
                optionChosen = true;
            }
        }
        while(optionChosen == false)
        this.logging("TURN ENDED")
    }
    ///ATTACK SUBMENU
   async attackOptions(){
        this.logging("Sub-Menu Opened")
        let chance = 2;
        let option = false;
        let filter = message => this.player.playerID === message.author.id;
        this.message.say("Enemies:");
        this.message.say(this.getEnemyName());
        do{
            await this.message.channel.awaitMessages(filter,{max: 1, time: this.Time}).then(collected =>{
                if(chance == 0){
                    this.logging("No more chances left skipping turn!");
                    option = true;
                    return;
                 }
                if(collected.first() == undefined){
                    chance -=1;
                    return;
                }
                let enemyName = collected.first().content;
                if(this.checkAttack(enemyName)){
                    this.player.attackEnemy(enemyName,this.scenario.Enemies,this.message);
                    option = true;
                    return;
                }
                this.logging("Enemy not here " + enemyName);
                chance -=1;
            });
        }
        while(option == false)
        this.logging("Sub-Menu Closed");
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
        this.message.say("Setting the stage for this grand story to be told....");
        this.logging("Deleting Players.....");
        this.Time = this.scenario.Options.timer * 1000;
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
                this.turnorder = this.createTurns(battleindex);
                this.logging('Commencing Battle');
                this.message.say(this.battletext[Math.floor(Math.random() * this.battletext.length)]);
                await this.commenceBattle(this.turnorder);
            }
            this.message.say(line);
        }
    }
}

module.exports = motherBrain;