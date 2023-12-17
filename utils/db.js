import { MongoClient } from 'mongodb';

const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 27017;
const DB_DATABASE = process.env.DB_DATABASE || 'files_manager';
const url = `mongodb://${DB_HOST}:${DB_PORT}`;

class DBClient {
  constructor() {
    MongoClient.connect(url, { useUnifiedTopology: true }, (err, client) => {
      if (!err) {
        this.db = client.db(DB_DATABASE);
        this.users = this.db.collection('users');
        this.files = this.db.collection('files');
      } else {
        console.error(`MongoDB connection error: ${err.message}`);
        this.db = null;
      }
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

  close() {
    if (this.db) {
      this.db.close();
    }
  }
}

const dbClient = new DBClient();
export default dbClient;

