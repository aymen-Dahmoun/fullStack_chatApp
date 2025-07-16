import jwt from 'jsonwebtoken';

const socketAuth = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        const err = new Error('Authentication error: Token required');
        err.data = { content: 'No token provided' };
        return next(err);
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
        if (err) {
            const authError = new Error('Authentication error: Invalid token');
            authError.data = { content: 'Token invalid or expired' };
            return next(authError);
        }
        socket.user = decoded;
        next();
    });
};

export default socketAuth;
