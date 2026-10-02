const { Pool } = require('pg');

// Configuración del Pool de conexiones para PostgreSQL
const pool = new Pool({
  host: process.env.DB_HOST || 'database',
  user: process.env.DB_USER || 'dev-admin',
  password: process.env.DB_PASSWORD || 'dev-123',
  database: process.env.DB_NAME || 'medimicro_db',
  port: process.env.DB_PORT || 5432,
  max: 20, // Conexiones concurrentes máximas
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

pool.on('connect', () => {
  console.log('Conectado exitosamente a la base de datos PostgreSQL');
});

pool.on('error', (err) => {
  console.error('Error inesperado en el cliente de la base de datos', err);
  process.exit(-1);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  pool
};