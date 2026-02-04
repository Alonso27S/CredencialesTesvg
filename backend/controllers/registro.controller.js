// controllers/registro.controller.js
import { pool } from "../db.js";
import bcrypt from "bcryptjs";
import { crearRegistro } from "./registro.auto.controller.js";
import { crearCredencial } from "./credencial.controller.js";
import { enviarCredencialesCorreo } from "../utils/mailer.js";

export const registrarUsuario = async (req, res) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    console.log("📥 Body recibido:", req.body);
    console.log("📁 Archivos recibidos:", req.files);

    const {
      nombre,
      apellidop,
      apellidom,
      tipoIdentificador,
      numeroIdentificador,
      rfc,
      curp,
      puesto,
      tipoPersona,
      nombreArea,
      correo,
      id_rol = 3,
      esUsuarioInicial,
    } = req.body;

    // 📌 Rutas de archivos
    const fotoUrl = req.files?.foto
      ? `/uploads/fotos/${req.files.foto[0].filename}`
      : null;

    const firmaUrl = req.files?.firma
      ? `/uploads/firmas/${req.files.firma[0].filename}`
      : null;

    // 📌 Generar contraseña
    const contraseña = generarContraseñaLegible();
    const hashedPassword = await bcrypt.hash(contraseña, 10);

    // 1️⃣ CREAR USUARIO
    const usuarioResult = await client.query(
      `INSERT INTO usuarios (
        nombre, apellidop, apellidom, tipoidentificador, numeroidentificador,
        rfc, curp, fotourl, firmaurl, puesto, tipopersona,
        nombrearea, correo, contraseña, id_rol, esusuarioinicial
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16)
      RETURNING id`,
      [
        nombre,
        apellidop,
        apellidom,
        tipoIdentificador,
        numeroIdentificador,
        rfc,
        curp,
        fotoUrl,
        firmaUrl,
        puesto,
        tipoPersona,
        nombreArea,
        correo,
        hashedPassword,
        id_rol,
        esUsuarioInicial === "true",
      ],
    );

    const userId = usuarioResult.rows[0].id;
    console.log("✅ Usuario creado:", userId);

    // 2️⃣ CREAR REGISTRO
    const idRegistro = await crearRegistro(client, userId);
    console.log("📝 Registro creado:", idRegistro);

    // 3️⃣ CREAR CREDENCIAL con datos del usuario
    const datosUsuario = {
      nombre,
      apellidop,
      apellidom,
      numeroidentificador: numeroIdentificador,
      userId,
    };

    const credencialInfo = await crearCredencial(
      client,
      idRegistro,
      datosUsuario,
    );
    console.log("🪪 Credencial creada:", credencialInfo.idCredencial);

    await client.query("COMMIT");
    const nombreCompleto = `${nombre} ${apellidop} ${apellidom}`;

    await enviarCredencialesCorreo(correo, nombreCompleto, contraseña);

    // 📌 RESPUESTA
    res.json({
      success: true,
      message: "Usuario, registro y credencial creados correctamente",
      userId,
      registroId: idRegistro,
      credencialId: credencialInfo.idCredencial,
      qrEncriptado: credencialInfo.qrEncriptado, // Opcional: devolver QR
      passwordGenerada: contraseña,
      correo,
    });

    //
  } catch (error) {
    await client.query("ROLLBACK");

    // 🟥 Correo duplicado
    if (
      error.code === "23505" &&
      error.constraint === "usuarios_correo_unique"
    ) {
      return res.status(409).json({
        success: false,
        field: "correo",
        message: "El correo ya está registrado",
      });
    }

    console.error("❌ Error en registro:", error);

    res.status(500).json({
      success: false,
      message: "Error al registrar usuario",
    });
  }
};

// 📌 FUNCIÓN CONTRASEÑA
function generarContraseñaLegible() {
  const caracteres = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let contraseña = "";

  for (let i = 0; i < 8; i++) {
    contraseña += caracteres.charAt(
      Math.floor(Math.random() * caracteres.length),
    );
  }

  return contraseña;
}
