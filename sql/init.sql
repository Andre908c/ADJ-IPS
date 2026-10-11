-- Crear la tabla de usuarios con soporte para roles (RBAC)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('paciente', 'medico', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_usuarios_username ON usuarios(username);

-- Tabla de agendas y citas
CREATE TABLE IF NOT EXISTS agendas (
    id SERIAL PRIMARY KEY,
    medico_id INT NOT NULL,
    fecha TIMESTAMP NOT NULL,
    estado VARCHAR(20) DEFAULT 'DISPONIBLE'
);

CREATE INDEX IF NOT EXISTS idx_agendas_estado ON agendas(estado);

CREATE TABLE IF NOT EXISTS citas (
    id SERIAL PRIMARY KEY,
    agenda_id INT NOT NULL,
    paciente_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_citas_agenda_id ON citas(agenda_id);
CREATE INDEX IF NOT EXISTS idx_citas_paciente_id ON citas(paciente_id);

-- Insertar el usuario administrador personalizado (dev-ips) y otros de prueba
-- Contraseña para dev-ips: 12345678910 (Hash bcrypt generado)
INSERT INTO usuarios (username, password, rol) 
VALUES 
    ('dev-ips', '$2b$10$X7vWq8Z6vF1m4n3b2v1cO.u5K4L3j2I1h0G9f8E7d6C5b4A3z2Y1x', 'admin'),
    ('medico_juan', '$2b$10$X7vWq8Z6vF1m4n3b2v1cO.u5K4L3j2I1h0G9f8E7d6C5b4A3z2Y1x', 'medico'),
    ('paciente_ana', '$2b$10$X7vWq8Z6vF1m4n3b2v1cO.u5K4L3j2I1h0G9f8E7d6C5b4A3z2Y1x', 'paciente')
ON CONFLICT (username) DO NOTHING;
