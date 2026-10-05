const express = require('express');
const router = express.Router();
const citaController = require('../controllers/citas.controller');

router.get('/agendas', (req, res) => citaController.getAgendas(req, res));
router.post('/citas', (req, res) => citaController.postCita(req, res));

module.exports = router;

