import { DataTypes } from 'sequelize';
import sequelize from '../config/db.js';

const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.UUID,
    defaultValue: DataTypes.UUIDV4,
    primaryKey: true,
  },
  userId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
  messengerId: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
}, {
  tableName: 'conversation',
  timestamps: true,
});

export default Conversation;
