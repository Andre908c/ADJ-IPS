const usuarioRepository = require('../repositories/usuario.repository');
const jwt = require('jsonwebtoken');

// Clave secreta para firmar el token (cámbiala o úsala desde .env)
const JWT_SECRET = process.env.JWT_SECRET || 'secreto_super_seguro';

class UsuarioService {
    async listarUsuarios() {
        return await usuarioRepository.findAll();
    }

    async registrarUsuario(data) {
        // Aquí podrías agregar encriptación con bcrypt si lo deseas
        const usuarioExistente = await usuarioRepository.findByEmail(data.email);
        if (usuarioExistente) {
            throw new Error("El correo ya está registrado");
        }
        return await usuarioRepository.save(data);
    }

    async autenticar(email, password) {
        const usuario = await usuarioRepository.findByEmail(email);
        if (!usuario || usuario.password !== password) {
            throw new Error("Credenciales inválidas");
        }

        // Generar el token JWT que pide la rúbrica del taller
        const token = jwt.sign(
            { id: usuario.id, email: usuario.email, rol: usuario.rol },
            JWT_SECRET,
            { expiresIn: '1h' }
        );

        return { token, usuario: { id: usuario.id, nombre: usuario.nombre, rol: usuario.rol } };
    }
}

module.exports = new UsuarioService();