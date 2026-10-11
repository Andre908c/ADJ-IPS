const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../../db');

const register = async (req, res) => {
  const { username, password, rol = 'paciente' } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username y password son obligatorios' });
  }

  try {
    const exists = await db.query(
      'SELECT id FROM usuarios WHERE username = $1',
      [username]
    );

    if (exists.rows.length > 0) {
      return res.status(409).json({ error: 'El usuario ya existe' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await db.query(
      `INSERT INTO usuarios (username, password, rol)
       VALUES ($1, $2, $3)
       RETURNING id, username, rol`,
      [username, hashedPassword, rol]
    );

    res.status(201).json({
      message: 'Usuario registrado exitosamente',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Error en el registro:', error);
    res.status(500).json({ error: 'Error interno del servidor', detail: error.message });
  }
};

const login = async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ error: 'Username y password son obligatorios' });
  }

  try {
    const userQuery = await db.query(
      'SELECT * FROM usuarios WHERE username = $1',
      [username]
    );

    if (userQuery.rows.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const user = userQuery.rows[0];
    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = jwt.sign(
      { id: user.id, username: user.username, rol: user.rol },
      process.env.JWT_SECRET || 'secreto_super_seguro',
      { expiresIn: '2h' }
    );

    res.status(200).json({
      message: 'Autenticación exitosa',
      token,
      user: {
        id: user.id,
        username: user.username,
        rol: user.rol
      }
    });
  } catch (error) {
    console.error('Error en el login:', error);
    res.status(500).json({ error: 'Error interno del servidor', detail: error.message });
  }
};

module.exports = { register, login };
