import sequelize from "../config/db.js";

export const saveMessage = async (senderId, message) => {
  try {
    const newMessage = await sequelize.models.Message.create({
      senderId,
      content: message,
    });
    return newMessage;
  } catch (error) {
    console.error("Error saving message:", error);
    throw error;
  }
}