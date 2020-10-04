const keys = require('./keys');
const redis = require('redis');


const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

function fibonacci(num){
    var a = 1, b = 0, temp;
    while (num >= 0){
      temp = a;
      a = a + b;
      b = temp;
      num--;
    }
    return b;
}
sub.subscribe('insert');
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fibonacci(parseInt(message)));
}); 
