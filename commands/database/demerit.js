const commando = require('discord.js-commando');
const fs = require('fs');


class Demerit extends commando.Command{
    constructor(client){
        super(client,{
           name: 'demerit',
           group: 'database',
           memberName: 'demerit',
           description: 'grant Demerit points to other players for bad actions',
           args: [{ key: 'person', prompt: "Who is getting the demerits", type: "user"},
                    {key: "points", prompt: "number of demerits you want to give", type: "integer"},
                    {key: 'words', prompt: 'What action did this person do to deserve demerits', type: 'string'}
        ]

        });
    }

    async run(message, { person, points, words }) {
        let doggo = "597570597605736458";
        let rawdata = fs.readFileSync( __dirname +'/database.json');  
        let database = JSON.parse(rawdata);
        message.delete();  
        if(message.author.id === person.id){
            message.say(`${message.author}  r u dum??`).then(m => m.delete(10000));
            let chance = Math.floor(Math.random() * 20) + 1;
            if(database[doggo]["mood"] === "mad" && chance === 3){
                let demerits = user['demerits'];
                user['demerits'] = points + demerits;
                let data = JSON.stringify(database);  
                fs.writeFileSync(__dirname +'/database.json', data);
                message.say(`Doggo has given ${person.username} ${points} demerit points for being stupid`).then(m => m.delete(60000)); 
                message.say(`${person.username} has ${user['demerits']} demerits now!`).then(m => m.delete(60000)); 
            }
            return;
        }
       let user  = database[`${person.id}`];
       console.log(user);
        if( user === undefined){
            let new_user = {
                    name: person.username,
                    merits: 0,
                    demerits: points,
                    inventory: [],
            }
            database[`${person.id}`] = new_user;
            let data = JSON.stringify(database);  
            fs.writeFileSync(__dirname +'/database.json', data); 
            message.say(`Doggo has given ${person.username} ${points} demerits for ${words}`).then(m => m.delete(10000));
            return;
        }
        let mood = database[doggo]["mood"];
        let failure;
        switch(mood){

            case "happy":
                 failure = Math.floor(Math.random() * 9) + 1;
                if(failure === 1){
                message.say(`Nah I dont think so B`).then(m => m.delete(60000)); 
                break; 
                }
                else{
                    let demerits = user['demerits'];
                    user['demerits'] = points + demerits;
                    let data = JSON.stringify(database);  
                    fs.writeFileSync(__dirname +'/database.json', data);
                    message.say(`Doggo has granted ${person.username} ${points} demerit points for ${words}`).then(m => m.delete(60000)); 
                    message.say(`${person.username} has ${user['demerits']} demerits now!`).then(m => m.delete(60000)); 
                    break;
                }
            case "mad":
                     failure = Math.floor(Math.random() * 20) + 1;
                    if(failure === 1){
                    message.say(`Nah I dont think so B`).then(m => m.delete(60000));
                    break; 
                    }
                    else{
                        let merits = user['demerits'];
                        user['demerits'] = points + merits;
                        let data = JSON.stringify(database);  
                        fs.writeFileSync(__dirname +'/database.json', data);
                        message.say(`Doggo has granted ${person.username} ${points} demerit points for ${words}`).then(m => m.delete(60000)); 
                        message.say(`${person.username} has ${user['merits']} demerits now!`).then(m => m.delete(60000)); 
                        break;
                    }
        }
        

    }


}

module.exports = Demerit;