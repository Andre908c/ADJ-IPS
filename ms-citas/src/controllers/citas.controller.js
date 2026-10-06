const citaService = require('../services/citas.services');

class CitasController {
    // Obtener agendas disponibles
    async getAgendasDisponibles(req, res) {
        try {
            const agendas = await citaService.listarAgendas();
            return res.status(200).json({
                success: true,
                data: agendas
            });
       } catch (error) {
    return res.status(500).json({
        success: false,
        message: 'Error al obtener las agendas disponibles',
        error: String(error)
    });
}
    }

    // Crear / Agendar una cita
    async postAgendarCita(req, res) {
        try {
            const nuevaCita = await citaService.agendarCita(req.body);
            return res.status(201).json({
                success: true,
                message: 'Cita agendada con éxito',
                data: nuevaCita
            });
        } catch (error) {
            return res.status(400).json({
                success: false,
                message: error.message || 'Error al agendar la cita'
            });
        }
    }
}

module.exports = new CitasController();