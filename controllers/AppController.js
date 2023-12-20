import dbClient from '../utils/db';
import redisClient from '../utils/redis';

class AppController {
  static async getStatus(req, res) {
    const redisIsAlive = redisClient.isAlive();
    const dbIsAlive = dbClient.isAlive();

    const status = {
      redis: redisIsAlive,
      db: dbIsAlive,
    };

    const statusCode = redisIsAlive && dbIsAlive ? 200 : 500;

    res.status(statusCode).json(status);
  }

  static async getStats(req, res) {
    try {
      const usersCount = await dbClient.nbUsers();
      const filesCount = await dbClient.nbFiles();

      const stats = {
        users: usersCount,
        files: filesCount,
      };

      res.status(200).json(stats);
    } catch (error) {
      console.error(`Error getting stats: ${error.message}`);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  }
}

export default AppController;
