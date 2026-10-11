CREATE TABLE IF NOT EXISTS medicines (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    stock INT NOT NULL DEFAULT 0,
    unit_price NUMERIC(10, 2) NOT NULL,
    category VARCHAR(50),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Datos de prueba iniciales
INSERT INTO medicines (name, description, stock, unit_price, category) VALUES
('Acetaminofén 500mg', 'Analgésico y antipirético', 100, 1500.00, 'Analgésicos'),
('Ibuprofeno 400mg', 'Antiinflamatorio no esteroideo', 50, 2200.00, 'Antiinflamatorios'),
('Amoxicilina 500mg', 'Antibiótico de amplio espectro', 30, 4500.00, 'Antibióticos');