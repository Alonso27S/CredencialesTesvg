import express from "express";
import { verificarQR } from "../controllers/verificar.controller.js";

const router = express.Router();

router.post("/verificar", verificarQR);

export default router;