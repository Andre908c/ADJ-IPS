const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // 1. Buscar al usuario en la base de datos PostgreSQL
        const userQuery = await pool.query('SELECT * FROM usuarios WHERE username = $1', [username]);
        
        if (userQuery.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas (usuario no encontrado)' });
        }

        const user = userQuery.rows[0];

        // 2. Comparar la contraseña ingresada con la encriptada en la BD
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Credenciales inválidas (contraseña incorrecta)' });
        }

        // 3. Generar el Token JWT usando la clave del .env
        const token = jwt.sign(
            { id: user.id, username: user.username, rol: user.rol },
            process.env.JWT_SECRET,
            { expiresIn: '2h' } // El token expira en 2 horas
        );

        // 4. Responder con éxito enviando el token y los datos del usuario
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
        res.status(500).json({ error: 'Error interno del servidor' });
    }
};

module.exports = {
    login
};