import express from "express";
import { renovarCredencial, cambiarEstadoCredencial } from "../controllers/credencial.controller.js";

const router = express.Router();

router.put("/renovar/:id", renovarCredencial);
router.put("/estado/:id", cambiarEstadoCredencial);

export default router;
