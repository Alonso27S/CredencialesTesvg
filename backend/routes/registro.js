// routes/registro.js
import express from "express";
import { upload } from "../middlewares/uploads.js";
import { registrarUsuario } from "../controllers/registro.controller.js";

const router = express.Router();

router.post(
  "/",
  upload.fields([
    { name: "foto", maxCount: 1 },
    { name: "firma", maxCount: 1 },
  ]),
  registrarUsuario
);


export default router;