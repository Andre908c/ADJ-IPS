const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citas.controller');
const verificarToken = require('../middleware/auth');

router.get('/agendas', verificarToken, (req, res) => citaController.getAgendas(req, res));
router.post('/citas', verificarToken, (req, res) => citaController.postCita(req, res));
router.get('/citas/mias', verificarToken, (req, res) => citaController.getMisCitas(req, res));

module.exports = router;
