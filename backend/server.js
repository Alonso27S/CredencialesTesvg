import express from "express";
import cors from "cors";
import registroRoutes from "./routes/registro.js";
import qrRoutes from "./routes/qr.routes.js";

import authRoutes from "./routes/auth.js";
import dashboardRoutes from "./routes/dashboard.routes.js";
import buscarRoutes from "./routes/buscar.routes.js";
import reportesRoutes from "./routes/reportes.routes.js";
import tokenRoutes from "./routes/token.routes.js";
import usuariosRoutes from "./routes/usuarios.routes.js";
import usuarioRoutes from "./routes/usuario.routes.js";
import gestorRoutes from "./routes/gestor.routes.js"
import gestoresRoutes from "./routes/gestores.routes.js";
import rutas from "./routes/routes.js";
import importacionRoutes from "./routes/importacion.routes.js";
import credencialRoutes from "./routes/credencial.routes.js";


import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(cors());
app.use(express.json());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api/usuarios", usuarioRoutes);
app.use("/api/gestores", gestoresRoutes);
app.use("/api", authRoutes);
app.use("/api", tokenRoutes); // <<--- CORRECTO
app.use("/api/registro", registroRoutes);
app.use("/api/qr", qrRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/buscar", buscarRoutes);
app.use("/api", reportesRoutes); // <<--- CORRECTO
app.use("/api/usuarios", usuariosRoutes);
app.use("/", rutas);
app.use("/api/importacion", importacionRoutes);
app.use("/api", gestorRoutes);
app.use("/api", qrRoutes);
app.use("/api/credencial", credencialRoutes);


app.use((req, res) => {
  res.status(404).json({ message: `Ruta ${req.originalUrl} no encontrada` });
});

// Error general
app.use((err, req, res, next) => {
  console.error(" Error en el servidor:", err);
  res.status(500).json({ message: "Error interno del servidor" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(` Servidor corriendo en http://localhost:${PORT}`);
});
