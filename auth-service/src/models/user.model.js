const db = require('../db');

class UserModel {
  static async findByEmail(email) {
    const query = 'SELECT * FROM users WHERE email = $1';
    const { rows } = await db.query(query, [email]);
    return rows[0];
  }

  static async createUser(email, passwordHash) {
    const query = 'INSERT INTO users (email, password) VALUES ($1, $2) RETURNING id, email';
    const { rows } = await db.query(query, [email, passwordHash]);
    return rows[0];
  }
}

module.exports = UserModel;