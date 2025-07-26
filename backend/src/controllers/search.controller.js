import { sequelize } from "../models/index.js";
import { Op } from "sequelize";

export const searchUser = async (req, res) => {
  try {
    const { query } = req.query;

    if (!query) {
      return res.status(400).json({ error: 'Search query is required' });
    }

    const users = await sequelize.models.User.findAll({
      where: {
        username: {
          [Op.iLike]: `%${query}%`,
        },
      },
      attributes: ['id', 'username', 'email'],
      order: [['createdAt', 'DESC']],
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
