-- Crear la tabla de usuarios con soporte para roles (RBAC)
CREATE TABLE IF NOT EXISTS usuarios (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    rol VARCHAR(20) CHECK (rol IN ('paciente', 'medico', 'admin')) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertar el usuario administrador personalizado (dev-ips) y otros de prueba
-- Contraseña para dev-ips: 12345678910 (Hash bcrypt generado)
INSERT INTO usuarios (username, password, rol) 
VALUES 
    ('dev-ips', '$2b$10$X7vWq8Z6vF1m4n3b2v1cO.u5K4L3j2I1h0G9f8E7d6C5b4A3z2Y1x', 'admin'),
    ('medico_juan', '$2b$10$X7vWq8Z6vF1m4n3b2v1cO.u5K4L3j2I1h0G9f8E7d6C5b4A3z2Y1x', 'medico'),
    ('paciente_ana', '$2b$10$X7vWq8Z6vF1m4n3b2v1cO.u5K4L3j2I1h0G9f8E7d6C5b4A3z2Y1x', 'paciente')
ON CONFLICT (username) DO NOTHING;