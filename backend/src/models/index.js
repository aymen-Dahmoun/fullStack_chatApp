import sequelize from '../config/db.js';
import User from './user.js';
import Message from './message.js';

User.hasMany(Message, { foreignKey: 'senderId', as: 'sentMessages' });
Message.belongsTo(User, { foreignKey: 'senderId', as: 'sender' });

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
