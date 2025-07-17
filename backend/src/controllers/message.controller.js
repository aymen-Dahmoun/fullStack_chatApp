import { sequelize } from "../models/index.js";

export const getMessages = async (req, res) => {
    try {
        const messages = await sequelize.models.Message.findAll({
            include: [{ model: sequelize.models.User, as: 'sender' }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json(messages);
    } catch (error) {
        console.error("Error fetching messages:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}