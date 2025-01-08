import express from 'express';
import cors from 'cors';
import { tasksRoutes } from './routes/tasksRoutes';

const app = express();



app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ message: 'API is running' });
});

app.use('/tasks', tasksRoutes);


// Configurar o Express para usar UTF-8
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Configurar headers para UTF-8
app.use((req, res, next) => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    next();
});

export { app };