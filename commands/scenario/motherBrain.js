const helpful = require('./../functions/helpful.js');

class motherBrain {
    
    constructor(message, scenario,){
        this.message = message;
        this.scenario = scenario;
        this.player = null;
        this.battletext = ["A raging battle is about to brew", "Unexpected foes have been encountered", "PLAYERS can't escape from clashing with foes","A battle is about to commence"];
        this.Time = 0;
        this.turnorder = []
        this.GameOver = false;
        
    }
    quit(){
        this.GameOver = true;
        this.scenario.Story = "";
    }
     sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
      }
      
    printSkills(player){
        let text = "";
        player.Skills.forEach((value)=>{
             text += value.name +  "  MP: " + value.cost + "\n";
         })
         text += `Current MP: ${this.player.MP}`;
        return text;
    }

    deletePlayers(){
        let playablecast = this.scenario.Players.filter((value, index, array)=> {return value.playerID !== null;});
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
        this.message.say("You dont have enough players to start the game").then(m => {m.delete(this.Time);});
        return false;
    }
    //NEED TO PASS BATTLEINDEX INCASE OF MULTIPLE BATTLES?
     createTurns(battleindex){
        let turnorder = [];
        this.scenario.Players.forEach((value, index, array) =>{turnorder.push(value)})
        for( let i=0; i < this.scenario.Battle[battleindex].enemyID.length; i++){
            this.scenario.Enemies.forEach((value, index, array) => {
                if(this.scenario.Battle[battleindex].enemyID[i] == value.enemyID){
                turnorder = helpful.enemyAppeared(value,turnorder, this.message);    
                //turnorder.push(value);
            }
        });
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
    //Checks Which enemies or players are alive in the Turnorder...
    whoAlive(array){
        let playablecast = array.filter((value, index, array)=> {return value.isAlive == true;});
        this.turnorder = playablecast
        return playablecast;
    }
    //Gets all the names of the Enemies in the current battle
    getEnemyName(){
        let text =""
        this.turnorder.forEach((value, index, array) => {
        if (value.Type == "Enemy"){
            text += value.Name + "\n";
        }
        })
        return text
    }
    getRandomEnemy(){
        let arr = [];
        this.turnorder.forEach((value, index, array) => {
            if (value.Type == "Enemy"){
                arr.push(value);
            }
            });
      return  arr[Math.floor(Math.random()*arr.length)].Name;
    }
    getPlayerName(){
        let text  =""
        this.turnorder.forEach((value, index, array) => {
        if (value.Type == "Player"){
            text += value.Name + "\n";
        }
        })
        return text


    }
    //Checks to see if the Enemy the player wants to attack is in the battle
    checkAttack(name){
        if(typeof name ==  undefined){
            return false;
        }
        let checked = this.turnorder.some((value, index, array) => {return value.Name == name;})
        return checked;
    }
    checkBuff(name){
        let checked = this.turnorder.some((value, index, array) => {return value.Name.toUpperCase() == name.toUpperCase();});
        return checked;
    }
    checkBattleStatus(array){
       let isPlayersAlive = array.some((value, index, array) => {return value.Type == "Player";});
       let isMonstersAlive = array.some((value, index, array) => {return value.Type == "Enemy";});
       let hasFled = array.some((value,index,array)=> {return value.hasFled == false;});
       if(isMonstersAlive == false){
           return true;
       }
       if(isPlayersAlive == false){
           return true;
       }
       if(hasFled == false){
           let Line = "PLAYERS have successfully fled";
           Line = helpful.replaceKeyword('PLAYERS', Line ,this.scenario.Players);
           this.message.say(Line);
           return true;
       }
       return false;
    }
    checkSkills(){
        if(! this.player.hasOwnProperty('Skills')){
            return false;
        }
        if(this.player.Skills.length == 0){
            return false;
        }
        return true;
    }
    checkMonSkill(enemy){
        if(! enemy.hasOwnProperty('Skills')){
            return false;
        }
        if(enemy.Skills.length == 0){
            return false;
        }
        return true;
    }

    normalize(player){
        if(player.currentBuffs.length > 0){
          let buffs = player.currentBuffs.filter((value, index, array)=> {return value.length > 0;})
          player.currentBuffs =  buffs;
        }
        if(player.Debuffs.length > 0){
            let debuffs = player.Debuffs.filter((value, index, array)=> {return value.length > 0;})
            player.Debuffs = debuffs;
        }
        if(player.hasDefended === true){
            player.hasDefended = false;
            player.Defense /=2;
            return player;
        }
        player = this.applyStatus(player);
        return player
    }
    applyStatus(player){
        if(player.currentBuffs.length > 0){
            for(let i = 0; i < player.currentBuffs.length; i++ ){
                let buff = player.currentBuffs[i];
                if(player.currentBuffs[i].everyTurn){
                    player[buff.stat] += buff.amount;
                    this.message.say(`${player.Name} has gained ${buff.amount} ${buff.stat}`);
                    player.currentBuffs[i].length -=1;
                }
                else{
                    player.currentBuffs[i].length -=1;
                }
            }
        }
        if(player.Debuffs.length > 0){
            player.Debuffs.forEach((value, index, array)=> {
                if(value.everyTurn){
                    player[value.stat] -= value.amount;
                    this.message.say(`${player.Name} has lost ${value.amount} ${value.stat} from ${value.name}`);
                    value.length -=1;
                }
                else{
                    value.length -=1;
                }

            });
        }
        return player;

    }

    
    //PLAYERS TURN ALL PLAYER OPTIONS GO HERE
    async playerAct(player){
        this.player = this.normalize(player);
        //this.logging(player);
        let filter = message => this.player.playerID === message.author.id;
        let waittime = 5;
        let action = "";
        var optionChosen = false;
        await this.message.say(`${player.Name} it is your turn`).then(m => {m.delete(this.Time);});
        do{
         await this.message.say(`Attack    Skill      Defend     Run: ${waittime} \n Current HP: ${player.HP} Current MP: ${player.MP}`).then(m => {m.delete(this.Time);});
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
            if(action.toUpperCase() === "RUN"){
                optionChosen = true;
                let num = helpful.Range(0,100);
                if(num == 1){
                    this.player.hasFled = true;
                    this.message.say(`${this.player.Name} has fled from the battle`);
                }
                this.message.say(`${this.player.Name} tried to flee from battle but failed!`);
            }
            if(action.toUpperCase() === "DEFEND"){player.defend(this.message); optionChosen = true;}
            if(action.toUpperCase() === "ATTACK"){
               await this.attackOptions(); 
                optionChosen = true;
            }
            if(action.toUpperCase() === "SKILL"){  
                if(this.checkSkills()){
                    optionChosen = await this.skillOptions();
                    return;
                }
                this.message.say("You do not have any skills..").then(m => {m.delete(this.Time);});
            }
        }
        while(optionChosen == false)
        this.logging("TURN ENDED");
    }
    ///ATTACK SUBMENU
   async attackOptions(){
        this.logging("Sub-Menu Opened")
        let chance = 2;
        let option = false;
        let filter = message => this.player.playerID === message.author.id;
        await  this.message.say("Enemies:").then(m => {m.delete(this.Time);});
        await this.message.say(this.getEnemyName()).then(m => {m.delete(this.Time);});
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
                    this.player.Act(enemyName,this.scenario.Enemies,this.message);
                    option = true;
                    return;
                }
                this.message.say("Enemy not here " + enemyName).then(m => {m.delete(this.Time);});
                this.logging("Enemy not here " + enemyName);
                chance -=1;
            });
        }
        while(option == false)
        this.logging("Sub-Menu Closed");
    }
    //Skills Menu
    async skillOptions(){
        this.logging("Skill Sub-Menu Opened")
        let chance = 3;
        let option = false;
        let filter = message => this.player.playerID === message.author.id;
        let skills = this.player.Skills
        let skill = 0;
        let hasexited = false;
        await  this.message.say("Skills:").then(m => {m.delete(this.Time);});
        await this.message.say(this.printSkills(this.player)).then(m => {m.delete(this.Time);});
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
                let skillName = collected.first().content;
                if(skillName.toUpperCase() == "BACK"){
                    hasexited = true;
                    option = true;
                    return;
                }
                skill = skills.findIndex((value,index,array) => { return value.name.toUpperCase() == skillName.toUpperCase()});
                if(skill == -1){
                    this.message.say("No Skill of such Name").then(m => {m.delete(this.Time);});
                    this.logging("No Skill of such name " + skillName);
                    chance -=1;
                    return;
                }
               
            });
            if(skill > -1){
                if(skills[skill].cost > this.player.MP ){
                    this.message.say("You don't have enough MP to use this Skill").then(m => {m.delete(this.Time);}); 
                    return;
                }
                option = await this.chooseSkillTarget(skill);
                }
        }
        while(option == false)
        if(hasexited){
            option = false;
            return option;
        }
        return option;
    }

    //Target Menu For Using a Skill
    async chooseSkillTarget(index){
        this.logging("Skill Target Menu Opened")
        let chance = 3;
        let option = false;
        let filter = message => this.player.playerID === message.author.id;
        let type = this.player.Skills[index].type;
        switch(type){
            case "Buff":
                await this.message.say(this.getPlayerName()).then(m => {m.delete(this.Time);});
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
                    let playerName = collected.first().content;
                    if(this.checkBuff(playerName)){
                    //Player Uses Skill Here on Player
                        this.message.say(`${this.player.Name} used ${this.player.Skills[index].name} on ${playerName}`).then(m => {m.delete(this.Time);});
                        this.player.useSkill(index,playerName,this.scenario.Players,this.message)
                        option = true;
                        return;
                    }
                    this.message.say("No Player named " + playerName).then(m => {m.delete(this.Time);});
                    this.logging("No Player named " + playerName);
                    chance -=1;      
                    });
                    }
                while(option == false)
                break;
            case "Physical":
                await this.message.say(this.getEnemyName()).then(m => {m.delete(this.Time);});
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
                       //Player Uses Skill Here
                        this.message.say(`${this.player.Name} used ${this.player.Skills[index].name} `).then(m => {m.delete(this.Time);});
                        this.message.say(this.player.Skills[index].hit).then(m => {m.delete(this.Time);});
                        this.player.useSkill(index,enemyName,this.scenario.Enemies,this.message)
                        option = true;
                        return;
                    }
                    this.message.say("Enemy not here " + enemyName).then(m => {m.delete(this.Time);});
                    this.logging("Enemy not here " + enemyName);
                    chance -=1;
                });
                }
                while(option == false)
                break;
            case "Magic":
                await this.message.say(this.getEnemyName()).then(m => {m.delete(this.Time);});
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
                    //Player Uses Skill Here
                        this.message.say(`${this.player.Name} used ${this.player.Skills[index].name} `).then(m => {m.delete(this.Time);});
                        this.player.useSkill(index,enemyName,this.scenario.Enemies,this.message);
                        option = true;
                        return;
                    }
                    this.message.say("Enemy not here " + enemyName).then(m => {m.delete(this.Time);});
                    this.logging("Enemy not here " + enemyName);
                    chance -=1;
                });
                }
                while(option == false)
                break;
        }
        return option;


    }


    //ENEMY AI BASICALLY NEEDS TO BE UPDATED
    enemyAct(enemy){
        let choice = Math.floor((Math.random() * 3) +1);
        enemy = this.normalize(enemy);
        switch(choice){
            case 1:
                enemy.Act(this.scenario.Players[Math.floor(Math.random() * this.scenario.Players.length)].Name, this.scenario.Players,this.message);
                break;
            case 2:
                enemy.defend(this.message);
                break;
            case 3:
                if(this.checkMonSkill(enemy)){
                    let skill = Math.floor(Math.random() * enemy.Skills.length);
                    if(enemy.Skills.length == 1){skill = 0;}
                    let type =  enemy.Skills[skill].type;
                    switch(type){
                        case "Buff":
                            enemy.useSkill(skill,this.getRandomEnemy(),this.scenario.Enemies,this.message,);
                            break;
                        case "Physical":
                            this.message.say(enemy.Skills[skill].hit).then(m => {m.delete(this.Time);});
                            enemy.useSkill(skill,this.scenario.Players[Math.floor(Math.random() * this.scenario.Players.length)].Name, this.scenario.Players,this.message)
                            break;
                        case "Magic":
                            enemy.useSkill(skill,this.scenario.Players[Math.floor(Math.random() * this.scenario.Players.length)].Name, this.scenario.Players,this.message)
                            break;
                    }
                }
                else{
                enemy.Act(this.scenario.Players[Math.floor(Math.random() * this.scenario.Players.length)].Name, this.scenario.Players,this.message);
                break;
                }
        }
       
    }
    //BATTLE FUNCTION DETERMINES WHO TURN IT IS AND WHEN THE BATTLE IS OVER
    async commenceBattle(turnorder){
        let isBattleOver = false;
        var i = 0;
        while(isBattleOver == false){
            turnorder = this.whoAlive(turnorder);
            //this.logging(turnorder);
            this.logging(i);
            if(turnorder.length == 1){
                isBattleOver = true;
                break;
            }
            if(i >= turnorder.length){
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
        this.Time = this.scenario.Options.timer * 1000;
        let checked = this.checkConditions();
        if(checked == false){ 
            this.logging("Game start requirements not met!");
            return;}
        this.logging("Deleting Players.....");
        this.deletePlayers();
        // MAIN Game Loop
        this.logging("Game Started");
        this.logging(this.scenario.Players);
        while(this.GameOver == false){
            for(let i = 0; i < this.scenario.Story.length; i++){
                await this.sleep(this.scenario.Options.textSpeed);
                let line = scenario.Story[i];
                let isBattle = this.whichBattle(i);
                line = helpful.replaceKeyword('PLAYERS',line,this.scenario.Players);
                if(isBattle){
                    this.logging("Setting up current Battle....");
                    let battleindex = this.getBattleIndex(i);
                    this.turnorder = this.createTurns(battleindex);
                    this.logging('Commencing Battle');
                    let battletext = helpful.replaceKeyword('PLAYERS', this.battletext[Math.floor(Math.random() * this.battletext.length)],this.scenario.Players)
                    await this.message.say(battletext).then(m => {m.delete(this.Time);});
                    await this.commenceBattle(this.turnorder);
                }
                await this.message.say(line).then(m => {m.delete(this.Time);});
            }
            this.GameOver = true;
        }
        
    }
}

module.exports = motherBrain;