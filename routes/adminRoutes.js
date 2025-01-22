import express from "express";
import {
  adminRegister,
  loginAdmin,
  validateToken,
} from "../controller/adminController.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = express.Router();

router.get("/", (req, res) => {
  res.send("Admin Route");
});

router.post("/signup", adminRegister);

router.post("/login", loginAdmin);

router.post("/validateToken", validateToken);

export default router;
