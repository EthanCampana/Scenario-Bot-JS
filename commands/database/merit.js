const commando = require('discord.js-commando');
const fs = require('fs');


class Merit extends commando.Command{
    constructor(client){
        super(client,{
           name: 'merit',
           group: 'database',
           memberName: 'merit',
           description: 'grant merit points to other players for good actions',
           args: [{ key: 'person', prompt: "Who is getting the merits", type: "user"},
                    {key: "points", prompt: "number of merits you want to give", type: "integer"},
                    {key: 'words', prompt: 'What action did this person do to deserve merits', type: 'string'}
        ]

        });
    }

    async run(message, { person, points, words }) {
        let doggo = "597570597605736458";
        let rawdata = fs.readFileSync( __dirname +'/database.json');  
        let database = JSON.parse(rawdata);  
        if(message.author.id === person.id){
            message.delete();
            message.say(`${message.author} is trying to do bamboozle! Dont make Doggo Angry! :angry:`).then(m => m.delete(60000))
            let chance = Math.floor(Math.random() * 20) + 1;
            if(chance === 3){
                database[doggo]["mood"] = 'mad';
                let data = JSON.stringify(database);  
                fs.writeFileSync(__dirname +'/database.json', data);
                message.say("Doggo is in a bad mood...").then(m => m.delete(10000));    
            }
            return;
        }
       let user  = database[`${person.id}`];
       console.log(user);
        if( user === undefined){
            let new_user = {
                    name: person.username,
                    merits: points,
                    demerits: 0,
                    inventory: [],
            }
            database[`${person.id}`] = new_user;
            let data = JSON.stringify(database);  
            fs.writeFileSync(__dirname +'/database.json', data); 
            message.say(`Doggo has granted ${person.username} ${points} points for ${words}`).then(m => m.delete(10000));
            return;
        }
        let mood = database[doggo]["mood"];
        let failure;
        switch(mood){

            case "happy":
                 failure = Math.floor(Math.random() * 10) + 1;
                if(failure === 1){
                message.say(`Doggo thinks ${person.username} does not deserve ${points} for ${words}`).then(m => m.delete(60000));  
                break;    
            }
                else{
                    let merits = user['merits'];
                    user['merits'] = points + merits;
                    let data = JSON.stringify(database);  
                    fs.writeFileSync(__dirname +'/database.json', data);
                    message.say(`Doggo has granted ${person.username} ${points} merit points for ${words}`).then(m => m.delete(60000)); 
                    message.say(`${person.username} has ${user['merits']} merits now!`).then(m => m.delete(60000)); 
                    break;
                }
            case "mad":
                     failure = Math.floor(Math.random() * 5) + 1;
                    if(failure === 1){
                    message.say(`NO! Merit Points for ${person.username}`).then(m => m.delete(60000)); 
                    break;
                    }
                    else{
                        let merits = user['merits'];
                        user['merits'] = points + merits;
                        let data = JSON.stringify(database);  
                        fs.writeFileSync(__dirname +'/database.json', data);
                        message.say(`Doggo has granted ${person.username} ${points} merit points for ${words}`).then(m => m.delete(60000)); 
                        message.say(`${person.username} has ${user['merits']} merits now!`).then(m => m.delete(60000));
                        break; 
                    }
        }
        

    }


}

module.exports = Merit;