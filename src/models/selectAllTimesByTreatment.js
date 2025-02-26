import getPool from "../database/getPool.js";
import { MYSQL_DATABASE } from "../../env.js";

const selectAllTimesByTreatment = async (date, treatmentId) => {
  const pool = await getPool();

  await pool.query(`USE ${MYSQL_DATABASE}`);

  // 1. Obtener la duración del tratamiento y el horario laboral
  const [[treatment]] = await pool.query(
    `SELECT t.appointment_duration
     FROM treatments t
     WHERE t.id = ?;`,
    [treatmentId]
  );

  if (!treatment) throw new Error("Tratamiento no encontrado");

  const treatmentDuration = treatment.appointment_duration;

  const [workHours] = await pool.query(
    `SELECT ti.start_time, ti.end_time
     FROM timetable_admins ti
     INNER JOIN treatment_admins ta ON ta.admin_id = ti.admin_id
     WHERE ti.work_date = ? AND ta.treatment_id = ?;`,
    [date, treatmentId]
  );

  if (workHours.length === 0) return [];

  // 2. Obtener citas ya reservadas
  const [appointments] = await pool.query(
    `SELECT ap.start_time, ap.end_time
     FROM appointments ap
     INNER JOIN treatment_admins ta ON ta.admin_id = ap.admin_id
     WHERE ap.date = ? AND ta.treatment_id = ?;`,
    [date, treatmentId]
  );

  // 3. Función para generar los intervalos de tiempo
  const generateTimeSlots = (start, end, duration) => {
    const slots = [];
    let currentTime = new Date(`1970-01-01T${start}`);
    const endTime = new Date(`1970-01-01T${end}`);

    while (currentTime <= endTime) {
      slots.push(currentTime.toTimeString().slice(0, 5));
      currentTime.setMinutes(currentTime.getMinutes() + 30);
    }

    return slots;
  };

  // 4. Calcular horarios disponibles
  const availableTimes = [];

  workHours.forEach(({ start_time, end_time }) => {
    const slots = generateTimeSlots(start_time, end_time, treatmentDuration);

    slots.forEach((slot) => {
      const slotStart = new Date(`1970-01-01T${slot}`);
      const slotEnd = new Date(slotStart.getTime() + treatmentDuration * 60000);

      // Comprobar si este intervalo se solapa con alguna cita existente
      const isOccupied = appointments.some(({ start_time, end_time }) => {
        const appointmentStart = new Date(`1970-01-01T${start_time}`);
        const appointmentEnd = new Date(`1970-01-01T${end_time}`);

        return (
          (slotStart >= appointmentStart && slotStart < appointmentEnd) ||
          (slotEnd > appointmentStart && slotEnd <= appointmentEnd) ||
          (slotStart <= appointmentStart && slotEnd >= appointmentEnd)
        );
      });

      if (!isOccupied) {
        availableTimes.push(slot);
      }
    });
  });

  return availableTimes;
};

export default selectAllTimesByTreatment;
