import express from "express";

import {
  actualizarUsuario
} from "../controllers/edusuarios.controller.js";

const router = express.Router();

router.put("/:id", actualizarUsuario);

export default router;