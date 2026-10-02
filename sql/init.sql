CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) NOT NULL CHECK (rol IN ('paciente', 'medico', 'admin')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Usuario paciente de prueba
INSERT INTO usuarios (username, password, rol) 
VALUES ('paciente1', 'dev-123', 'paciente')
ON CONFLICT (username) DO NOTHING;

-- Usuario médico de prueba
INSERT INTO usuarios (username, password, rol) 
VALUES ('admin', 'dev-123', 'medico')
ON CONFLICT (username) DO NOTHING;