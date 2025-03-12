import bcrypt from "bcrypt";

import getPool from "./getPool.js";

import {
  MYSQL_DATABASE,
  ADMIN_FIRST_NAME_1,
  ADMIN_LAST_NAME_1,
  ADMIN_IMAGE_1,
  ADMIN_EMAIL_1,
  ADMIN_CELPHONE_1,
  ADMIN_PASSWORD_1,
  ADMIN_FIRST_NAME_2,
  ADMIN_LAST_NAME_2,
  ADMIN_IMAGE_2,
  ADMIN_EMAIL_2,
  ADMIN_CELPHONE_2,
  ADMIN_PASSWORD_2,
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
      DROP TABLE IF EXISTS patients, treatments, admins, timetable_admins, treatment_admins, appointments;
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
	    );
    `);

    await pool.query(`
      CREATE TABLE treatments(
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        name VARCHAR(50) NOT NULL,
        type VARCHAR(50) NOT NULL,
        subtype VARCHAR(50) NULL,
        description VARCHAR(1000) NOT NULL,
        appointment_duration INT NOT NULL,
        price INT DEFAULT NULL,
        clarification VARCHAR(50) NULL,
        image VARCHAR(200) NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        modified_at DATETIME ON UPDATE CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS admins (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        first_name VARCHAR(50) NOT NULL,
        last_name VARCHAR(50) NOT NULL,
        image VARCHAR(200) NULL,
        email VARCHAR(100) NOT NULL,
        celphone CHAR(30) NOT NULL,
        password CHAR(100) NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP, 
        modified_at DATETIME ON UPDATE CURRENT_TIMESTAMP
	    );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS timetable_admins (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        admin_id INT NOT NULL,
        work_date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        FOREIGN KEY (admin_id) REFERENCES admins(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS treatment_admins (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        treatment_id INT NOT NULL,
        admin_id INT NOT NULL,
        FOREIGN KEY (treatment_id) REFERENCES treatments(id),
        FOREIGN KEY (admin_id) REFERENCES admins(id)
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS appointments (
        id INT PRIMARY KEY NOT NULL AUTO_INCREMENT,
        patient_id INT NOT NULL,
        treatment_id INT NOT NULL,
        admin_id INT NOT NULL,
        date DATE NOT NULL,
        start_time TIME NOT NULL,
        end_time TIME NOT NULL,
        state ENUM('Pendiente', 'Confirmado', 'Cancelado') DEFAULT 'Pendiente',
        FOREIGN KEY (patient_id) REFERENCES patients(id),
        FOREIGN KEY (treatment_id) REFERENCES treatments(id),
        FOREIGN KEY (admin_id) REFERENCES admins(id)
      );
    `);

    const hashedPass_1 = await bcrypt.hash(ADMIN_PASSWORD_1, 10);
    const hashedPass_2 = await bcrypt.hash(ADMIN_PASSWORD_2, 10);

    await pool.query(`
      INSERT INTO admins (first_name, last_name, image, email, celphone, password) 
      VALUES (
        "${ADMIN_FIRST_NAME_1}",
        "${ADMIN_LAST_NAME_1}",
        "${ADMIN_IMAGE_1}",
        "${ADMIN_EMAIL_1}",
        "${ADMIN_CELPHONE_1}",
        "${hashedPass_1}"
        ),
        (
        "${ADMIN_FIRST_NAME_2}",
        "${ADMIN_LAST_NAME_2}",
        "${ADMIN_IMAGE_2}",
        "${ADMIN_EMAIL_2}",
        "${ADMIN_CELPHONE_2}",
        "${hashedPass_2}"
        );
    `);

    await pool.query(`
      INSERT INTO treatments(name, type, subtype, description, appointment_duration, price, clarification, image) 
      VALUES 
      ("Diseño y perfilado",  "Cejas", "", "Define y estiliza la forma de tus cejas para armonizar tu rostro con un acabado natural y pulido. Utilizamos técnicas especializadas para resaltar la estructura ósea y lograr un look impecable. Es ideal para quienes buscan un diseño personalizado y acorde a sus facciones.", 30, 650, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1739960014/CVM/qmfgoaoukjcd6gnwgymu.webp"),
      ("Laminado", "Cejas", "", "Aporta volumen, fijación y dirección a tus cejas con un efecto de mayor densidad y un acabado prolijo y natural. Mediante un tratamiento químico suave, se logran cejas más alineadas y peinadas sin la necesidad de utilizar productos diariamente.", 60, 1290, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1741780285/CVM/edlgpjn7ihaitk1vemtr.png"),
      ("Henna", "Cejas", "", "Coloración semipermanente con henna que define, rellena y da volumen a las cejas. Proporciona un efecto de maquillaje natural y duradero, adaptándose a diferentes tonos de piel y cabello. Incluye perfilado para un acabado más limpio y estructurado.", 30, 990, "Incluye perfilado", "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740139726/CVM/cmpnd9ezvn2xsetagsbm.jpg"),
      ("Microblanding", "Cejas", "", "Técnica de pigmentación semipermanente que imita el vello natural para cejas más definidas y estructuradas. Es ideal para quienes desean corregir la forma de sus cejas o rellenar zonas despobladas, logrando un aspecto natural y de larga duración.", 180, 6990, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138650/CVM/r95skfhkhyqvcforg0no.jpg"),
      ("Remoción química", "Cejas", "", "Elimina pigmentos no deseados de procedimientos como micropigmentación o microblading mediante un proceso químico seguro. Es un tratamiento progresivo que ayuda a corregir errores o modificar la intensidad del color. Precio por sesión.", 60, 990, "Precio por sesión", "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/btqnfospx2lef8hvjskh.jpg"),
      ("Lifting", "Pestañas", "", "Eleva y curva las pestañas naturales desde la raíz, proporcionando un efecto de mayor longitud y volumen sin necesidad de extensiones. Ideal para quienes buscan una mirada más abierta y expresiva con un resultado duradero y sin mantenimiento diario.", 90, 1390, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/wafnak4m8yegdlwsar6p.jpg"),
      ("Extensión pelo a pelo", "Pestañas", "", "Aplicación individual de extensiones en cada pestaña natural para un efecto más largo, definido y voluminoso. Se utilizan fibras ligeras para un look sofisticado y natural. Requiere mantenimiento cada 21 días para conservar el diseño.", 120, 1390, "Mantenimiento cada 21 días $1190", "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/bs9ytjcys7ufq9f4eskj.jpg"),
      ("Volumen brasilero con fibras tecnológicas", "Pestañas", "", "Proporciona un efecto de mayor densidad y volumen gracias a la aplicación de fibras ultraligeras que imitan la pestaña natural. Ideal para quienes desean un look más intenso y definido sin perder naturalidad. Requiere mantenimiento cada 21 días.", 120, 1490, "Mantenimiento cada 21 días $1190", "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/wwmupuxf4tbvdi9rktk2.jpg"),
      ("Limpieza profunda", "Faciales", "", "Elimina impurezas, células muertas y residuos de maquillaje mediante un proceso de limpieza profunda que revitaliza la piel. Incluye exfoliación, extracción de comedones y mascarilla hidratante para mejorar la textura y luminosidad del rostro.", 60, 1200, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/ezbi0spjdo5ztotybh8o.jpg"),
      ("Peeling", "Faciales", "", "Exfoliación química que ayuda a mejorar la textura de la piel, reducir manchas, cicatrices y signos de envejecimiento. Se utilizan ácidos específicos para renovar la piel en profundidad y estimular la regeneración celular, obteniendo un cutis más uniforme.", 90, 1500, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/yurwoed05pjq6fzquu0u.jpg"),
      ("Hilos cosméticos", "Faciales", "", "Estimula la producción de colágeno mediante la aplicación de hilos tensores en el rostro. Proporciona un efecto lifting inmediato sin cirugía, mejorando la firmeza y redefiniendo el contorno facial para un aspecto rejuvenecido y natural.", 90, 3990, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740140778/CVM/bofbbhz9yo7ys7qgjfnb.jpg"),
      ("BB Glow", "Faciales", "", "Tratamiento innovador de microneedling que aporta luminosidad y unifica el tono de la piel, creando un efecto de base de maquillaje semipermanente. Reduce manchas, enrojecimiento y signos de fatiga, dejando la piel más radiante y saludable.", 90, 1990, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/sdxaqxmn2occxqd4d8kj.jpg"),
      ("Punta de diamantes", "Faciales", "Aparatología", "Exfoliación mecánica con tecnología de punta de diamante que remueve células muertas y mejora la textura de la piel. Ayuda a reducir cicatrices, manchas y líneas finas, promoviendo una piel más suave y luminosa.", 90, null, "A evaluación", "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/bwfhwqbuy8nyfc8etid2.jpg"),
      ("Dermaplaning", "Faciales", "Aparatología", "Exfoliación manual con bisturí que elimina células muertas y vello facial, dejando la piel más lisa, suave y luminosa. Ideal para mejorar la absorción de productos cosméticos y conseguir un acabado impecable en el maquillaje.", 90, null, "A evaluación", "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138649/CVM/s5ghmmcgelb2nbpr3exn.jpg"),
      ("BB Lips", "Labios", "", "Hidratación profunda y pigmentación sutil para unos labios más saludables, voluminosos y con un color natural. El tratamiento mejora la textura y aporta un brillo ligero sin necesidad de labiales, logrando un look fresco y rejuvenecido.", 90, 2990, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138648/CVM/dyzfanbqknhnv9q6ihyx.jpg"),
      ("Micropigmentación", "Labios", "", "Pigmentación semipermanente para definir el contorno y color de los labios, logrando un efecto natural y armonioso. Es ideal para corregir asimetrías, mejorar la tonalidad y dar un aspecto más voluminoso sin necesidad de maquillaje diario.", 90, 6990, null, "https://res.cloudinary.com/dlxdb2gs7/image/upload/v1740138648/CVM/fbos7xxvogylclhk9fxa.jpg")
      ;
    `);

    await pool.query(`
    INSERT INTO treatment_admins (treatment_id, admin_id) 
      VALUES 
      (1, 1),
      (2, 1),
      (3, 1),
      (4, 1),
      (5, 1),
      (6, 1),
      (7, 1),
      (8, 1),
      (9, 1),
      (10, 1),
      (11, 1),
      (12, 1),
      (13, 1),
      (14, 1),
      (15, 1),
      (16, 1),
      (1, 2),
      (2, 2),
      (3, 2),
      (4, 2),
      (5, 2),
      (6, 2),
      (7, 2),
      (8, 2),
      (9, 2),
      (10, 2),
      (11, 2),
      (12, 2)
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
