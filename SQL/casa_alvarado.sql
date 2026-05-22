-- =========================================
-- ELIMINAR BASE DE DATOS SI EXISTE
-- =========================================
DROP DATABASE IF EXISTS Casa_Alvarado;

-- =========================================
-- CREAR BASE DE DATOS
-- =========================================
CREATE DATABASE Casa_Alvarado
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

USE Casa_Alvarado;

-- =========================================
-- TABLA FAMILIA
-- =========================================
CREATE TABLE Familia (
    id_familia INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA CATEGORIA
-- =========================================
CREATE TABLE Categoria (
    id_categoria INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    id_familia INT NOT NULL,

    CONSTRAINT fk_categoria_familia
    FOREIGN KEY (id_familia)
    REFERENCES Familia(id_familia)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- TABLA MARCA
-- =========================================
CREATE TABLE Marca (
    id_marca INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    imagen TEXT NOT NULL,
    prioridad ENUM('1','2','3') NOT NULL DEFAULT '3',
    id_categoria INT NOT NULL,

    CONSTRAINT fk_marca_categoria
    FOREIGN KEY (id_categoria)
    REFERENCES Categoria(id_categoria)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- TABLA GAMMA
-- =========================================
CREATE TABLE Gamma (
    id_gamma INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA TIPO
-- =========================================
CREATE TABLE Tipo (
    id_tipo INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL
) ENGINE=InnoDB;

-- =========================================
-- TABLA PRODUCTO
-- =========================================
CREATE TABLE Producto (
    modelo VARCHAR(45) PRIMARY KEY,
    imagen TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    novedad ENUM('Si','No') NOT NULL DEFAULT 'No',

    id_marca INT NOT NULL,
    id_gamma INT NOT NULL,
    id_tipo INT NOT NULL,

    CONSTRAINT fk_producto_marca
    FOREIGN KEY (id_marca)
    REFERENCES Marca(id_marca)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_producto_gamma
    FOREIGN KEY (id_gamma)
    REFERENCES Gamma(id_gamma)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_producto_tipo
    FOREIGN KEY (id_tipo)
    REFERENCES Tipo(id_tipo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;

-- =========================================
-- TABLA USUARIO
-- =========================================
CREATE TABLE Usuario (
    correo VARCHAR(100) PRIMARY KEY,
    nombre VARCHAR(45) NOT NULL,
    apellido VARCHAR(45) NOT NULL,
    contrasena TEXT NOT NULL,
    telefono VARCHAR(10) NOT NULL,
    rol ENUM('Admin', 'Usuario') NOT NULL DEFAULT 'Usuario'
) ENGINE=InnoDB;

-- =========================================
-- TABLA CALIFICACION
-- =========================================
CREATE TABLE Calificacion (
    id_calificacion INT AUTO_INCREMENT PRIMARY KEY,

    estrellas INT NOT NULL CHECK(estrellas BETWEEN 1 AND 5),
    fecha DATE NOT NULL,

    modelo VARCHAR(45) NOT NULL,
    correo VARCHAR(100) NOT NULL,

    CONSTRAINT fk_calificacion_producto
    FOREIGN KEY (modelo)
    REFERENCES Producto(modelo)
    ON DELETE CASCADE
    ON UPDATE CASCADE,

    CONSTRAINT fk_calificacion_usuario
    FOREIGN KEY (correo)
    REFERENCES Usuario(correo)
    ON DELETE CASCADE
    ON UPDATE CASCADE
) ENGINE=InnoDB;