const db = require('../config/db');

class CitaRepository {
    async obtenerAgendasDisponibles() {
        const [rows] = await db.query("SELECT * FROM agendas WHERE estado = 'DISPONIBLE'");
        return rows;
    }

    async crearCita(agenda_id, paciente_id) {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();

            const [result] = await connection.query(
                'INSERT INTO citas (agenda_id, paciente_id) VALUES (?, ?)',
                [agenda_id, paciente_id]
            );

            await connection.query(
                "UPDATE agendas SET estado = 'OCUPADA' WHERE id = ?",
                [agenda_id]
            );

            await connection.commit();
            connection.release();
            return { id: result.insertId, agenda_id, paciente_id, estado: 'CONFIRMADA' };
        } catch (error) {
            await connection.rollback();
            connection.release();
            throw error;
        }
    }
}

module.exports = new CitaRepository();