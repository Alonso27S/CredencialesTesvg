import express from "express";
import { buscarUsuario, renovarCredencial} from "../controllers/buscar.controller.js";

const router = express.Router();

router.get("/", buscarUsuario);
router.put("/renovar/:id", renovarCredencial);

export default router;
