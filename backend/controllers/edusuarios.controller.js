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

    // Validar correo
  const correoRegex =
    /^[a-zA-Z0-9._%+-]+@villaguerrero\.tecnm\.mx$/;
    
  const nombreRegex = 
    /^[A-Za-zÁÉÍÓÚáéíóúÑñÜü\s'-]{2,50}$/;
 
 const contieneHTML = /<[^>]*>/;

    if (!nombreRegex.test(nombre)) {
        return res.status(400).json({
          success: false,
          message: "Nombre inválido"
        });
    }

    if (nombre  > 60 ) {
      return res.status(400).json (
        {
          sucess: false,
          message: "El nombre es demasiado largo"
        });
      
    }

    if (contieneHTML.test(nombre)) {
  return res.status(400).json({
    success: false,
    message: "Caracteres no permitidos"
  });
}

    if (!correoRegex.test(correo)) {
      return res.status(400).json({
        success: false,
        message:
          "Solo se permite correo institucional @villaguerrero.tecnm.mx"
    });
  }


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


    // Validar complejidad de contraseña
       
    const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&.#_-])[A-Za-z\d@$!%*?&.#_-]{8,20}$/;
      

    if (!passwordRegex.test(nuevaPassword)) {
      return res.status(400).json({
        success: false,
        message:
          "La contraseña debe tener mínimo 8 caracteres, una mayúscula, una minúscula y un número."
    });
  }

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