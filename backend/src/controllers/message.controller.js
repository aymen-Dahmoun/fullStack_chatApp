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
          ]
        }
      ],
      order: [['updatedAt', 'DESC']],
    });

    // Optionally sort messages manually if needed
    const sorted = conversations.map(convo => ({
      ...convo.toJSON(),
      messages: convo.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    }));

    res.status(200).json(sorted);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
