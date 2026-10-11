const express = require('express');
const cors = require('cors');
require('dotenv').config();

<<<<<<< HEAD
const authRoutes = require('./routes/authRoutes');
=======
const authRoutes = require('./routes/auth.routes');
>>>>>>> main

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

<<<<<<< HEAD
app.use('/api/auth', authRoutes);
=======
app.get('/', (req, res) => {
  res.json({ message: 'Auth Service API running successfully' });
});
>>>>>>> main

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Auth Service running' });
});

<<<<<<< HEAD
app.use((req, res) => {
  res.status(404).json({ error: 'Ruta no encontrada' });
});

app.use((err, req, res, next) => {
  console.error('Unhandled Error in Auth Service:', err);
  res.status(500).json({ error: 'Error interno del servidor' });
});

app.listen(PORT, () => {
  console.log(`Auth Service escuchando en el puerto ${PORT}`);
});

module.exports = app;
=======
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
});
>>>>>>> main
