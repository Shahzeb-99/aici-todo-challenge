import 'reflect-metadata';
import express from 'express';
import userRoutes from './routes/user.routes';
import { AppDataSource } from './utils/database';

const app = express();
const port = 3000;

app.use(express.json());
app.use('/api/users', userRoutes);

app.get('/', (req, res) => {
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