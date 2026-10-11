// src/routes/pharmacyRoutes.js
const express = require('express');
const router = express.Router();
const pharmacyController = require('../controllers/pharmacyController');
// Importar middleware de validación de token JWT
const { verifyToken } = require('../middlewares/authMiddleware');

router.get('/', verifyToken, pharmacyController.getMedicines);
router.get('/:id', verifyToken, pharmacyController.getMedicineById);
router.post('/', verifyToken, pharmacyController.createMedicine);
router.patch('/:id/stock', verifyToken, pharmacyController.updateStock);

module.exports = router;