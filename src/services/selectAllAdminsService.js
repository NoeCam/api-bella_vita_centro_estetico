import getPool from "../database/getPool.js";
import { MYSQL_DATABASE } from "../../env.js";

const selectAllAdminsService = async () => {
  const pool = await getPool();

  await pool.query(`USE ${MYSQL_DATABASE}`);

  const [admins] = await pool.query(
    `
    SELECT id, first_name, last_name, image
    FROM admins
    ORDER BY id
    `
  );

  return admins;
};

export default selectAllAdminsService;
