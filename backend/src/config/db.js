import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
dotenv.config();
console.log('db name: ',process.env.DB_NAME)
console.log('db user: ',process.env.DB_USER)
console.log('db pass: ',process.env.DB_PASSWORD)

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: 'localhost',
    port: process.env.DB_PORT || 5432,
    dialect: 'postgres',
    logging: true,
  }
);

export default sequelize;
