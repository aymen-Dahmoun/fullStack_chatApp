import { Server } from 'socket.io';
import socketAuth from '../middlewares/socket.middleware.js';
import { saveMessage } from '../services/saveMessage.js';
import dotenv from 'dotenv'

dotenv.config();


const onlineUsers = new Map();

export const initSocket = (server) => {
    const io = new Server(server, {
        cors: {
            origin: 'https://fullstack-chatapp-71vx.onrender.com', // process.env.IP_ADDRESS_LINK,
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
        const { content, conversationId, receiverId, tempId } = data;


        if (!content || typeof content !== 'string') {
        throw new Error('Invalid message content');
        }

        const savedMessage = await saveMessage({
        senderId: userId,
        conversationId,
        content,
        });
        const messagePayload = {
            id: savedMessage.id,
            content: savedMessage.content,
            conversationId,
            createdAt: savedMessage.createdAt,
            tempId,
            sender: {
                id: userId,
                username: socket.user.username,
            },
        };

        socket.emit('chat message', messagePayload);

    const receiverSocketId = onlineUsers.get(receiverId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit('chat message', messagePayload)
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
