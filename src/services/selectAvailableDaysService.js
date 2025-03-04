import getPool from "../database/getPool.js";
import { MYSQL_DATABASE } from "../../env.js";

const selectAvailableDaysService = async (
  treatmentId,
  adminId,
  year,
  month
) => {
  const pool = await getPool();

  await pool.query(`USE ${MYSQL_DATABASE}`);

  const [availableDays] = await pool.query(
    `WITH days_of_month AS (
    SELECT DATE_ADD(DATE(CONCAT(?, '-', ?, '-01')), INTERVAL n DAY) AS work_date
    FROM (
      SELECT t.n
      FROM (
        SELECT 0 AS n UNION ALL SELECT 1 UNION ALL SELECT 2 UNION ALL SELECT 3 UNION ALL SELECT 4 UNION ALL SELECT 5 UNION ALL SELECT 6 UNION ALL
        SELECT 7 UNION ALL SELECT 8 UNION ALL SELECT 9 UNION ALL SELECT 10 UNION ALL SELECT 11 UNION ALL SELECT 12 UNION ALL SELECT 13 UNION ALL
        SELECT 14 UNION ALL SELECT 15 UNION ALL SELECT 16 UNION ALL SELECT 17 UNION ALL SELECT 18 UNION ALL SELECT 19 UNION ALL SELECT 20 UNION ALL
        SELECT 21 UNION ALL SELECT 22 UNION ALL SELECT 23 UNION ALL SELECT 24 UNION ALL SELECT 25 UNION ALL SELECT 26 UNION ALL SELECT 27 UNION ALL
        SELECT 28 UNION ALL SELECT 29 UNION ALL SELECT 30
      ) AS t
    ) AS days
    WHERE DATE_ADD(DATE(CONCAT(?, '-', ?, '-01')), INTERVAL n DAY) <= LAST_DAY(DATE(CONCAT(?, '-', ?, '-01')))
)
SELECT d.work_date,
       CASE WHEN COUNT(DISTINCT t.work_date) = 0 THEN false
            WHEN SUM(TIMESTAMPDIFF(MINUTE, t.start_time, t.end_time) / tr.appointment_duration) > COUNT(a.id)
            THEN true
            ELSE false END AS disponibilidad
FROM days_of_month d
LEFT JOIN timetable_admins t ON d.work_date = t.work_date
                             AND t.admin_id = ?
                             AND MONTH(t.work_date) = ?
                             AND YEAR(t.work_date) = ?
LEFT JOIN appointments a ON d.work_date = a.date
                          AND a.admin_id = ?
                          AND a.treatment_id = ?
                          AND a.state IN ('Pendiente', 'Confirmado')
JOIN treatments tr ON tr.id = ?
GROUP BY d.work_date
ORDER BY d.work_date;
`,
    [
      year,
      month,
      year,
      month,
      year,
      month,
      adminId,
      month,
      year,
      adminId,
      treatmentId,
      treatmentId,
    ]
  );

  return availableDays;
};

export default selectAvailableDaysService;
