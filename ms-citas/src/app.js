const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());

// Importar y usar las rutas de citas
const citasRoutes = require('./routes/citas.routes.js');
app.use('/api', citasRoutes);

// Ruta de prueba básica para verificar funcionamiento
app.get('/', (req, res) => {
    res.json({ message: 'Microservicio Citas y Agendas funcionando correctamente' });
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Microservicio Citas y Agendas corriendo en el puerto ${PORT}`);
});