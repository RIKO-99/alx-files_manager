import express from 'express';
import dotenv from 'dotenv';
import routes from './routes';

dotenv.config(); // Load environment variables from .env file

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json()); // Use the express.json middleware to parse JSON

app.use('/', routes); // Use the routes from the 'routes' folder

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
