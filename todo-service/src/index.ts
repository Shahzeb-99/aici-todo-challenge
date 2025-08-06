import 'reflect-metadata';
import express from 'express';
import todoRoutes from './routes/todo.routes';
import {AppDataSource} from './utils/database';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT ? Number(process.env.PORT) : 3000;

app.use(express.json());
app.use('/', todoRoutes);

/**
 * Root route of the application.
 * Responds with a welcome message.
 */
app.get('/check', (req, res) => {
    res.send('Hello from TypeScript and Express!');
});

/**
 * Initializes the database connection and starts the Express server.
 * Logs the server URL on successful startup or exits the process on failure.
 */
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

export default app;