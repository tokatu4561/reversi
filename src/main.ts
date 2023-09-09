import express from 'express';
import morgan from 'morgan';
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

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err);
    res.status(500).json({ message: 'Something went wrong' });
})

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})