const helpful = require('./../functions/helpful.js');

class motherBrain {
    
    constructor(channel, scenario,){
        this.channel = channel;
        this.scenario = scenario;
        this.player = null;
        this.battletext = ["A raging battle is about to brew", "Unexpected foes have been encountered", "PLAYERS can't escape from clashing with foes","A battle is about to commence"];
        this.Time = 0;
        this.turnorder = []
        this.GameOver = false;
        
    }

    getPlayerKeys(){
        let array = []
        this.turnorder.forEach((value)=>
        {
            if(value.Type == "Player"){
                array.push(value.Name.toUpperCase());
            }
        }
        );
        return array;
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
    
    healPlayers(){
        this.scenario.Players.forEach((value)=>{
            value.HP += 50;
            value.MP += 30;
        })
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
        this.channel.send("You dont have enough players to start the game").then(m => {m.delete(this.Time);});
        return false;
    }
    //NEED TO PASS BATTLEINDEX INCASE OF MULTIPLE BATTLES?
     createTurns(battleindex){
        let turnorder = [];
        this.scenario.Players.forEach((value, key, map) =>{turnorder.push(value)})
        for( let i=0; i < this.scenario.Battle[battleindex].enemyID.length; i++){
            this.scenario.Enemies.forEach((value, key, map) => {
                if(this.scenario.Battle[battleindex].enemyID[i] == value.enemyID){
                turnorder = helpful.enemyAppeared(value,turnorder, this.channel);    
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
        return
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
      return  arr[Math.floor(Math.random()*arr.length)];
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
        let checked = this.turnorder.some((value, index, array) => {return value.Name == name;})
        return checked;
    }

    checkBuff(name){
        let checked = this.turnorder.some((value, index, array) => {return value.Name.toUpperCase() == name.toUpperCase();});
        return checked;
    }
    
    // Probably some garbage collection i can do with these arrays
    checkBattleStatus(array){
       let isPlayersAlive = array.some((value, index, array) => {return value.Type == "Player";});
       let isMonstersAlive = array.some((value, index, array) => {return value.Type == "Enemy";});
       let hasFled = array.some((value,index,array)=> {return value.hasFled == false;});
       if(isMonstersAlive == false || this.turnorder.length == 1 || isPlayersAlive == false){
           return true;
       }
       if(hasFled == false){
           let Line = "PLAYERS have successfully fled";
           Line = helpful.replaceKeyword('PLAYERS', Line ,this.scenario.Players);
           this.channel.send(Line);
           return true;
       }
       return false;
    }

    checkSkills(){
        if(! this.player.hasOwnProperty('Skills') || this.player.Skills.length == 0 ){
            return false;
        }
        return true;
    }

    checkMonSkill(enemy){
        if(! enemy.hasOwnProperty('Skills') || enemy.Skills.length == 0){
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
                    this.channel.send(`${player.Name} has gained ${buff.amount} ${buff.stat}`);
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
                    this.channel.send(`${player.Name} has lost ${value.amount} ${value.stat} from ${value.name}`);
                    value.length -=1;
                }
                else{
                    value.length -=1;
                }

            });
        }
        return player;

    }

    //BATTLE FUNCTION DETERMINES WHO TURN IT IS AND WHEN THE BATTLE IS OVER
    async commenceBattle(turnorder){
        let isBattleOver = false;
        let i = 0;
        while(isBattleOver == false){
            this.whoAlive(turnorder);
            isBattleOver = this.checkBattleStatus(turnorder);
            if(isBattleOver){
                break;
            }
            if(i >= turnorder.length){
                i = 0;
            }

            switch(turnorder[i].Type){
                case "Player":
                    await this.playerAct(turnorder[i]);
                    break;
                case "Enemy":
                    this.enemyAct(turnorder[i]);
                    break;
            }
            i++;
        };
        this.healPlayers();
        this.logging("Battle has ended");
        }



//-----------------PLAYER MENU STUFF BEGINS HERE------------------------//
    //PLAYERS TURN ALL PLAYER OPTIONS GO HERE
    //CHANGE ALL PLAYER MENUS TO EMOJI MENUS FOR EASE OF USE... Maybe need Dictionaries and Switch Statment for Dynamic Emojis
    //General Cleanup also needed in all the menus ---Tedious work :[
    async playerAct(player){
        this.player = this.normalize(player);
        let filter = message => this.player.playerID === message.author.id;
        let waittime = 5;
        let action = "";
        let optionChosen = false;
        this.channel.send(`${player.Name} it is your turn`).then(m => {m.delete(this.Time);});
        do{
            this.channel.send(`Attack    Skill      Defend     Run: ${waittime} \n Current HP: ${player.HP} Current MP: ${player.MP}`)
         .then(()=> m.react('⚔️'))
         .then(()=> m.react(':mage:'))
         .then(()=> m.react(':shield:'))
         .then(()=> m.react(':person_running:'))
         .then(m => {m.delete(this.Time);});
        
         let message = this.channel.lastMessage

        await message.channel.awaitReactions(filter,{max: 1, time: this.Time})
        .then(collected =>{
            if(collected.first() == undefined){
                waittime -=1;
                return;
            }
            if(waittime == 0){
                optionChosen = true;
                waittime = null;
                return;
             }

            action = collected.first().emoji.name;
            waittime = null; });
        switch(action){
            case ':crossed_swords:':
                await this.attackOptions(); 
                optionChosen = true;
                break;
            case ':mage:':
                if(this.checkSkills()){
                    optionChosen = await this.skillOptions();
                    return;
                }
                this.channel.send("You do not have any skills..").then(m => {m.delete(this.Time);});
                break;
            case ':shield:':
                player.defend(this.channel);
                optionChosen = true;
                break;
            case ':person_running:':
                optionChosen = true;
                let num = helpful.Range(0,100);
                if(num == 1){
                    this.player.hasFled = true;
                    this.channel.send(`${this.player.Name} has fled from the battle`);
                }
                this.channel.send(`${this.player.Name} tried to flee from battle but failed!`);
                num = null;
                break;
        }
        }
        while(optionChosen == false)
    }


///-------------ATTACK SUBMENU-------------------------//
   async attackOptions(){
        this.logging("Sub-Menu Opened")
        let chance = 2;
        let option = false;
        let filter = message => this.player.playerID === message.author.id;
        await  this.channel.send("Enemies:").then(m => {m.delete(this.Time);});
        await this.channel.send(this.getEnemyName()).then(m => {m.delete(this.Time);});
        do{
            if(chance == 0){
                option = true;
                break;
             }
            await this.channel.awaitMessages(filter,{max: 1, time: this.Time}).then(collected =>{
                if(collected.first() == undefined){
                    chance -=1;
                    return;
                }
                let enemyName = collected.first().content;
                if(this.checkAttack(enemyName)){
                    this.scenario.Enemies.set(enemyName.toUpperCase(),this.player.Act(this.scenario.Enemies.get(enemyName.toUpperCase()),this.channel));
                    option = true;
                    enemyName = null;
                    return;
                }
                this.channel.send("Enemy not here " + enemyName).then(m => {m.delete(this.Time);});
                enemyName = null;
                chance -=1;
                
            });
        }
        while(option == false)
        this.logging("Sub-Menu Closed");
    }



//--------------------Skills Menu--------------------------------//
    async skillOptions(){
        this.logging("Skill Sub-Menu Opened")
        let chance = 3;
        let option = false;
        let filter = message => this.player.playerID === message.author.id;
        let hasexited = false;
        let skillName;
        await  this.channel.send("Skills:").then(m => {m.delete(this.Time);});
        await this.channel.send(this.printSkills(this.player)).then(m => {m.delete(this.Time);});
        do{
            if(chance == 0){ option = true; break;}
            await this.channel.awaitMessages(filter,{max: 1, time: this.Time}).then(collected =>{
                
                if(collected.first() == undefined){
                    chance -=1;
                    return;
                }
                
                skillName = collected.first().content.toUpperCase();
            });

            
            if(skillName == "BACK"){
                hasexited = true;
                option = true;
                return;
            }

            if(!this.player.Skills.has(skillName)){
                this.channel.send("No Skill of such name").then(m => {m.delete(this.Time);});
                chance -=1;
                skillName = null;
                return;
            }
            else{
                if(this.player.Skills.get(skillName).cost > this.player.MP ){
                    this.channel.send("You don't have enough MP to use this Skill").then(m => {m.delete(this.Time);}); 
                    skillName = null;
                    return;
                }
                        //ChooseSkillTarget passes in the chosen skill object instead of index since switching over to mapping system
                option = await this.chooseSkillTarget(this.player.Skills.get(skillName));
                }
            }
        while(option == false)
        if(hasexited){
            return option;
        }
        return option;
    }

//----------------------------Target Menu For Using a Skill---------------------------------------//
    async chooseSkillTarget(skill){
        this.logging("Skill Target Menu Opened")
        let chance = 3;
        let option = false;
        let filter = message => this.player.playerID === message.author.id;

        //Determines what type of skill that was passed in during the previous Menu
        switch(skill.type){
            case "Buff":
                await this.channel.send(this.getPlayerName()).then(m => {m.delete(this.Time);});
                do{
                if(chance == 0){  option = true; break;     }
                await this.channel.awaitMessages(filter,{max: 1, time: this.Time}).then(collected =>{
                    if(collected.first() == undefined){
                        chance -=1;
                        return;
                    }
                    let playerName = collected.first().content;
                    if(this.checkBuff(playerName)){
                    //Player Uses Skill Here on Player
                        this.channel.send(`${this.player.Name} used ${this.player.Skills[index].name} on ${playerName}`).then(m => {m.delete(this.Time);})
                        this.scenario.Players.get(playerName.toUpperCase(),this.player.useSkill(skill,this.scenario.Players.get(playerName.toUpperCase()),this.channel));
                        playerName = null;
                        option = true;
                        return;
                    }
                    this.channel.send("No Player named " + playerName).then(m => {m.delete(this.Time);});
                    playerName = null;
                    chance -=1;      
                    });
                    }
                while(option == false)
                break;

            case "Physical":
                await this.channel.send(this.getEnemyName()).then(m => {m.delete(this.Time);});
                do{  
                    if(chance == 0){  option = true; break;     }
                await this.channel.awaitMessages(filter,{max: 1, time: this.Time}).then(collected =>{
                    if(collected.first() == undefined){
                        chance -=1;
                        return;
                    }
                    let enemyName = collected.first().content;
                    if(this.checkAttack(enemyName)){
                       //Player Uses Skill Here
                        this.channel.send(`${this.player.Name} used ${this.player.Skills[index].name} `).then(m => {m.delete(this.Time);});
                        this.channel.send(this.player.Skills[index].hit).then(m => {m.delete(this.Time);});
                        this.scenario.Enemies.set(enemyName.toUpperCase(),this.player.useSkill(skill,this.scenario.Enemies.get(enemyName.toUpperCase()),this.channel));
                        enemyName = null;
                        option = true;
                        return;
                    }
                    this.channel.send("Enemy not here " + enemyName).then(m => {m.delete(this.Time);});
                    enemyName = null;
                    chance -=1;
                });
                }
                while(option == false)
                break;
            case "Magic":
                await this.channel.send(this.getEnemyName()).then(m => {m.delete(this.Time);});
                do{  
                    if(chance == 0){  option = true; break;     }
                    await this.channel.awaitMessages(filter,{max: 1, time: this.Time}).then(collected =>{
                    if(collected.first() == undefined){
                        chance -=1;
                        return;
                    }
                    let enemyName = collected.first().content;
                    if(this.checkAttack(enemyName)){
                    //Player Uses Skill Here
                        this.channel.send(`${this.player.Name} used ${this.player.Skills[index].name} `).then(m => {m.delete(this.Time);});
                        this.scenario.Enemies.set(enemyName.toUpperCase(),this.player.useSkill(skill,this.scenario.Enemies.get(enemyName.toUpperCase()),this.channel));
                        enemyName = null;
                        option = true;
                        return;
                    }
                    this.channel.send("Enemy not here " + enemyName).then(m => {m.delete(this.Time);});
                    enemyName = null;
                    chance -=1;
                });
                }
                while(option == false)
                break;
        }
        filter = null;
        chance = null;
        return option;

    }


//-----------------PLAYER MENU STUFF Ends Here-----------------------//

    //ENEMY AI BASICALLY NEEDS TO BE UPDATED
    enemyAct(enemy){
        let choice = Math.floor((Math.random() * 3) +1);
        enemy = this.normalize(enemy);
        let keys = this.getPlayerKeys();
        switch(choice){
            case 1:
                this.scenario.Players.set(target.Name.toUpperCase(),enemy.Act(this.scenario.Players.get(keys[Math.floor(Math.random() * keys.length)]),this.channel));
                break;
            case 2:
                enemy.defend(this.channel);
                break;
            case 3:
                if(this.checkMonSkill(enemy)){
                    if(enemy.Skills.length == 1){skill = 0;}
                    let skill =  enemy.Skills[Math.floor(Math.random() * enemy.Skills.length)];
                    switch(skill.type){
                        case "Buff":
                            this.scenario.Enemies.set(target.Name.toUpperCase(),enemy.useSkill(skill,this.getRandomEnemy(),this.channel));
                            break;
                        case "Physical":
                            this.channel.send(skill.hit).then(m => {m.delete(this.Time);});
                            this.scenario.Players.set(target.Name.toUpperCase(),enemy.useSkill(skill,this.scenario.Players.get(keys[Math.floor(Math.random() * keys.length)]),this.channel));
                            break;
                        case "Magic":
                            this.scenario.Players.set(target.Name.toUpperCase(),enemy.useSkill(skill,this.scenario.Players.get(keys[Math.floor(Math.random() * keys.length)]),this.channel));
                            break;
                    }
                    skill=null;
                }
        }
    }


  //MAIN FUNCTION WHAT STARTS THE GAME
   async run(){
        this.logging("Checking Requirements.....") ;
        this.Time = this.scenario.Options.timer * 1000;
        if(this.checkConditions() == false){ 
            this.logging("Game start requirements not met!");
            return;}
        this.logging("Deleting Players.....");
        this.deletePlayers();
//-------------- MAIN Game Loop ------------------------------------//
        this.logging("Game Started");
        this.logging(this.scenario.Players);
        while(this.GameOver == false){
            for(let i = 0; i < this.scenario.Story.length; i++){
                await this.sleep(this.scenario.Options.textSpeed);
                let line = helpful.replaceKeyword('PLAYERS',scenario.Story[i],this.scenario.Players);
                if(this.whichBattle(i)){
                    this.logging("Setting up current Battle....");
                    this.turnorder = this.createTurns(this.getBattleIndex(i));
                    this.logging('Commencing Battle');
                    let battletext = helpful.replaceKeyword('PLAYERS', this.battletext[Math.floor(Math.random() * this.battletext.length)],this.scenario.Players)
                    await this.channel.send(battletext).then(m => {m.delete(this.Time);});
                    battletext = null;
                    await this.commenceBattle(this.turnorder);
                }
                await this.channel.send(line).then(m => {m.delete(this.Time);});
            }
            this.GameOver = true;
        }
        
    }
}


module.exports = motherBrain;