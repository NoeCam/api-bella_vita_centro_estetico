import selectAllTreatmentsModel from "../models/selectAllTreatmentsModel.js";

// Función para obtener la lista de tratamientos ordenados por tipo.
const getTreatmentsController = async (req, res, next) => {
  try {
    let treatments = await selectAllTreatmentsModel();

    res.send({
      status: "ok",
      data: {
        treatments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getTreatmentsController;
