CREATE DATABASE IF NOT EXISTS Casa_Alvarado;
USE Casa_Alvarado;

-- =========================
-- Tabla Categoria
-- =========================
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================
-- Tabla Marca
-- =========================
CREATE TABLE Marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================
-- Tabla Producto
-- =========================
CREATE TABLE Producto (
    id_producto INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    descripcion TEXT NOT NULL,
    imagen TEXT,
    modelo VARCHAR(100),
    tipo VARCHAR(45),
    id_categoria INT NOT NULL,
    id_marca INT NOT NULL,

    CONSTRAINT fk_producto_categoria
        FOREIGN KEY (id_categoria)
        REFERENCES Categoria(id_categoria)
        ON DELETE RESTRICT
        ON UPDATE CASCADE,

    CONSTRAINT fk_producto_marca
        FOREIGN KEY (id_marca)
        REFERENCES Marca(id_marca)
        ON DELETE RESTRICT
        ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================
-- Tabla Calificacion
-- =========================
CREATE TABLE Calificacion (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,
    estrellas INT NOT NULL,
    fecha DATE,
    id_producto INT NOT NULL,

    CONSTRAINT fk_calificacion_producto
        FOREIGN KEY (id_producto)
        REFERENCES Producto(id_producto)
        ON DELETE CASCADE
        ON UPDATE CASCADE,

    CHECK (estrellas BETWEEN 1 AND 5)
) ENGINE=InnoDB;