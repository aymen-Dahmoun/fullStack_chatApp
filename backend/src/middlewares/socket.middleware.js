import jwt from 'jsonwebtoken';
const JWT_SECRET = "temp_secret_key"

const socketAuth = (socket, next) => {
    const token = socket.handshake.auth.token;

    if (!token) {
        const err = new Error('Authentication error: Token required');
        err.data = { content: 'No token provided' };
        return next(err);
    }

    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        console.log('token: ', token)


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
