import getPool from "../database/getPool.js";
import { MYSQL_DATABASE } from "../../env.js";

const insertBookingService = async (
  first_name,
  last_name,
  email,
  celphone,
  treatmentId,
  adminId,
  date,
  startTime,
  endTime
) => {
  const pool = await getPool();

  await pool.query(`USE ${MYSQL_DATABASE}`);

  const [result] = await pool.query(
    `
    INSERT INTO patients (first_name, last_name, email, celphone)
    VALUES (?, ?, ?, ?);
    `,
    [first_name, last_name, email, celphone]
  );

  const patientId = result.insertId;
  await pool.query(
    `
    INSERT INTO appointments (patient_id, treatment_id, admin_id, date, start_time, end_time)
    VALUES (?, ?, ?, ?, ?, ?);
    `,
    [patientId, treatmentId, adminId, date, startTime, endTime]
  );
};

export default insertBookingService;
