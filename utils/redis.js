const redis = require('redis');

class RedisClient {
  constructor() {
    this.client = redis.createClient();

    // Use a logging library in a production environment
    this.client.on('error', (err) => {
      console.error(`Error connecting to Redis: ${err}`);
    });
  }

  // Check if the connection to Redis is alive
  isAlive() {
    return new Promise((resolve) => {
      resolve(this.client.connected);
    });
  }

  // Retrieve the value for a given key from Redis
  async get(key) {
    return new Promise((resolve, reject) => {
      this.client.get(key, (err, value) => {
        if (err) {
          reject(err);
        } else {
          resolve(value);
        }
      });
    });
  }

  // Store a key-value pair in Redis with an expiration time
  async set(key, value, durationInSeconds) {
    return new Promise((resolve, reject) => {
      this.client.set(key, value, 'EX', durationInSeconds, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }

  // Remove the value associated with a key from Redis
  async del(key) {
    return new Promise((resolve, reject) => {
      this.client.del(key, (err) => {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      });
    });
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
