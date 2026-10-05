const express = require('express');
const router = express.Router();
const db = require('../db'); // Asegúrate de importar tu conexión

// Ruta de Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    
    try {
        // Consultar el usuario en la base de datos
        const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (result.rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = result.rows[0];

        // Aquí validarías la contraseña (ej. usando bcrypt o comparación directa si estás probando)
        if (password !== user.password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        res.json({ message: '¡Inicio de sesión exitoso!', userId: user.id });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
});

module.exports = router;