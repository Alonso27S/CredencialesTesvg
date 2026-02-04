import express from "express";
import { verificarToken } from "../controllers/token.controller.js";

const router = express.Router();

// POST /api/verificartoken
router.post("/verificartoken", verificarToken);

export default router;
