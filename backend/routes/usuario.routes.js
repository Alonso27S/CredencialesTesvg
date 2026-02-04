import express from "express";
import { cambiarPassword } from "../controllers/usuario.controller.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = express.Router();

// 🔐 cambiar contraseña (usuario autenticado)
router.post("/cambiar-password", verificarToken, cambiarPassword);

export default router;
