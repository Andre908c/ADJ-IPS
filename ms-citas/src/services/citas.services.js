const citaRepository = require('../repositories/cita.repository');

class CitaService {
    async listarAgendas() {
        return await citaRepository.obtenerAgendasDisponibles();
    }

    async agendarCita(data) {
        const { agenda_id, paciente_id } = data;
        if (!agenda_id || !paciente_id) {
            throw new Error('El ID de la agenda y del paciente son obligatorios');
        }
        return await citaRepository.crearCita(agenda_id, paciente_id);
    }
}

module.exports = new CitaService();