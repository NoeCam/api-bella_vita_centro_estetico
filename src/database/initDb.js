import bcrypt from "bcrypt";

import getPool from "./getPool.js";

import {
  MYSQL_DATABASE,
  ADMIN_FIRST_NAME,
  ADMIN_LAST_NAME,
  ADMIN_EMAIL,
  ADMIN_CELPHONE,
  ADMIN_PASSWORD,
} from "../../env.js";

async function createDB() {
  try {
    let pool = await getPool();

    await pool.query(`CREATE DATABASE IF NOT EXISTS ${MYSQL_DATABASE}`);
  } catch (error) {
    throw new Error("Error al crear la BBDD", { cause: error });
  }
}

async function createTables() {
  try {
    let pool = await getPool();

    await pool.query(`USE ${MYSQL_DATABASE}`);

    await pool.query(`
      DROP TABLE IF EXISTS admin, patients, treatements, appointments;
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS patients (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        celphone CHAR(30) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        modified_at DATETIME ON UPDATE CURRENT_TIMESTAMP
	    )
    `);

    await pool.query(`
      CREATE TABLE treatements(
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        title VARCHAR(50) NOT NULL,
        description VARCHAR(100) NOT NULL,
        appointment_duration TIME NOT NULL,
        price INT NOT NULL
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        patient_id INT NOT NULL,
        treatement_id INT NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        state ENUM('Pendiente', 'Confirmado', 'Cancelado') DEFAULT 'Pendiente',
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        FOREIGN KEY (treatement_id) REFERENCES treatements(id)
      )
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admin (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        email VARCHAR(100) NOT NULL,
        celphone CHAR(30) NOT NULL,
        password CHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        modified_at DATETIME ON UPDATE CURRENT_TIMESTAMP
	    )
    `);

    const hashedPass = await bcrypt.hash(ADMIN_PASSWORD, 10);

    await pool.query(`
      INSERT INTO admin(first_name, last_name, email, celphone, password) 
      VALUES (
        "${ADMIN_FIRST_NAME}",
        "${ADMIN_LAST_NAME}",
        "${ADMIN_EMAIL}",
        "${ADMIN_CELPHONE}",
        "${hashedPass}"
        );
      `);
  } catch (error) {
    throw new Error("Error al crear las tablas", { cause: error });
  }
}

async function initDB() {
  try {
    await createDB();
    console.log("Base de datos creada");
    await createTables();
    console.log("Tablas creadas");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

initDB();
