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
        socket.on('call user', (data) => {
            const { receiverId, signalData, from, name } = data;
            const receiverSocketId = onlineUsers.get(receiverId);

            if (receiverSocketId) {
                io.to(receiverSocketId).emit('incoming call', {
                signal: signalData, // offer (SDP)
                from,
                name,
                });
            }
            });

            socket.on('answer call', (data) => {
            const { to, signalData } = data; // to = callerId
            const callerSocketId = onlineUsers.get(to);

            if (callerSocketId) {
                io.to(callerSocketId).emit('call accepted', {
                signal: signalData, // (SDP)
                from: socket.user.id,
                });
            }
            });

            socket.on('refuse call', (data) => {
            const { to } = data;
            const callerSocketId = onlineUsers.get(to);

            if (callerSocketId) {
                io.to(callerSocketId).emit('call refused', {
                from: socket.user.id,
                });
            }
            });

            socket.on('end call', (data) => {
            const { to } = data;
            const peerSocketId = onlineUsers.get(to);

            if (peerSocketId) {
                io.to(peerSocketId).emit('call ended', {
                from: socket.user.id,
                });
            }
            });
            socket.on('ice-candidate', (data) => {
                const { to, candidate } = data;
                const peerSocketId = onlineUsers.get(to);

                if (peerSocketId) {
                    io.to(peerSocketId).emit('ice-candidate', {
                    from: socket.user.id,
                    candidate,
                    });
                }
            });



        socket.on('disconnect', () => {
            onlineUsers.delete(socket.user.id);
            console.log(`User disconnected: ${socket.id}`);
        });
    });

    return io;
};
