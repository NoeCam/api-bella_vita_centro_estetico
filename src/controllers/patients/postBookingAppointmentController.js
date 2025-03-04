import insertBookingService from "../../services/insertBookingService.js";

const postBookingAppointmentController = async (req, res, next) => {
  try {
    const { first_name, last_name, email, celphone, date, startTime } =
      req.body;

    const treatmentId = req.query.treatmentId;
    const adminId = req.query.adminId;

    await insertBookingService(
      treatmentId,
      adminId,
      date,
      startTime,
      first_name,
      last_name,
      email,
      celphone
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
