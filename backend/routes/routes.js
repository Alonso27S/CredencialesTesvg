import express from "express";
import multer from "multer";

import { importarExcel } from "../controllers/importarExcel.controller.js";
import { obtenerImportados, eliminarImportado } from "../controllers/importacion.controller.js";



const router = express.Router();
const upload = multer();

router.post("/importar-excel", upload.single("file"), importarExcel);
router.get("/importados", obtenerImportados);
router.delete("/importados/:id", eliminarImportado);


export default router;
