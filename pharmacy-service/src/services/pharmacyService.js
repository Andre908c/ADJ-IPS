const pharmacyService = require('../services/pharmacyService');

class PharmacyController {
  async getMedicines(req, res) {
    try {
      const medicines = await pharmacyService.getAllMedications();
      res.json(medicines);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  async getMedicineById(req, res) {
    try {
      const medicine = await pharmacyService.getMedicationById(req.params.id);
      if (!medicine) {
        return res.status(404).json({ error: 'Medicamento no encontrado' });
      }
      res.json(medicine);
    } catch (error) {
      res.status(404).json({ error: error.message });
    }
  }

  async createMedicine(req, res) {
    try {
      const newMedicine = await pharmacyService.createMedication(req.body);
      res.status(201).json(newMedicine);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }

  async updateStock(req, res) {
    try {
      const { id } = req.params;
      const { stock } = req.body;
      const updated = await pharmacyService.updateStock(id, stock);
      if (!updated) {
        return res.status(404).json({ error: 'Medicamento no encontrado' });
      }
      res.json(updated);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  }
}

module.exports = new PharmacyController();