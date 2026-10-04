const citaService = require('../services/citas.services');

class CitaController {
    async getAgendas(req, res) {
        try {
            const agendas = await citaService.listarAgendas();
            res.status(200).json(agendas);
        } catch (error) {
            res.status(500).json({ error: error.message });
        }
    }

    async postCita(req, res) {
        try {
            const nuevaCita = await citaService.agendarCita(req.body);
            res.status(201).json(nuevaCita);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }
}

module.exports = new CitaController();