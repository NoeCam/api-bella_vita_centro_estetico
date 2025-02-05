import getPool from "../database/getPool.js";
import { MYSQL_DATABASE } from "../../env.js";

// Función que realiza una consulta a la base de datos para seleccionar el admin con un email dado.
const selectAdminByEmailModel = async (email) => {
  const pool = await getPool();

  await pool.query(`USE ${MYSQL_DATABASE}`);

  // Comprobamos si hay algún usuario con el email proporcionado.
  const [admin] = await pool.query(
    `SELECT id, first_name, last_name, email, celphone, password FROM admin WHERE email = ?`,
    [email]
  );

  return admin[0];
};

export default selectAdminByEmailModel;
