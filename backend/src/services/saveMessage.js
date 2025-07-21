import sequelize from "../config/db.js";

export const saveMessage = async ({ senderId, conversationId, content }) => {
  try {
    const newMessage = await sequelize.models.Message.create({
      senderId,
      conversationId,
      content,
    });
    return newMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
};
