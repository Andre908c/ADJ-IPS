const { Router } = require('express');
const usuarioController = require('../controllers/usuario.controller');

const router = Router();

router.get('/users', (req, res) => usuarioController.getUsuarios(req, res));
router.post('/register', (req, res) => usuarioController.registrar(req, res));
router.post('/login', (req, res) => usuarioController.login(req, res));

module.exports = router;