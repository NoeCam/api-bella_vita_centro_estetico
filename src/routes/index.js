import express from "express";
import getTreatmentsController from "../controllers/patients/getTreatmentsController.js";
import getTimeAppointmentsController from "../controllers/patients/getTimeAppointmentsController.js";
import postBookingAppointmentsController from "../controllers/patients/postBookingAppointmentController.js";

import authAdminController from "../middleware/authAdminController.js";
import postLoginAdminController from "../controllers/cosmetologist/postLoginAdminController.js";
import getAdminController from "../controllers/cosmetologist/getAdminController.js";
import getAllAdminsController from "../controllers/patients/getAllAdminsController.js";

const router = express.Router();

router.get("/", getTreatmentsController);

router.get("/appointments", getAllAdminsController);

router.get("/time-appointments", getTimeAppointmentsController);

router.post("/booking-appointments", postBookingAppointmentsController);

////////////////////////// Admin routes ///////////////////////////

// ****************** GET route with auth ********************** //
router.get("/admin", authAdminController, getAdminController);

// ****************** Login of Admin *************************** //
router.post("/admin-login", postLoginAdminController);

export default router;
