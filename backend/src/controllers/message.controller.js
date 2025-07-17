import { sequelize } from "../models/index.js";

export const getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversations = await sequelize.models.Conversation.findAll({
      where: { userId },
      include: [
        {
          model: sequelize.models.Message,
          as: 'messages',
          include: [
            {
              model: sequelize.models.User,
              as: 'sender',
              attributes: ['id', 'username', 'email']
            }
          ],
          order: [['createdAt', 'DESC']],
        }
      ],
      order: [['updatedAt', 'DESC']],
    });

    res.status(200).json(conversations);
  } catch (error) {
    console.error("Error fetching messages:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
