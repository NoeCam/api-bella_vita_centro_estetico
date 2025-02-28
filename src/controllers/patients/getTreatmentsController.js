import selectAllTreatmentsService from "../../services/selectAllTreatmentsService.js";

// Función para obtener la lista de tratamientos ordenados por tipo.
const getTreatmentsController = async (req, res, next) => {
  try {
    let treatments = await selectAllTreatmentsService();

    res.send({
      status: "ok",
      message: "Lista de tratamientos obtenida correctamente",
      data: {
        treatments,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getTreatmentsController;
