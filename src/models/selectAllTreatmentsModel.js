import getPool from "../database/getPool.js";
import { MYSQL_DATABASE } from "../../env.js";

const selectAllTreatmentsModel = async () => {
  const pool = await getPool();

  await pool.query(`USE ${MYSQL_DATABASE}`);

  const [treatments] = await pool.query(
    `
    SELECT id, name, type, subtype, description, appointment_duration, price, clarification, image
    FROM treatments
    ORDER BY type
    `
  );

  return treatments;
};

export default selectAllTreatmentsModel;
