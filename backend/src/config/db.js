import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: true,
  }
);

export default sequelize;
