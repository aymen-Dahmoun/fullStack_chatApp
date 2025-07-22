import sequelize from '../config/db.js';
import User from './user.js';
import Message from './message.js';
import Conversation from './conversation.js';

User.hasMany(Conversation, { foreignKey: 'userId', as: 'conversations' });
Conversation.belongsTo(User, { foreignKey: 'userId', as: 'user' });
Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });
User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Conversation.belongsTo(User, { foreignKey: 'messengerId', as: 'messenger' });
User.hasMany(Conversation, { foreignKey: 'messengerId', as: 'messengerConversations' });



const syncDatabase = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected.');
    await sequelize.sync({ alter: true });
    console.log('All models synced.');
  } catch (err) {
    console.error('Error syncing DB:', err);
  }
};

export { sequelize, syncDatabase, User, Message };
