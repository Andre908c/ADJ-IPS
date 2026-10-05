const pharmacyService = require('../services/pharmacyService');

class PharmacyController {
  async getMedicines(req, res) {
    try {
      const medicines = await pharmacyService.listInventory();
      res.json(medicines);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMedicineById(req, res) {
    try {
      const medicine = await pharmacyService.getMedicine(req.params.id);
      res.json(medicine);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createMedicine(req, res) {
    try {
      const newMedicine = await pharmacyService.registerMedicine(req.body);
      res.status(201).json(newMedicine);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { amount } = req.body; // Puede ser positivo (entrada) o negativo (salida/despacho)
      const updated = await pharmacyService.updateStock(id, amount);
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PharmacyController();