import express from "express";
import getHomeController from "../controllers/getHomeController.js";
import getContactController from "../controllers/getContactControler.js";
import getAppointmentController from "../controllers/getAppointmentsController.js";
import getAdminController from "../controllers/getAdminController.js";

const router = express.Router();

router.get("/", getHomeController);

router.get("/contact", getContactController);

router.get("/appointments", getAppointmentController);

router.get("/admin", getAdminController);

export default router;
