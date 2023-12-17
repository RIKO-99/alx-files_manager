import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    this.db = null;
    this.users = null;
    this.files = null;

    const connectPromise = new Promise((resolve, reject) => {
      MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
        if (!err) {
          this.db = client.db(DB_DATABASE);
          this.users = this.db.collection('users');
          this.files = this.db.collection('files');
          resolve();
        } else {
          console.error(`MongoDB connection error: ${err.message}`);
          reject(err);
        }
      });
    });

    this.connectionPromise = connectPromise.then(() => {
      console.log('MongoDB connection established successfully.');
    }).catch((error) => {
      console.error('MongoDB connection promise rejected:', error.message);
    });
  }

  isAlive() {
    return !!this.db && this.db.serverConfig.isConnected();
  }

  async nbUsers() {
    return this.users.countDocuments();
  }

  async nbFiles() {
    return this.files.countDocuments();
  }

  async getUser(query) {
    const user = await this.users.findOne(query);
    return user;
  }

  async waitConnection() {
    await this.connectionPromise;
  }

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

const dbClient = new DBClient();
export default dbClient;
