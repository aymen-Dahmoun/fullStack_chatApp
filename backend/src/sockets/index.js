import { Server } from 'socket.io';
import socketAuth from '../middlewares/socket.middleware.js';

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:3000',
            methods: ['GET', 'POST'],
        },
    });

    io.use(socketAuth);

    io.on('connection', (socket) => {
        console.log(`User connected: ${socket.id}, user: ${socket.user.username}`);

        socket.on('chat message', (msg) => {
            console.log(`${socket.user.username}: ${msg}`);
            io.emit('chat message', {
                user: socket.user.username,
                message: msg
            });
        });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};
