import express from "express";
import getTreatmentsController from "../controllers/getTreatmentsController.js";
import getContactController from "../controllers/getContactControler.js";
import getAppointmentController from "../controllers/getAppointmentsController.js";
import getAdminController from "../controllers/getAdminController.js";
import postLoginAdminController from "../controllers/postLoginAdminController.js";

import authAdminController from "../middleware/authAdminController.js";

const router = express.Router();

router.get("/", getTreatmentsController);

router.get("/contact", getContactController);

router.get("/appointments", getAppointmentController);

////////////////////////// Admin routes ///////////////////////////

// ****************** GET route with auth ********************** //
router.get("/admin", authAdminController, getAdminController);

// ****************** Login of Admin *************************** //
router.post("/admin-login", postLoginAdminController);

export default router;
