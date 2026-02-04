import { Router } from "express";
import { crearGestor } from "../controllers/gestor.controller.js";

const router = Router();
router.post("/gestores", crearGestor);

export default router;
