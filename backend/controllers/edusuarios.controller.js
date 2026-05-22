import { pool } from "../db.js";

export const actualizarUsuario = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      apellidop,
      apellidom,
      correo,
      numeroidentificador
    } = req.body;

    await pool.query(
      `
      UPDATE usuarios
      SET
        nombre = $1,
        apellidop = $2,
        apellidom = $3,
        correo = $4,
        numeroidentificador = $5
      WHERE id = $6
      `,
      [
        nombre,
        apellidop,
        apellidom,
        correo,
        numeroidentificador,
        id
      ]
    );

    res.json({
      success: true,
      message: "Usuario actualizado correctamente"
    });

  } catch (error) {

    console.error("Error actualizando usuario:", error);

    res.status(500).json({
      success: false,
      message: "Error interno del servidor"
    });

  }

};