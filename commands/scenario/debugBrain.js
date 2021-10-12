const motherBrain = require('./motherBrain.js')
const { MessageEmbed } = require('discord.js');
const helpful = require('./../functions/helpful.js');


class debugBrain {
    constructor(channel, scenario, user){
        this.channel = channel
        this.scenario = scenario
        this.user = user
    }


    async interactMenu(filter, options={max: 1,errors:['time'], time: 20000}){
        let opt = false
        let res
        do{
            await this.channel.awaitMessages(filter,options)
            .then(c => res = c.first().content)
            .catch(c => console.log(`${c}`))
            if(res !== undefined){
                opt=true
                break;
            }
            else{
                this.channel.send("Please input an option by sending a message")
            }
        }while(!opt)
        return opt
    }


    printBattles(){
        let s = "Load a Battle\n"
        let i = 0 
        this.scenario.Battle.forEach(value =>{
            value.enemyID.forEach(id =>{
                s += `${i}) `
               this.scenario.Enemies.forEach(enemy =>{
                    if(id == enemy.enemyID){
                        s+=`${enemy.Name} `
                    }
               }) 
            })
            s+='\n'
            i++
        })
    }
    
    
   async choosePlayer(){
        let chosen = false
        let embed = new MessageEmbed()
        .setColor('#61ff90')
        .setTitle('PLAYERS')
        .setAuthor(scenario.Title)
        .setDescription(`Welcome! These are the heroes, villians, friends and foes that will be on this journey..
                        Choose wisely who you want to become... and reach the end of the scenario if you dare.`);

        helpful.displayCharacters(embed,this.scenario.Players);
        this.channel.send(embed)   
        do{
            let choice = await this.interactMenu(filter = message => message.author.id === this.user.id).toUpperCase()
            if(this.scenario.Players.has(choice) && this.scenario.Players.get(choice).playerID == null){
                let char = this.scenario.Players.get(choice);
                char.playerID =user.id 
                return chosen = true;
            }
        }
        while(!chosen)
        this.channel.send("you have chosen a character")
    }


    async mainMenu(){
        await this.channel.send("Main Menu\n1)Start Game From Line\n2)Start From A Battle\n 3)Quit\n please input option #")
        let res = await this.interactMenu(filter = message => message.author.id === this.user.id)
        switch(res){
            case "1":
                startGame()
                break;
            case "2":
                startBattle()
                break;
            case "3":
                this.channel.delete()
                break;
        }
        return;
    }


    async showLines( i = 0){
        let end = this.scenario.Story.length
        let render_limit = i + 7 
        while(i < render_limit && i < end){
          this.channel.send(`${i}) ${this.scenario.Story[i]}`) 
          i++
        }
        let k = i +1
        this.channel.send(`${k} Next Page`)
        let res = await this.interactMenu(filter = message => message.author.id === this.user.id)
        if(res == k){
            return this.showLines(i)
        }
        if(int(res) < k){
            return res
        }
        this.channel.send("This is not an option returning to main menu")     
        this.mainMenu()
    }
        


    async startGame(){
        this.channel.send("Please Select A Line To Start From\n use the number as your choice") 
        let res = await showLines()
        this.scenario.Story.slice(int(res)) 
        await this.choosePlayer()
        let game = new motherBrain(this.channel,this.scenario)
        game.run()
    } 

    
    async startBattle(){
        await this.channel.send(this.printBattles())
        let res = await this.interactMenu(filter = message => message.author.id === this.user.id)
        if(int(res) >= this.scenario.Battle.length){
            this.channel.send("This is not an option returning to the Main Menu")
            this.mainMenu()
        }
        await this.choosePlayer()
        let game = new motherBrain(this.channel,this.scenario)
        game.deletePlayers()
        game.createTurns(int(res))
        game.commenceBattle()
        return
    }


    async run(){
      await this.channel.send("Welcome to the Debug Room!")
      await this.channel.send("In here is where you be able to load your game from any point and dry run battles!")
      await this.mainMenu()
    }
}

module.exports = debugBrain