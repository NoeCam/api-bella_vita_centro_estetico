import selectAvailableDaysService from "../../services/selectAvailableDaysService.js";

const getAvailableDaysController = async (req, res, next) => {
  try {
    const { treatmentId, adminId } = req.query;

    const { year, month } = req.body;
    console.log(year);

    if (
      treatmentId === null ||
      adminId === null ||
      month === null ||
      year === null
    ) {
      return res.status(400).send({
        status: "error",
        message: "Faltan datos",
      });
    }

    const availableDays = await selectAvailableDaysService(
      treatmentId,
      adminId,
      year,
      month
    );
    res.send({
      status: "ok",
      message: "Horarios disponibles",
      data: {
        availableDays,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default getAvailableDaysController;
