import express from "express";
import getTreatmentsController from "../controllers/getTreatmentsController.js";
import getAppointmentController from "../controllers/getAppointmentsController.js";
import getAdminController from "../controllers/getAdminController.js";
import postLoginAdminController from "../controllers/postLoginAdminController.js";

import authAdminController from "../middleware/authAdminController.js";
import getTimeAppointmentsController from "../controllers/getTimeAppointmentsController.js";

const router = express.Router();

router.get("/", getTreatmentsController);

router.get("/appointments", getAppointmentController);

router.get("/time-appointments", getTimeAppointmentsController);

//router.post("/booking-appointments", getTimeAppointmentsController);

////////////////////////// Admin routes ///////////////////////////

// ****************** GET route with auth ********************** //
router.get("/admin", authAdminController, getAdminController);

// ****************** Login of Admin *************************** //
router.post("/admin-login", postLoginAdminController);

export default router;
