const Redis = require('ioredis');

// connection establish horaha hai
const redis = new Redis({
   // Redis client ka ek single instanc bana rahe hain
    host: process.env.REDIS_HOST,
    port: process.env.REDIS_PORT,
});

// Redis connect hojye successfully
redis.on('connect', ()=>{
    console.log('Redis connected');
})

redis.on('error', (err) => {
  console.error(' Redis error:', err);
});

module.exports = redis;