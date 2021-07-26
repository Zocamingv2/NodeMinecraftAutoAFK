process.on('unhandledRejection', error => {
    console.error('unhandledRejection', error);
    process.exit(1) // To exit with a 'failure' code
    });

const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

var firstlogin = true;
var loginhealth = 0;

var mc = require('minecraft-protocol');
var config = require('./config');
const { title } = require('process');
var client = mc.createClient({
    host: config.server_host,
    port: config.server_port,
    username: config.username,
    password: config.password
});

  
  client.on('update_health', function (packet) {
    console.log(packet);
    if (packet.food < 20){
        client.write('use_item', {hand: 0});
    }
    
    if (firstlogin){
        loginhealth = packet.health;
        firstlogin = false;
    }
    
    if (packet.health < 10){
        if (packet.health >= loginhealth){
            console.log("在恢复");
        }
        else{
            process.exit(0);//血量小于10但没在恢复 退出
        }
        if (packet.health < 5){
            process.exit(0);//血量小于5 过于危险
        }
    }
    
  })

  client.on('kick_disconnect', function (packet) {
    console.log('Kicked for ' + packet.reason);
    process.exit(1);
  })
  
  
  client.on('disconnect', function (packet) {
    console.log('[' + new Date + ']' + 'disconnected: ' + packet.reason)
    process.exit(1);
  })
  
  client.on('end', function () {
    console.log('[' + new Date + ']' + 'Connection lost')
    process.exit(1);
  })
  
  client.on('error', function (err) {
    console.log('[' + new Date + ']' + 'Error occured');
    console.log(err);
    process.exit(1);
  })
