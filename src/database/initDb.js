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
      DROP TABLE IF EXISTS admin, patients, treatments, appointments;
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
      CREATE TABLE treatments(
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        subtype VARCHAR(50) NULL,
        description VARCHAR(300) NOT NULL,
        appointment_duration INT NOT NULL,
        price INT DEFAULT NULL,
        clarification VARCHAR(50) NULL,
        image VARCHAR(200) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        modified_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        patient_id INT NOT NULL,
        treatment_id INT NOT NULL,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        state ENUM('Pendiente', 'Confirmado', 'Cancelado') DEFAULT 'Pendiente',
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        FOREIGN KEY (treatment_id) REFERENCES treatments(id)
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
      INSERT INTO treatments(name, type, subtype, description, appointment_duration, price, clarification, image) 
      VALUES 
        ("Diseño y perfilado",  
            "Cejas", 
            "",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor porta semper. Mauris a iaculis est, id placerat tortor. Suspendisse facilisis dolor sed diam tempus, in maximus elit varius.", 
            1, 
            650, 
            null, 
            ""),
        ("Laminado", 
            "Cejas", 
            "",
            "Consectetur adipiscing elit. Nullam tempor porta semper. Mauris a iaculis est, id placerat tortor. Suspendisse facilisis dolor sed diam tempus, in maximus elit varius. Sed ac metus pretium tortor luctus volutpat.", 
            1, 
            1290, 
            null, 
            ""),
        ("Henna ", 
            "Cejas", 
            "",
            "Consectetur adipiscing elit. Nullam tempor porta semper. Mauris a iaculis est, id placerat tortor. Suspendisse facilisis dolor sed diam tempus, in maximus elit varius. Sed ac metus pretium tortor luctus volutpat.",  
            1, 
            990,
            "Incluye perfilado", 
            ""),
        ("Microblanding", 
            "Cejas", 
            "",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor porta semper. Mauris a iaculis est, id placerat tortor.", 
            1, 
            6990, 
            null, 
            ""),
        ("Remoción química", 
            "Cejas", 
            "",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor porta semper. Mauris a iaculis est, id placerat tortor.", 
            1, 
            990, 
            "Precio por sesión", 
            ""),
        ("Lifting", 
            "Pestañas", 
            "",
            "", 
            1, 
            1390, 
            null, 
            ""),
        ("Extensión pelo a pelo", 
            "Pestañas", 
            "",
            "", 
            1, 
            1390, 
            "Mantenimiento cada 21 días $1190", 
            ""),
        ("Volumen brasilero con fibras tecnológicas", 
            "Pestañas", 
            "",
            "", 
            1, 
            1490, 
            "Mantenimiento cada 21 días $1190", 
            ""),
        ("Limpieza profunda", 
            "Faciales", 
            "",
            "", 
            1, 
            1200, 
            null, 
            ""),
        ("Peeling", "Faciales", "","", 1, 1500, null, ""),
        ("Hilos cosméticos", "Faciales", "","", 1, 3990, null, ""),
        ("BB Glow", "Faciales", "","", 1, 1990, null, ""),
        ("Punta de diamantes", "Faciales", "Aparatología","", 1, null, "A evaluación", ""),
        ("Dermaplaning", "Faciales", "Aparatología","", 1,null, "A evaluación", ""),
        ("Radiofrecuencia", "Faciales", "Aparatología","", 1, null, "A evaluación", ""),
        ("Máscara fototerapia led", "Faciales", "Aparatología","", 1, null, "A evaluación", ""),
        ("Dermapen", "Faciales", "Aparatología","", 1, null, "A evaluación", ""),
        ("BB Lips", "Labios", "","", 1, 2990, null, ""),
        ("HidraGloss", "Labios", "","", 1, 1990, null, ""),
        ("Micropigmentación", "Labios", "","", 1, 6990, null, "")
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
