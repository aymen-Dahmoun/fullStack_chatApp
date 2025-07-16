import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';

const app = express();
app.use(express.json());
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});


io.on('connection', (socket) => {
    console.log('a user connected: ', socket.id);

    socket.on('disconnect', () => {
        console.log('user disconnected: ', socket.id);
    });

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        io.emit('chat message', msg);
    });
});

app.get('/', (req, res) => {
    res.send('Welcome to the chat server!');
});

server.listen(5000, () => {
    console.log('Server is running on port 5000');
});
