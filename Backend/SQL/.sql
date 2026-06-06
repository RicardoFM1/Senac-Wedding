-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema db_casamento
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema db_casamento
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `db_casamento` DEFAULT CHARACTER SET utf8 ;
USE `db_casamento` ;

-- -----------------------------------------------------
-- Table `db_casamento`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_casamento`.`usuario` (
  `id_usuario` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  `cargo` VARCHAR(45) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  PRIMARY KEY (`id_usuario`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_casamento`.`mesa`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_casamento`.`mesa` (
  `id_mesa` INT NOT NULL AUTO_INCREMENT,
  `capacidade` INT NOT NULL,
  `restricao` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id_mesa`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_casamento`.`convidado`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_casamento`.`convidado` (
  `id_convidado` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `sobrenome` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `cpf` VARCHAR(11) NOT NULL,
  `telefone` VARCHAR(45) NOT NULL,
  `categoria` VARCHAR(45) NOT NULL,
  `confirmacao` VARCHAR(45) NOT NULL DEFAULT 'não confirmado',
  `mesa_idmesa` INT NULL,
  PRIMARY KEY (`id_convidado`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  UNIQUE INDEX `cpf_UNIQUE` (`cpf` ASC) VISIBLE,
  INDEX `fk_convidado_mesa_idx` (`mesa_idmesa` ASC) VISIBLE,
  CONSTRAINT `fk_convidado_mesa`
    FOREIGN KEY (`mesa_idmesa`)
    REFERENCES `db_casamento`.`mesa` (`id_mesa`)
    ON DELETE SET NULL
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_casamento`.`checkin`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_casamento`.`checkin` (
  `id_checkin` INT NOT NULL AUTO_INCREMENT,
  `usuario_idusuario` INT NOT NULL,
  `convidado_idconvidado` INT NOT NULL,
  `data_e_hora` TIMESTAMP NULL,
  PRIMARY KEY (`id_checkin`),
  UNIQUE INDEX `convidado_idconvidado_UNIQUE` (`convidado_idconvidado` ASC) VISIBLE,
  INDEX `fk_checkin_usuario_idx` (`usuario_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_checkin_usuario`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `db_casamento`.`usuario` (`id_usuario`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_checkin_convidado`
    FOREIGN KEY (`convidado_idconvidado`)
    REFERENCES `db_casamento`.`convidado` (`id_convidado`)
    ON DELETE RESTRICT
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `db_casamento`.`acompanhante`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `db_casamento`.`acompanhante` (
  `id_acompanhante` INT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `sobrenome` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `idade` INT NOT NULL,
  `convidado_idconvidado` INT NOT NULL,
  PRIMARY KEY (`id_acompanhante`),
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE,
  INDEX `fk_acompanhante_convidado_idx` (`convidado_idconvidado` ASC) VISIBLE,
  CONSTRAINT `fk_acompanhante_convidado`
    FOREIGN KEY (`convidado_idconvidado`)
    REFERENCES `db_casamento`.`convidado` (`id_convidado`)
    ON DELETE CASCADE
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


set time_zone = "-03:00";

INSERT INTO usuario (nome, email, senha, cargo, cpf)
VALUES ("Ricardo", "ricardo@gmail.com", "$2a$12$tVeDbJ7DyuJFrNkGhCxM2.l.zBwo5EsFv9vNlYDw2KE0OUazZShlC", "administrador", "05380295010"),
("Ricardo2", "ricardo2@gmail.com", "$2a$12$tVeDbJ7DyuJFrNkGhCxM2.l.zBwo5EsFv9vNlYDw2KE0OUazZShlC", "ceremonialista", "99003053022");

INSERT INTO mesa(capacidade, restricao)
VALUES (100, "lactose");

DELIMITER $$ 
CREATE PROCEDURE seed_convidados()
BEGIN
DECLARE i INT DEFAULT 0;
WHILE i <= 30 DO
INSERT INTO convidado(nome, sobrenome, email, cpf, telefone, categoria, confirmacao, mesa_idmesa)
VALUES(
	CONCAT("ricardo", i),
    CONCAT("fernandes", i),
    CONCAT("ricardo", i, "@gmail.com"),
    LPAD(i, 11, '0'),
    CONCAT("519999", LPAD(i, 4, '0')),
    IF(i % 2 = 0, "parente", "convidado"),
    IF(i % 2 = 0, "confirmado", "cancelado"),
    1
);
SET i = i+1;
END WHILE;
END $$

DELIMITER ;

CALL seed_convidados();

INSERT INTO checkin (usuario_idusuario, convidado_idconvidado, data_e_hora)
VALUES(1, 1, "2026-10-02");


INSERT INTO acompanhante (nome, sobrenome,  email, idade, convidado_idconvidado)
VALUES ("fernando", "fernandes", "fernando@gmail.com", 18, 5);




SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
usuariousuario