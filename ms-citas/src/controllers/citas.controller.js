const citaService = require('../services/citas.services');

class CitaController {
    async getAgendas(req, res) {
        try {
            const agendas = await citaService.listarAgendas();
            res.status(200).json(agendas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message || String(error) });
        }
    }

    async postCita(req, res) {
        try {
            const nuevaCita = await citaService.agendarCita({
                agenda_id: req.body.agenda_id,
                paciente_id: req.user.id
            });
            res.status(201).json(nuevaCita);
        } catch (error) {
            res.status(400).json({ error: error.message });
        }
    }

    async getMisCitas(req, res) {
        try {
            const citas = await citaService.listarCitasDePaciente(req.user.id);
            res.status(200).json(citas);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: error.message || String(error) });
        }
    }
}

module.exports = new CitaController();
