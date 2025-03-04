import selectAllTimesByTreatmentService from "../../services/selectAllTimesByTreatmentService.js";

const getTimeAppointmentsController = async (req, res, next) => {
  try {
    const { treatmentId, adminId, date } = req.query;

    if (date === null || treatmentId === null || adminId === null) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos",
      });
    } else {
      const dateNow = new Date();

      const dateSelected = new Date(date);
      if (dateSelected < dateNow) {
        return res.status(400).send({
          status: "error",
          message: "No se pueden reservar citas en fechas pasadas",
        });
      }
    }

    const allTimes = await selectAllTimesByTreatmentService(
      treatmentId,
      adminId,
      date
    );
    res.send({
      status: "ok",
      message: "Horarios disponibles",
      data: {
        allTimes,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default getTimeAppointmentsController;
