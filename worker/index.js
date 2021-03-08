const keys = require("./keys");

const redis = require("redis");


const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

//redisClient.hset('values', 3, 33);

const sub = redisClient.duplicate();

function fib(index) {
    if(index < 2) return 1;
    return fib(index - 1) + fib(index - 2);
}

	//any time that we get a new value that shows up in redis 
sub.on("message", (channel, message) => {
    // insert each value into hash called values
    redisClient.hset('values', message, fib(parseInt(message)))
});

sub.subscribe('insert');


