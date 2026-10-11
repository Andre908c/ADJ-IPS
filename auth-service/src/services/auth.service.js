const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const authRepository = require('../repositories/auth.repository');

class AuthService {
  async register(email, password) {
    const existingUser = await authRepository.getUserByEmail(email);
    if (existingUser) {
      throw new Error('El usuario ya existe');
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await authRepository.createUser(email, hashedPassword);
    return newUser;
  }

  async login(email, password) {
    const user = await authRepository.getUserByEmail(email);
    if (!user) {
      throw new Error('Credenciales inválidas');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Credenciales inválidas');
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '1h' }
    );

    return { token, user: { id: user.id, email: user.email } };
  }
}

module.exports = new AuthService();