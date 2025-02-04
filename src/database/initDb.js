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
        name VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        subtype VARCHAR(50) NULL,
        description VARCHAR(100) NOT NULL,
        appointment_duration TIME NOT NULL,
        price INT DEFAULT NULL,
        clarification VARCHAR(50) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        modified_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      );
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

    await pool.query(`
      INSERT INTO treatements(name, type, subtype, description, appointment_duration, price, clarification) 
      VALUES 
      ("Diseño y perfilado",  "Cejas", "","", 1, 650, null),
      ("Laminado", "Cejas", "","", 1, 1290, null),
      ("Henna ", "Cejas", "","", 1, 990,"Incluye perfilado"),
      ("Microblanding", "Cejas", "","", 1, 6990, null),
      ("Remoción química", "Cejas", "","", 1, 990, "Precio por sesión"),
      ("Lifting", "Pestañas", "","", 1, 1390, null),
      ("Extensión pelo a pelo", "Pestañas", "","", 1, 1390, "Mantenimiento cada 21 días $1190"),
      ("Volumen brasilero con fibras tecnológicas", "Pestañas", "","", 1, 1490, "Mantenimiento cada 21 días $1190"),
      ("Limpieza profunda", "Faciales", "","", 1, 1200, null),
      ("Peeling", "Faciales", "","", 1, 1500, null),
      ("Hilos cosméticos", "Faciales", "","", 1, 3990, null),
      ("BB Glow", "Faciales", "","", 1, 1990, null),
      ("Punta de diamantes", "Faciales", "Aparatología","", 1, null, "A evaluación"),
      ("Dermaplaning", "Faciales", "Aparatología","", 1,null, "A evaluación"),
      ("Radiofrecuencia", "Faciales", "Aparatología","", 1, null, "A evaluación"),
      ("Máscara fototerapia led", "Faciales", "Aparatología","", 1, null, "A evaluación"),
      ("Dermapen", "Faciales", "Aparatología","", 1, null, "A evaluación"),
      ("BB Lips", "Labios", "","", 1, 2990, null),
      ("HidraGloss", "Labios", "","", 1, 1990, null),
      ("Micropigmentación", "Labios", "","", 1, 6990, null)
      ;
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
