const db = require('../config/db'); // Sube un nivel para entrar a config/db.js
const bcrypt = require('bcrypt'); // Opcional para encriptar contraseñas
const jwt = require('jsonwebtoken');

// Controlador para el Login
async function login(req, res) {
    const { username, password } = req.body;

    try {
        // Consultamos el usuario en la base de datos PostgreSQL
        const queryText = 'SELECT * FROM usuarios WHERE username = $1';
        const result = await db.query(queryText, [username]);

        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        const user = result.rows[0];

        // Validar contraseña (aquí puedes comparar con bcrypt si ya lo tienes implementado)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Usuario o contraseña incorrectos' });
        }

        // Generar Token JWT
        const token = jwt.sign(
            { id: user.id, username: user.username, rol: user.rol }, 
            process.env.JWT_SECRET || 'secreto_dev', 
            { expiresIn: '1h' }
        );

        res.json({
            message: '¡Login exitoso!',
            token: token,
            rol: user.rol // Útil para que el frontend sepa si redirige a paciente o médico
        });

    } catch (error) {
        console.error('Error en el controlador de login:', error);
        res.status(500).json({ error: 'Error interno del servidor' });
    }
}

module.exports = {
    login
};