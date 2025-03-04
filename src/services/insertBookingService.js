import getPool from "../database/getPool.js";
import { MYSQL_DATABASE } from "../../env.js";
import addMinutesToTime from "../utils/addMunutesTotime.js";

const insertBookingService = async (
  treatmentId,
  adminId,
  date,
  startTime,
  first_name,
  last_name,
  email,
  celphone
) => {
  const pool = await getPool();

  await pool.query(`USE ${MYSQL_DATABASE}`);

  // 1. Obtiene la duración del tratamiento y el horario laboral
  const [[treatment]] = await pool.query(
    `SELECT t.appointment_duration
     FROM treatments t
     WHERE t.id = ?;`,
    [treatmentId]
  );

  if (!treatment) throw new Error("Tratamiento no encontrado");
  const treatmentDuration = treatment.appointment_duration;

  // 2. Calcula la hora de finalización de la cita
  const endTime = addMinutesToTime(startTime, treatmentDuration);

  // 3. Inserta el nuevo paciente en la base de datos
  const [result] = await pool.query(
    `
    INSERT INTO patients (first_name, last_name, email, celphone)
    VALUES (?, ?, ?, ?);
    `,
    [first_name, last_name, email, celphone]
  );

  // 4. Inserta la cita en la base de datos
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
