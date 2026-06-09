import { pool } from "../db.js";
import bcrypt from "bcryptjs";

export const edusuarios = async (req, res) => {

  try {

    const { id } = req.params;

    const {
      nombre,
      apellidop,
      apellidom,
      correo,
      numeroidentificador,
      curp,
      rfc,
      tipopersona,
      nombrearea,
      puesto,
      tipoidentificador,
      nuevaPassword

    } = req.body;

    if (!nuevaPassword) {

    await pool.query(
      `
      UPDATE usuarios
      SET
        nombre = $1,
        apellidop = $2,
        apellidom = $3,
        correo = $4,
        numeroidentificador = $5,
        curp = $6,
        rfc = $7,
        tipopersona = $8,
        nombrearea = $9,
        puesto = $10,
        tipoidentificador = $11
        WHERE id = $12
        `,
      [
        nombre,
        apellidop,
        apellidom,
        correo,
        numeroidentificador,
        curp,
        rfc,
        tipopersona,
        nombrearea,
        puesto,
        tipoidentificador,
        id
        ]
      );
    } else {
      // Encriptar nueva contraseña
      const contraseña = await bcrypt.hash(
        nuevaPassword,
        10
      );

      await pool.query(
        `
        UPDATE usuarios
        SET
          nombre = $1,
          apellidop = $2,
          apellidom = $3,
          correo = $4,
          numeroidentificador = $5,
          curp = $6,
          rfc = $7,
          tipopersona = $8,
          nombrearea = $9,
          puesto = $10,
          tipoidentificador = $11,
          contraseña = $12
        WHERE id = $13
        `,
        [
          nombre,
          apellidop,
          apellidom,
          correo,
          numeroidentificador,
          curp,
          rfc,
          tipopersona,
          nombrearea,
          puesto,
          tipoidentificador,
          contraseña,
          id
        ]
      );

    }

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