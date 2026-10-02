const UsuarioModel = require('../models/usuario.model');

// Simulación de base de datos en memoria (puedes reemplazarlo por tu BD real)
let usuariosDB = [
    new UsuarioModel(1, "Juan Perez", "juan@mail.com", "123456", "admin")
];

class UsuarioRepository {
    async findAll() {
        return usuariosDB;
    }

    async findByEmail(email) {
        return usuariosDB.find(u => u.email === email);
    }

    async save(usuarioData) {
        const nuevoUsuario = new UsuarioModel(
            usuariosDB.length + 1,
            usuarioData.nombre,
            usuarioData.email,
            usuarioData.password,
            usuarioData.rol || 'cliente'
        );
        usuariosDB.push(nuevoUsuario);
        return nuevoUsuario;
    }
}

module.exports = new UsuarioRepository();