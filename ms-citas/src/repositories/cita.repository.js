const db = require('../db');

class CitaRepository {
    async obtenerAgendasDisponibles() {
        const result = await db.query("SELECT * FROM agendas WHERE estado = 'DISPONIBLE'");
        return result.rows;
    }

    async crearCita(agenda_id, paciente_id) {
        const client = await db.connect();
        try {
            await client.query('BEGIN');

            // Bloquea la agenda y verifica que siga disponible
            const agenda = await client.query(
                "SELECT id FROM agendas WHERE id = $1 AND estado = 'DISPONIBLE' FOR UPDATE",
                [agenda_id]
            );
            if (agenda.rowCount === 0) {
                throw new Error('La agenda no existe o ya no está disponible');
            }

            const result = await client.query(
                'INSERT INTO citas (agenda_id, paciente_id) VALUES ($1, $2) RETURNING id',
                [agenda_id, paciente_id]
            );

            await client.query("UPDATE agendas SET estado = 'OCUPADO' WHERE id = $1", [agenda_id]);

<<<<<<< HEAD
            await connection.commit();
            return { id: result.insertId, agenda_id, paciente_id, estado: 'CONFIRMADA' };
        } catch (error) {
            await connection.rollback();
            throw error;
        } finally {
            connection.release();
=======
            await client.query('COMMIT');
            return { id: result.rows[0].id, agenda_id, paciente_id, estado: 'CONFIRMADA' };
        } catch (error) {
            await client.query('ROLLBACK');
            throw error;
        } finally {
            client.release();
>>>>>>> main
        }
    }

    async obtenerCitasDePaciente(paciente_id) {
        const result = await db.query(
            `SELECT c.id, c.estado, a.fecha_hora
             FROM citas c JOIN agendas a ON a.id = c.agenda_id
             WHERE c.paciente_id = $1
             ORDER BY a.fecha_hora`,
            [paciente_id]
        );
        return result.rows;
    }
}

module.exports = new CitaRepository();
