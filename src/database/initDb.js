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
        description VARCHAR(1000) NOT NULL,
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
            30, 
            650, 
            null, 
            null),
        ("Laminado", 
            "Cejas", 
            "",
            "Consectetur adipiscing elit. Nullam tempor porta semper. Mauris a iaculis est, id placerat tortor. Suspendisse facilisis dolor sed diam tempus, in maximus elit varius. Sed ac metus pretium tortor luctus volutpat.", 
            60, 
            1290, 
            null, 
            null),
        ("Henna ", 
            "Cejas", 
            "",
            "Consectetur adipiscing elit. Nullam tempor porta semper. Mauris a iaculis est, id placerat tortor. Suspendisse facilisis dolor sed diam tempus, in maximus elit varius. Sed ac metus pretium tortor luctus volutpat.",  
            40, 
            990,
            "Incluye perfilado", 
            null),
        ("Microblanding", 
            "Cejas", 
            "",
            "MICRO / NANOBLADING
            Es una TÉCNICA de MICROPIGMENTACIÓN.
            Es un MAQUILLAJE SEMIPERMANENTE cuyo objetivo es corregir o reconstruir una ceja 
            carente de pelo, realizando pelos de forma artística creando un efecto 
            HIPERREALISTA Y NATURAL
            ",
            180, 
            6990, 
            null, 
            null),
        ("Remoción química", 
            "Cejas", 
            "",
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam tempor 
            porta semper. Mauris a iaculis est, id placerat tortor.", 
            1, 
            990, 
            "Precio por sesión", 
            null),
        ("Lifting", 
            "Pestañas", 
            "",
            "Es un tratamiento que eleva la curvatura de tus pestañas, resaltando la 
            expresión de la mirada y alargando las pestañas desde la raíz, sin utilizar 
            pelo sintético. Se logra gracias a unas almohadillas de silicona que se 
            ajustan al párpado y, en lugar de “doblar el pelo”, lo estira y eleva hacia 
            la punta, hasta su máximo punto. De esta forma quedan como maquilladas siempre, 
            como si tuvieras un efecto rímel permanente. Es un procedimiento que dura de 4 a 6 semanas.
           ", 
            90, 
            1390, 
            null, 
            null),
        ("Extensión pelo a pelo", 
            "Pestañas", 
            "",
            "¡Descubre los increíbles beneficios de las extensiones de pestañas!
            Mirada más intensa y definida.
            Ahorra tiempo en tu rutina diaria.
            Resalta tu belleza natural sin necesidad de maquillaje extra.
            ", 
            120, 
            1390, 
            "Mantenimiento cada 21 días $1190", 
            null),
        ("Volumen brasilero con fibras tecnológicas", 
            "Pestañas", 
            "",
            "", 
            120, 
            1490, 
            "Mantenimiento cada 21 días $1190", 
            null),
        ("Limpieza profunda", 
            "Faciales", 
            "",
            "¡Descubre el poder de una piel renovada!
            En VM, realizamos limpiezas faciales personalizadas para 
            devolverle a tu rostro frescura, luminosidad y vitalidad. ¿Lista para consentir tu piel?
            ", 
            60, 
            1200, 
            null, 
            null),
        ("Peeling", 
            "Faciales", 
            "",
            "", 
            90, 
            1500, 
            null, 
            null),
        ("Hilos cosméticos", 
            "Faciales", 
            "",
            "LIQUIDOS Y SÓLIDOS. Es un procedimiento no invasivo que ayuda a reducir 
            los signos de envejecimiento. Es un tratamiento que utiliza activos para 
            mejorar la textura y tensión de la piel, dando mayor hidratación y luminosidad.
            Esta técnica ayuda a estimular la producción y regeneración de colágeno propio de nuestra piel.
            ", 
            90, 
            3990, 
            null, 
            null),
        ("BB Glow", 
            "Faciales", 
            "",
            "", 
            90, 
            1990, 
            null, 
            null),
        ("Punta de diamantes", 
            "Faciales", 
            "Aparatología",
            "PUNTA DE DIAMANTE O MICRODERMOABRASIÓN
            Método altamente eficaz para tratamientos superficiales de imperfecciones en la piel
            Manchas / cicatrices / líneas de expresión.
            Proporciona una limpieza y exfoliación de la piel eliminando la suciedad y grasa 
            dejando la piel más suave. ES ideal para aplicar antes de cualquier otro tratamiento,
            eliminar las células muertas, disminuir el tamaño de los poros. Un plus extra es que 
            deja la piel suave y renovada
            ", 
            90, 
            null, 
            "A evaluación", 
            null),
        ("Dermaplaning", 
            "Faciales", 
            "Aparatología",
            "Es un método de exfoliación mecánica realizada con hoja bisirurí.
            El objetivo es eliminar células muertas de la capa más superficial de la piel.
            Y también elimina la pelusa del rostro (los cuales vuelven a crecer del mismo grosor que antes)
            Un mito muy escuchado : crecen más cantidad o más engrosados)
            Esta técnica de exfoliación permite la penetración de activos posteriores ya que 
            la piel queda más permeable. No duele! El resultado es notorio e inmediato!
            La piel queda más limpia tersa y suave. Piel de porcelana 
            ¿Que estás esperando para agendarte y probar esta técnica?
            ", 
            90,
            null, 
            "A evaluación", 
            null),
        ("Radiofrecuencia", 
            "Faciales", 
            "Aparatología",
            "", 
            90, 
            null, 
            "A evaluación", 
            null),
        ("Máscara fototerapia led", 
            "Faciales", 
            "Aparatología",
            "", 
            90, 
            null, 
            "A evaluación", 
            null),
        ("Dermapen", 
            "Faciales", 
            "Aparatología",
            "", 
            90, 
            null, 
            "A evaluación", 
            null),
        ("BB Lips", 
            "Labios", 
            "",
            "", 
            30, 
            2990, 
            null, 
            null),
        ("HidraGloss", 
            "Labios", 
            "",
            "Es la hidratación ideal para tus labios, consiste en microinyecciones 
            de ácido hialurónico con dermapen que aparte de hidratar ayuda a minimizar 
            las arrugas finas estimulando a su vez las fibras de colágeno y mejorando 
            su aspecto natural.
            ", 
            40, 
            1990, 
            null, 
            null),
        ("Micropigmentación", 
            "Labios", 
            "",
            "Micropigmentación Labial
            La técnica en tendencia para lucir unos labios bonitos, saludables y revitalizados,
            Labios más definidos con más color y volumen y así olvidarte del maquillaje 
            ", 
            180, 
            6990, 
            null, 
            null)
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
