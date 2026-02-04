// routes/qr.routes.js
import { Router } from "express";
import { verificarQR } from "../controllers/qr.controller.js";

const router = Router();

router.post("/verificar", verificarQR);

export default router;