const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Al estar afuera, debes importar desde './src/routes/...'
const pharmacyRoutes = require('./src/routes/pharmacyRoutes');

const app = express();
const PORT = process.env.PORT || 3002;

app.use(cors());
app.use(express.json());

app.use('/api/pharmacy', pharmacyRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Pharmacy Service running' });
});

app.listen(PORT, () => {
  console.log(`Pharmacy service listening on port ${PORT}`);
});