export default function addMinutesToTime(timeString, minutesToAdd) {
  // Convierte "HH:MM" a un objeto Date
  const [hours, minutes] = timeString.split(":").map(Number);
  const time = new Date();
  time.setHours(hours);
  time.setMinutes(minutes);
  time.setSeconds(0);

  // Suma los minutos
  time.setTime(time.getTime() + minutesToAdd * 60000);

  // Formatea de vuelta a "HH:MM"
  return time.toTimeString().split(" ")[0];
}
