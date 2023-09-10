import express from 'express';
import morgan from 'morgan';
import mysql from 'mysql2/promise';
import 'express-async-errors'

const PORT = 3000;

const app = express();

app.use(morgan('dev'));
app.use(express.static('public', { extensions: ['html'] }));

app.get('/api/hello', (req, res) => {
    res.json({ message: 'Hello World!' });
});

app.get('/api/error', (req, res) => {
    throw new Error('Error!');
})

// post /api/games -> create a new game
app.post('/api/games', async (req, res) => {
    const startedAt = new Date();

    const conn = await mysql.createConnection({
        host: 'localhost',
        database: 'reversi',
        user: 'test',
        password: 'password'
    });

    try {
        await conn.execute('INSERT INTO games (started_at) VALUES (?)', [startedAt]);
    } finally{
        await conn.end();
    }

    res.json({ message: 'Game created' });
})

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})