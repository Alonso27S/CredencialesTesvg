import express from "express";

import { 
  getCounts, 
  getAlumnos, 
  getDocentes, 
  getAdministrativos 
} from "../controllers/dashboard.controller.js";

const router = express.Router();

router.get("/counts", getCounts);
router.get("/Alumnos", getAlumnos);
router.get("/Docentes", getDocentes);
router.get("/Administrativos", getAdministrativos);

export default router;
