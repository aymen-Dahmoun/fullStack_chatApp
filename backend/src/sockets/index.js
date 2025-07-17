import { Server } from 'socket.io';
import socketAuth from '../middlewares/socket.middleware.js';
import { saveMessage } from '../services/saveMessage.js';

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

    socket.on('chat message', async (msg) => {
        try {
            if (!msg || typeof msg !== 'string') {
                throw new Error('Invalid message format');
            }
            if (msg.trim() === '') {
                throw new Error('Message cannot be empty');
            }

            const savedMessage = await saveMessage(socket.user.id, msg);

            console.log(`${socket.user.username}: ${msg}`);

            io.emit('chat message', {
                user: socket.user.username,
                message: savedMessage.content,
                timestamp: savedMessage.createdAt,
            });

        } catch (error) {
            console.error('Error handling chat message:', error);
            socket.emit('error', { message: error.message });
        }
    });

        socket.on('disconnect', () => {
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};
