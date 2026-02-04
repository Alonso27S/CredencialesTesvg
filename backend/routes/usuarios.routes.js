import express from "express";
import {
  getUsuarioById,
  completarPerfil
} from "../controllers/usuarios.controller.js";

const router = express.Router();

router.get("/:id", getUsuarioById);
router.put("/:id", completarPerfil);

export default router;
