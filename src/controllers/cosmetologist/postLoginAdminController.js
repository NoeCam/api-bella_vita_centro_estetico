import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import selectAdminByEmailService from "../../services/selectAdminByEmailService.js";
import { invalidCredentialsError } from "../../utils/errorUtils.js";

// Función controladora final que loguea a un usuario retornando un token.
const postLoginAdminController = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Seleccionamos los datos del usuario que necesitamos utilizando el email.
    const admin = await selectAdminByEmailService(email);
    // Variable que almacenará un valor booleano indicando si la contraseña es correcto o no.
    let validPass;
    // Compruebo que la contraseña del admin coincida con la almacenada.
    if (admin) {
      // Comprobamos si la contraseña es válida.
      validPass = await bcrypt.compare(password, admin.password);
    }
    // Si las contraseña no coincide o no existe un usuario con el email proporcionado
    // lanzamos un error.
    if (!admin || !validPass) {
      invalidCredentialsError();
    }
    // Objeto con la información que queremos almacenar en el token.
    const tokenInfo = {
      id: admin.id,
    };
    // Creamos el token.
    const token = jwt.sign(tokenInfo, process.env.SECRET, {
      expiresIn: "30d",
    });
    res.send({
      status: "ok",
      message: "Administrador logueado correctamente",
      data: {
        token,
      },
    });
  } catch (err) {
    next(err);
  }
};

export default postLoginAdminController;
