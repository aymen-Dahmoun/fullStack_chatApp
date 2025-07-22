import { sequelize } from "../models/index.js";
import { Op } from "sequelize";

export const getConversations = async (req, res) => {
  try {
    const userId = req.params.userId;

    const conversations = await sequelize.models.Conversation.findAll({
      where: {
        [Op.or]: [
          { userId: userId },
          { messengerId: userId }
        ]
      },
      
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

    const formatted = conversations.map(convo => {
      const sortedMessages = convo.messages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      const lastMessage = sortedMessages[0];

      return {
        conversationId: convo.id,
        updatedAt: convo.updatedAt,
        lastMessage: lastMessage ? {
          content: lastMessage.content,
          createdAt: lastMessage.createdAt,
          sender: lastMessage.sender
        } : null,
        messenger: {
          id: convo.messengerId,
        }
      };
    });

    res.status(200).json(formatted);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
