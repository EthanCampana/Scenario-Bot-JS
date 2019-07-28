 exports = module.exports  = {
    
    fetch : fetch = require("node-fetch"),
    // Wrap functionality in a function
    Translate : function(url){
        let translation 
        return new Promise((resolve,reject) => {
        fetch(url).then(function(response){
            return response.json();
        }).then(function(json){
            translation = json;
            resolve(translation);
        })
        }).catch(function(err){
            reject(err);
        });

    }
    
}






