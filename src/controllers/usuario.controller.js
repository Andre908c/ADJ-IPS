const usuarioService = require('../services/usuario.service');

class UsuarioController {
    async getUsuarios(req, res) {
        try {
            const usuarios = await usuarioService.listarUsuarios();
            res.json(usuarios);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async registrar(req, res) {
        try {
            const nuevoUsuario = await usuarioService.registrarUsuario(req.body);
            res.status(201).json({ mensaje: "Usuario registrado con éxito", usuario: nuevoUsuario });
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async login(req, res) {
        try {
            const { email, password } = req.body;
            const resultado = await usuarioService.autenticar(email, password);
            res.json({ mensaje: "Autenticación exitosa", ...resultado });
        } catch (error) {
            res.status(401).json({ error: error.message });
        }
    }
}

module.exports = new UsuarioController();