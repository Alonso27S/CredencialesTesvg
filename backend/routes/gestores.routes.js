import { Router } from "express";
import {
  getGestores,
  deleteGestor,
  updateRolGestor
} from "../controllers/gestores.controller.js";

import { requireAdmin } from "../middlewares/requiereAdmin.js";
import { verificarToken } from "../middlewares/auth.middleware.js";

const router = Router();

// 🔹 Listar gestores
router.get("/", getGestores);

// 🔒 Editar rol (solo admin)
router.put("/:id/rol",verificarToken ,requireAdmin, updateRolGestor);

// 🔒 Eliminar gestor (solo admin)
router.delete("/:id",verificarToken, requireAdmin, deleteGestor);

export default router;
