import express from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello, world!");
});

router.get("/contact", (req, res) => {
  res.send("You can see us in our office.");
});

router.get("/appointments", (req, res) => {
  res.send("You can take an appointments with us.");
});

router.get("/admin", (req, res) => {
  res.send("Route of admins.");
});

export default router;
