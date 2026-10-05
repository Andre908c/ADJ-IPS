const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');

router.get('/', pharmacyController.getMedicines);
router.get('/:id', pharmacyController.getMedicineById);
router.post('/', pharmacyController.createMedicine);
router.patch('/:id/stock', pharmacyController.updateStock);

module.exports = router;