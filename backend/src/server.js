import express from 'express';
import cors from 'cors';
import http from 'http';
import { syncDatabase } from './models/index.js';
import authRouter from './routes/auth.routes.js';
import sessionRouter from './routes/session.route.js';
import conversationRouter from './routes/conversation.route.js';
import { initSocket } from './sockets/index.js';
import checkSession from './middlewares/session.middleware.js';
import messageRouter from './routes/chat.route.js';
import searchRouter from './routes/search.route.js';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/auth', authRouter);
app.use('/api', checkSession, sessionRouter);
app.use('/api/conversation', conversationRouter);
app.use('/api/conversation/chat', messageRouter);
app.use('/api/search/users', searchRouter);


syncDatabase()
    .then(() => console.log('Database synced successfully.'))
    .catch((err) => console.error('Error syncing database:', err));

const server = http.createServer(app);
initSocket(server);

app.get('/', (req, res) => {
    res.send('Welcome to the chat server!');
});

server.listen(5000, '0.0.0.0', () => {
    console.log('Server is running on port 5000');
});
