const db = require('../../db');

class PharmacyRepository {
  async getAllMedicines() {
    const { rows } = await db.query('SELECT * FROM medicines ORDER BY id ASC');
    return rows;
  }

  async getMedicineById(id) {
    const { rows } = await db.query('SELECT * FROM medicines WHERE id = $1', [id]);
    return rows[0];
  }

  async createMedicine({ name, description, stock, unit_price, category }) {
    const query = `
      INSERT INTO medicines (name, description, stock, unit_price, category)
      VALUES ($1, $2, $3, $4, $5) RETURNING *;
    `;
    const values = [name, description, stock, unit_price, category];
    const { rows } = await db.query(query, values);
    return rows[0];
  }

  async updateStock(id, quantity) {
    const query = `
      UPDATE medicines
      SET stock = stock + $1
      WHERE id = $2 RETURNING *;
    `;
    const { rows } = await db.query(query, [quantity, id]);
    return rows[0];
  }
}

module.exports = new PharmacyRepository();