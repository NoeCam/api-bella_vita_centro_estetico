import getPool from "../database/getPool.js";
import { MYSQL_DATABASE } from "../../env.js";

const getTimeAppointmentsController = async (date, treatmentId) => {
  const pool = await getPool();

  await pool.query(`USE ${MYSQL_DATABASE}`);

  const [allTimes] = await pool.query(
    `
    SELECT ti.id, ti.admin_id, ti.work_date, ti.start_time, ti.end_time, t.appointment_duration, t.treatment_name, t.id as treatment_id, tr.admin_id
    FROM timetable_admins ti
    INNER JOIN treatments t
    LEFT JOIN treatments tr
    ON ta.admin_id = t.admin_id
    ORDER BY ta.start_time ASC
    WHERE ta.work_date = ? AND t.admin_id = ?
    `
  );

  return treatments;
};

export default getTimeAppointmentsController;
