-- =========================================
-- Base de datos: ortho_mas
-- =========================================
CREATE DATABASE IF NOT EXISTS ortho_mas;
USE ortho_mas;

-- =========================================
-- Tabla: roles
-- =========================================
CREATE TABLE roles (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(50) NOT NULL UNIQUE,
descripcion VARCHAR(255)
);

INSERT INTO roles (nombre, descripcion) VALUES
('Admin', 'Administrador del sistema'),
('Doctor', 'Doctor de la clínica'),
('Paciente', 'Paciente registrado');

-- =========================================
-- Tabla: usuarios
-- =========================================
CREATE TABLE usuarios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
apellido VARCHAR(100) NOT NULL,
correo VARCHAR(150) NOT NULL UNIQUE,
password VARCHAR(255) NOT NULL,
foto_url VARCHAR(255),
rol_id INT NOT NULL,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (rol_id) REFERENCES roles(id)
);

-- =========================================
-- Tabla: servicios
-- =========================================
CREATE TABLE servicios (
id INT AUTO_INCREMENT PRIMARY KEY,
nombre VARCHAR(100) NOT NULL,
descripcion TEXT,
duracion_min INT DEFAULT 30,
precio DECIMAL(10,2) DEFAULT 0.00,
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- =========================================
-- Tabla: citas
-- =========================================
CREATE TABLE citas (
id INT AUTO_INCREMENT PRIMARY KEY,
paciente_id INT NOT NULL,
doctor_id INT NOT NULL,
servicio_id INT NOT NULL,
fecha DATE NOT NULL,
hora TIME NOT NULL,
estado ENUM('Programada','Completada','Cancelada') DEFAULT 'Programada',
created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
FOREIGN KEY (paciente_id) REFERENCES usuarios(id),
FOREIGN KEY (doctor_id) REFERENCES usuarios(id),
FOREIGN KEY (servicio_id) REFERENCES servicios(id)
);

-- =========================================
-- Tabla: sesiones
-- =========================================
CREATE TABLE sesiones (
id INT AUTO_INCREMENT PRIMARY KEY,
usuario_id INT NOT NULL,
token VARCHAR(255),
fecha_inicio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
fecha_fin TIMESTAMP NULL,
activa BOOLEAN DEFAULT TRUE,
FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);

-- =========================================
-- Tabla: reportes_citas
-- =========================================
CREATE TABLE reportes_citas (
id INT AUTO_INCREMENT PRIMARY KEY,
fecha DATE NOT NULL,
citas_totales INT DEFAULT 0,
citas_completadas INT DEFAULT 0,
citas_canceladas INT DEFAULT 0,
ingresos DECIMAL(10,2) DEFAULT 0.00
);

-- =========================================
-- Datos de ejemplo
-- =========================================
INSERT INTO usuarios (nombre, apellido, correo, password, rol_id)
VALUES
('Admin', 'Principal', 'admin@ortho.com', 'admin123', 1),
('Carlos', 'Ruiz', 'c.ruiz@ortho.com', 'doctor123', 2),
('Laura', 'Mendez', 'l.mendez@ortho.com', 'doctor123', 2),
('Ana', 'Perez', 'ana.perez@gmail.com', 'paciente123', 3),
('Juan', 'Gomez', 'juan.gomez@gmail.com', 'paciente123', 3);

INSERT INTO servicios (nombre, descripcion, duracion_min, precio)
VALUES
('Limpieza Dental', 'Limpieza completa de dientes', 30, 50.00),
('Ortodoncia', 'Tratamiento de ortodoncia', 60, 200.00),
('Revisión General', 'Chequeo general de la boca', 30, 40.00),
('Blanqueamiento', 'Blanqueamiento dental', 45, 120.00);

INSERT INTO citas (paciente_id, doctor_id, servicio_id, fecha, hora, estado)
VALUES
(4, 2, 1, CURDATE(), '09:00:00', 'Programada'),
(5, 3, 2, CURDATE(), '09:30:00', 'Programada'),
(4, 2, 3, CURDATE(), '10:00:00', 'Programada'),
(5, 2, 4, CURDATE(), '11:00:00', 'Programada');