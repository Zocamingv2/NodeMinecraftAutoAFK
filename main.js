const mineflayer = require('mineflayer');
const config = require('./config');


var firstLogin = true;
var loginHealth = 0;


const bot = mineflayer.createBot({
    host: config.server_host,
    port: config.server_port,
    username: config.username,
    password: config.password,
    auth: config.auth
}); 

bot.on('health', function () {
    if (firstLogin){
        loginHealth = bot.health;
        firstLogin = false;
    }

    if(bot.food < 20){
        bot.activateItem();
    }
    if (bot.health < 10){
        if (bot.health >= loginHealth){
            console.log("HP is recovering");
        } else {
            process.exit(0);//health < 10 and not recovering
        }
        if (bot.health < 5){
            process.exit(0);//health < 5 dangerous
        }
    }
    console.log('Health Update.');
  });

bot.on('kicked',function(err){
    console.log(err);
    process.exit(-1);
});
bot.on('end',function(err){
    console.log(err);
    process.exit(-2);
}); 
bot.on('error', function (err) {
    console.log('ERROR OCCURED,EXITING');
    console.log(err);
    process.exit(1);
});

