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
            console.log("waiting for option")
            console.log(this.user.id)
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
        return res
    }


    printBattles(){
        let s = "Load a Battle\n"
        let i = 0 
        this.scenario.Battle.forEach(value =>{
            s += `${i}) `
            value.enemyID.forEach(id =>{
               this.scenario.Enemies.forEach(enemy =>{
                    if(id == enemy.enemyID){
                        s+=`${enemy.Name} `
                    }
               }) 
            })
            s+='\n'
            i++
        })
        return s
    }
    
    
   async choosePlayer(){
        let chosen = false
        let embed = new MessageEmbed()
        .setColor('#61ff90')
        .setTitle('PLAYERS')
        .setAuthor(this.scenario.Title)
        .setDescription(`Welcome! These are the heroes, villians, friends and foes that will be on this journey..
                        Choose wisely who you want to become... and reach the end of the scenario if you dare.`);

        helpful.displayCharacters(embed,this.scenario.Players);
        this.channel.send(embed)   
        do{
            let filter = message => message.author.id === this.user.id
            let choice = await this.interactMenu(filter)
            choice = choice.toUpperCase()
            if(this.scenario.Players.has(choice) && this.scenario.Players.get(choice).playerID == null){
                let char = this.scenario.Players.get(choice);
                char.playerID =this.user.id 
                return chosen = true;
            }
        }
        while(!chosen)
        this.channel.send("you have chosen a character")
    }


    async mainMenu(){
        await this.channel.send("Main Menu\n1)Start Game From Line\n2)Start From A Battle\n 3)Quit\n please input option #")
        let filter = message => message.author.id === this.user.id
        let res = await this.interactMenu(filter)
        switch(res){
            case "1":
                this.startGame()
                break;
            case "2":
                this.startBattle()
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
        while(i <= render_limit && i < end){
          this.channel.send(`${i}) ${this.scenario.Story[i]}`) 
          i++
        }
        let k = i 
        this.channel.send(`${k} Next Page`)
        let filter = message => message.author.id === this.user.id
        let res = await this.interactMenu(filter)
        if(res == k){
            return this.showLines(i)
        }
        if(parseInt(res) < k){
            return res
        }
        this.channel.send("This is not an option returning to main menu")     
        this.mainMenu()
    }
        


    async startGame(){
        this.channel.send("Please Select A Line To Start From\n use the number as your choice") 
        let res = await this.showLines()
        await this.choosePlayer()
        let game = new motherBrain(this.channel,this.scenario)
        game.pointer=parseInt(res)
        game.run()
    } 

    
    async startBattle(){
        await this.channel.send(this.printBattles())
        let filter = message => message.author.id === this.user.id
        let res = await this.interactMenu(filter)
        if(parseInt(res) >= this.scenario.Battle.length){
            this.channel.send("This is not an option returning to the Main Menu")
            this.mainMenu()
        }
        await this.choosePlayer()
        let game = new motherBrain(this.channel,this.scenario)
        game.deletePlayers()
        game.createTurns(parseInt(res))
        game.Time = {"timeout": this.scenario.Options.timer * 1000}
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