import { Router } from "express";
import { getReportes } from "../controllers/reportes.controller.js";

const router = Router();

router.get("/reportes", getReportes);

export default router;
