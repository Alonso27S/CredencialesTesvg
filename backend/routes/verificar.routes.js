import express from "express";
import { verificarQR } from "../controllers/verificar.controller.js";

const router = express.Router();

router.post("/verificar-credencial", verificarQR);

export default router;