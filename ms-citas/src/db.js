const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'postgres',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'medimicro_auth',
  port: process.env.DB_PORT || 5432,
});

pool.on('connect', () => {
  console.log('¡Conectado a la base de datos PostgreSQL exitosamente!');
});

module.exports = pool;