import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { enviarCredencialesCorreo } from "../utils/mailer.js";

// 🔑 Generar contraseña automática
const generarPassword = () => {
  return crypto.randomBytes(4).toString("hex");
};

export const crearGestor = async (req, res) => {
  try {
    const {
      nombre,
      apellidoPaterno,
      apellidoMaterno,
      tipoIdentificador,
      numeroIdentificador,
      rfc,
      curp,
      puesto,
      nombreArea,
      correo,
      activo = true,
      id_rol = 2,
      esusuarioinicial = false,
    } = req.body;

    // 🔒 Validar tipo identificador (CHECK BD)
    const tiposValidos = ["Numero de Control", "Matricula"];
    if (!tiposValidos.includes(tipoIdentificador)) {
      return res.status(400).json({
        ok: false,
        mensaje: "Tipo de identificador inválido",
      });
    }

    // 🔒 Evitar correo duplicado
    const existeCorreo = await pool.query(
      "SELECT 1 FROM usuarios WHERE correo = $1",
      [correo]
    );

    if (existeCorreo.rowCount > 0) {
      return res.status(400).json({
        ok: false,
        mensaje: "El correo ya está registrado",
      });
    }

    // 🔑 Contraseña automática
    const passwordPlano = generarPassword();
    const passwordHash = await bcrypt.hash(passwordPlano, 10);

    // 🧾 Insertar usuario
    await pool.query(
      `
      INSERT INTO usuarios (
        nombre, apellidop, apellidom,
        tipoidentificador, numeroidentificador,
        rfc, curp, puesto, nombrearea,
        correo, "contraseña",
        creado_en, activo, id_rol, esusuarioinicial
      )
      VALUES (
        $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,
        NOW(),$12,$13,$14
      )
      `,
      [
        nombre,
        apellidoPaterno,
        apellidoMaterno,
        tipoIdentificador,
        numeroIdentificador,
        rfc,
        curp,
        puesto,
        nombreArea,
        correo,
        passwordHash,
        activo,
        id_rol,
        esusuarioinicial,
      ]
    );

    // 📧 ENVIAR CREDENCIALES
    const nombreCompleto = `${nombre} ${apellidoPaterno} ${apellidoMaterno}`;
    await enviarCredencialesCorreo(
      correo,
      nombreCompleto,
      passwordPlano
    );

    res.status(201).json({
      ok: true,
      mensaje: "Gestor creado y credenciales enviadas al correo",
    });

  } catch (error) {
    console.error("❌ Error:", error.message);

    res.status(500).json({
      ok: false,
      mensaje: "Error al crear gestor",
    });
  }
};
