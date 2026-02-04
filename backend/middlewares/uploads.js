// middlewares/upload.js
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Almacenamiento
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    if (file.fieldname === "foto") {
      cb(null, path.join(__dirname, "../uploads/fotos"));
    } else if (file.fieldname === "firma") {
      cb(null, path.join(__dirname, "../uploads/firmas"));
    }
  },
  filename: (req, file, cb) => {
    const unique = Date.now() + "-" + Math.round(Math.random() * 1E9) + "-" + file.originalname;
    cb(null, unique);
  },
});

// Validar solo imágenes
const fileFilter = (req, file, cb) => {
  const allowed = ["image/jpg", "image/jpeg", "image/png"];
  if (allowed.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Formato no permitido. Solo se permiten JPG, JPEG y PNG"), false);
  }
};

export const upload = multer({ 
  storage, 
  fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB límite
  }
});