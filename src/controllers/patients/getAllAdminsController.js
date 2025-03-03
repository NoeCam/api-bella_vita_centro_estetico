import selectAllAdminsService from "../../services/selectAllAdminsService.js";

// Función para obtener la lista de tratamientos ordenados por tipo.
const getAllAdminsController = async (req, res, next) => {
  try {
    let admins = await selectAllAdminsService();

    res.send({
      status: "ok",
      message: "Lista de tratamientos obtenida correctamente",
      data: {
        admins,
      },
    });
  } catch (error) {
    next(error);
  }
};

export default getAllAdminsController;
