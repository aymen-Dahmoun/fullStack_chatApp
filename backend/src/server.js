import express from 'express';
import cors from 'cors';
import http from 'http';
import { syncDatabase } from './models/index.js';
import authRouter from './routes/auth.routes.js';
import messageRouter from './routes/message.route.js';
import { initSocket } from './sockets/index.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('api/messages', messageRouter)

syncDatabase()
    .then(() => console.log('Database synced successfully.'))
    .catch((err) => console.error('Error syncing database:', err));

const server = http.createServer(app);
initSocket(server);

app.get('/', (req, res) => {
    res.send('Welcome to the chat server!');
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
