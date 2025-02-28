import jwt from "jsonwebtoken";
import {
  notAuthenticatedError,
  invalidCredentialsError,
} from "../utils/errorUtils.js";

const authAdminController = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if (!authorization) {
      throw notAuthenticatedError();
    }
    const token = authorization;
    if (!token) {
      throw notAuthenticatedError();
    }

    let tokenInfo;

    try {
      tokenInfo = jwt.verify(token, process.env.SECRET);
    } catch (err) {
      throw invalidCredentialsError();
    }

    req.admin = tokenInfo;

    next();
  } catch (err) {
    next(err);
  }
};

export default authAdminController;
