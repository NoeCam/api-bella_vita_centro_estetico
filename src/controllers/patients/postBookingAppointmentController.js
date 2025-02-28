import insertBookingService from "../../services/insertBookingService.js";

const postBookingAppointmentController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, celphone, date, startTime, endTime } =
      req.body;

    const treatmentId = req.query.treatmentId;

    const adminId = 1;
    await insertBookingService(
      first_name,
      last_name,
      email,
      celphone,
      treatmentId,
      adminId,
      date,
      startTime,
      endTime
    );

    res.send({
      status: "Ok",
      message: "Cita agendada correctamente",
    });
  } catch (error) {
    next(error);
  }
};

export default postBookingAppointmentController;
