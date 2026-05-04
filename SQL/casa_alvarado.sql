-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS = @@UNIQUE_CHECKS;
SET UNIQUE_CHECKS = 0;

SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

SET @OLD_SQL_MODE = @@SQL_MODE;
SET SQL_MODE = 'ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema Casa_Alvarado
-- -----------------------------------------------------

CREATE SCHEMA IF NOT EXISTS `Casa_Alvarado`
DEFAULT CHARACTER SET utf8mb4;

USE `Casa_Alvarado`;

-- -----------------------------------------------------
-- Table Categoria
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Categoria` (
    `id_Categoria` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id_Categoria`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Marca
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Marca` (
    `id_Marca` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    `imagen` TEXT NULL,
    PRIMARY KEY (`id_Marca`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Sub_categoria
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Sub_categoria` (
    `id_Sub_categoria` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id_Sub_categoria`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Tipo
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Tipo` (
    `id_Tipo` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id_Tipo`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Gamma
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Gamma` (
    `id_Gamma` INT NOT NULL AUTO_INCREMENT,
    `nombre` VARCHAR(45) NOT NULL,
    PRIMARY KEY (`id_Gamma`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Calificacion
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Calificacion` (
    `id_Calificacion` INT NOT NULL AUTO_INCREMENT,
    `estrellas` INT NULL,
    `fecha` DATE NULL,
    PRIMARY KEY (`id_Calificacion`)
) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Table Producto
-- -----------------------------------------------------

CREATE TABLE IF NOT EXISTS `Producto` (
    `modelo` VARCHAR(45) NOT NULL,
    `imagen` TEXT NOT NULL,
    `descripcion` TEXT NOT NULL,

    `id_categoria` INT NOT NULL,
    `id_marca` INT NOT NULL,
    `id_sub_categoria` INT NOT NULL,
    `id_tipo` INT NOT NULL,
    `id_gamma` INT NOT NULL,
    `id_calificacion` INT NOT NULL,

    PRIMARY KEY (`modelo`),

    INDEX `fk_categoria_idx` (`id_categoria`),
    INDEX `fk_marca_idx` (`id_marca`),
    INDEX `fk_sub_categoria_idx` (`id_sub_categoria`),
    INDEX `fk_tipo_idx` (`id_tipo`),
    INDEX `fk_gamma_idx` (`id_gamma`),
    INDEX `fk_calificacion_idx` (`id_calificacion`),

    CONSTRAINT `fk_categoria`
        FOREIGN KEY (`id_categoria`)
        REFERENCES `Categoria` (`id_Categoria`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_marca`
        FOREIGN KEY (`id_marca`)
        REFERENCES `Marca` (`id_Marca`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_sub_categoria`
        FOREIGN KEY (`id_sub_categoria`)
        REFERENCES `Sub_categoria` (`id_Sub_categoria`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_tipo`
        FOREIGN KEY (`id_tipo`)
        REFERENCES `Tipo` (`id_Tipo`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_gamma`
        FOREIGN KEY (`id_gamma`)
        REFERENCES `Gamma` (`id_Gamma`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION,

    CONSTRAINT `fk_calificacion`
        FOREIGN KEY (`id_calificacion`)
        REFERENCES `Calificacion` (`id_Calificacion`)
        ON DELETE NO ACTION
        ON UPDATE NO ACTION

) ENGINE = InnoDB;

-- -----------------------------------------------------
-- Restaurar configuraciones
-- -----------------------------------------------------

SET SQL_MODE = @OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS = @OLD_UNIQUE_CHECKS;