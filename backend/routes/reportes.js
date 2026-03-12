import { Router } from "express";
import { getReportes } from "../controllers/reportes.controller.js";

const router = Router();

// endpoint
router.get("/", getReportes);

export default router;