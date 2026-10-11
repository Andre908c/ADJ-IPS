const pharmacyRepository = require('../repositories/pharmacyRepository');

class PharmacyService {
  async listInventory() {
    return await pharmacyRepository.getAllMedicines();
  }

  async getMedicine(id) {
    const medicine = await pharmacyRepository.getMedicineById(id);
    if (!medicine) {
      throw new Error('Medicamento no encontrado');
    }
    return medicine;
  }

  async registerMedicine(data) {
    if (!data.name || data.stock === undefined || data.unit_price === undefined) {
      throw new Error('Nombre, stock y precio unitario son campos obligatorios');
    }
    return await pharmacyRepository.createMedicine(data);
  }

  async updateStock(id, amount) {
    if (amount === undefined || isNaN(amount)) {
      throw new Error('La cantidad a actualizar debe ser un número válido');
    }
    const updated = await pharmacyRepository.updateStock(id, amount);
    if (!updated) {
      throw new Error('Medicamento no encontrado');
    }
    return updated;
  }
}

module.exports = new PharmacyService();
