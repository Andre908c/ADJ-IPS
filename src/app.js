require('dotenv').config(); // <-- ESTO DEBE IR ARRIBA DE TODO EN app.js

const express = require('express');
const cors = require('cors');
const usuarioRoutes = require('./src/routes/usuario.route');

const app = express();
const PORT = process.env.PORT || 3001; // Lee el puerto del .env o usa 3001 por defecto

app.use(cors());
app.use(express.json());

app.use('/api', usuarioRoutes);

app.listen(PORT, () => {
    console.log(`MS-Usuarios corriendo en el puerto ${PORT}`);
});