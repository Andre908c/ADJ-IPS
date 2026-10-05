const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ error: 'Token no proporcionado' });
  }

  try {
    // Aquí validas tu token
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'tu_secreto');
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Token inválido o expirado' });
  }
};

// Asegúrate de que se exporte como un objeto con esta llave:
module.exports = { verifyToken };