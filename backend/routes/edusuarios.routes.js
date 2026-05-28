import express from "express";

import {
  edusuarios
} from "../controllers/edusuarios.controller.js";

const router = express.Router();

router.put("/:id", edusuarios);

export default router;