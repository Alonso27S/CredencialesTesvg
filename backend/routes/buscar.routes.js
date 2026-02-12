import express from "express";
import { buscarUsuario} from "../controllers/buscar.controller.js";

const router = express.Router();

router.get("/", buscarUsuario);


export default router;
