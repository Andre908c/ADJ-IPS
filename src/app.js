const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// 1. Redirigir peticiones al Microservicio de Usuarios (Puerto 3001)
app.use('/api/users', async (req, res) => {
    try {
        const url = `http://localhost:3001/api${req.url}`;
        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            headers: { authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Error en MS-Usuarios" });
    }
});

// 2. Redirigir peticiones al Microservicio de Productos (Puerto 3002)
app.use('/api/products', async (req, res) => {
    try {
        const url = `http://localhost:3002/api${req.url}`;
        const response = await axios({
            method: req.method,
            url: url,
            data: req.body,
            headers: { authorization: req.headers.authorization }
        });
        res.status(response.status).json(response.data);
    } catch (error) {
        res.status(error.response?.status || 500).json(error.response?.data || { error: "Error en MS-Productos" });
    }
});

app.listen(PORT, () => {
    console.log(`API Gateway corriendo en el puerto ${PORT}`);
});