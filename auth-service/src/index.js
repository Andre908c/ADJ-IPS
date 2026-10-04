const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors()); // <--- Esto permite que el frontend se comunique con el backend sin bloqueos
app.use(express.json());
<script src="app.js"></script>