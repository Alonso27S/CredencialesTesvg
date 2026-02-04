import { pool } from "../db.js";
import bcrypt from "bcryptjs";

export const cambiarPassword = async (req, res) => {
  const { passwordActual, passwordNueva } = req.body;
  const userId = req.user.id; // 👈 viene del token

  if (!passwordActual || !passwordNueva) {
    return res
      .status(400)
      .json({ message: "Datos incompletos" });
  }

  try {
    // 🔍 obtener contraseña actual
    const result = await pool.query(
      "SELECT contraseña FROM usuarios WHERE id = $1",
      [userId]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const passwordHash = result.rows[0].contraseña;

    // 🔐 comparar contraseña actual
    const match = await bcrypt.compare(passwordActual, passwordHash);

    if (!match) {
      return res
        .status(401)
        .json({ message: "Contraseña actual incorrecta" });
    }

    // 🔒 encriptar nueva contraseña
    const nuevaHash = await bcrypt.hash(passwordNueva, 10);

    // 💾 actualizar
    await pool.query(
      "UPDATE usuarios SET contraseña = $1 WHERE id = $2",
      [nuevaHash, userId]
    );

    return res.json({
      message: "Contraseña actualizada correctamente",
    });
  } catch (error) {
    console.error("❌ Error cambiar contraseña:", error);
    return res.status(500).json({
      message: "Error del servidor",
    });
  }
};
