import { Server } from 'socket.io';
import socketAuth from '../middlewares/socket.middleware.js';
import { saveMessage } from '../services/saveMessage.js';


const onlineUsers = new Map();

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'http://localhost:5000',
            methods: ['GET', 'POST'],
        },
    });

    io.use(socketAuth);

    io.on('connection', (socket) => {
        const userId = socket.user.id;
        onlineUsers.set(userId, socket.id);

        console.log(`User connected: ${socket.id}, user: ${socket.user.username}`);

    socket.on('chat message', async (data) => {
    try {
        const { content, conversationId, receiverId } = data;

        if (!content || typeof content !== 'string') {
        throw new Error('Invalid message content');
        }

        const savedMessage = await saveMessage({
        senderId: socket.user.id,
        conversationId,
        content,
        });

    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('chat message', {
        user: socket.user.username,
        content: savedMessage.content,
        conversationId,
        timestamp: savedMessage.createdAt,
      });
    }

    } catch (error) {
    console.error('Error handling chat message:', error);
    socket.emit('error', { message: error.message });
    }
    });

        socket.on('disconnect', () => {
            onlineUsers.delete(socket.user.id);
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};
