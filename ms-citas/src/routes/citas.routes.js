const { Router } = require('express');
const citasController = require('../controllers/citas.controller');

const router = Router();


router.get('/agendas', citasController.getAgendasDisponibles);


router.post('/', citasController.postAgendarCita);

module.exports = router;