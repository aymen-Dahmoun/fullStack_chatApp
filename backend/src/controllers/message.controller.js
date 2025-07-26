import Conversation from "../models/conversation.js";
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
        },
        {
          model: sequelize.models.User,
          as: 'messenger',
          attributes: ['id', 'username', 'email']
        }
      ],
      order: [['updatedAt', 'DESC']]
    });

    const uniquePairs = new Set();
    const deduped = [];

    for (const convo of conversations) {
      const id1 = convo.userId;
      const id2 = convo.messengerId;
      const pairKey = [id1, id2].sort().join('-');

      if (!uniquePairs.has(pairKey)) {
        uniquePairs.add(pairKey);

        const sortedMessages = convo.messages.sort((a, b) =>
          new Date(b.createdAt) - new Date(a.createdAt)
        );
        const lastMessage = sortedMessages[0];

        deduped.push({
          conversationId: convo.id,
          updatedAt: convo.updatedAt,
          lastMessage: lastMessage ? {
            content: lastMessage.content,
            createdAt: lastMessage.createdAt,
            sender: lastMessage.sender
          } : null,
          messenger: convo.messenger
        });
      }
    }

    res.status(200).json(deduped);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createConversation = async (req, res) => {
  try {
    const { userId, messengerId } = req.body;

    if (!userId || !messengerId) {
      return res.status(400).json({ error: 'userId and messengerId are required' });
    }

    const existingConversation = await Conversation.findOne({
      where: {
        userId,
        messengerId,
      },
    });

    if (existingConversation) {
      return res.status(200).json({
        message: 'Conversation already exists',
        conversation: existingConversation,
      });
    }

    const conversation = await Conversation.create({
      userId,
      messengerId,
    });

    return res.status(201).json({
      message: 'Conversation created successfully',
      conversation,
    });
  } catch (error) {
    console.error('Error creating conversation:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
