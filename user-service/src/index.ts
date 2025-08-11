import 'reflect-metadata';
import express from 'express';
import cors from 'cors'; // Add this import
import userRoutes from './routes/user.routes';
import { AppDataSource } from './utils/database';
import dotenv from 'dotenv';

dotenv.config();
//Todo
const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

// Enable CORS for your frontend origin
app.use(cors({
  origin: 'http://localhost:5173', // Your frontend URL
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/', userRoutes);

app.get('/check', (req, res) => {
  res.send('Hello from TypeScript and Express!');
});

AppDataSource.initialize()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error('Data Source initialization error:', error);
    process.exit(1);
  });