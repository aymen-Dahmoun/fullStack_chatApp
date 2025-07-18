import jwt from "jsonwebtoken";
const JWT_SECRET = "temp_secret_key";


export default function checkSession(req, res, next) {

    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: "No token provided" });
    }
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            return res.status(401).json({ error: "Invalid token" });
        }
        req.user = decoded;
        next();
    });
}