// 📦 Conexión a la base de datos PostgreSQL
import { pool } from "../db.js";

// 🔐 Librería para comparar contraseñas encriptadas
import bcrypt from "bcryptjs";

// 🔑 Generador de token para autenticación en dos pasos (2FA)
import { generarToken } from "../utils/token.js";

// 📧 Función para enviar el token por correo
import { enviarTokenCorreo } from "../utils/mailer.js";

/**
 * CONTROLADOR DE LOGIN
 * -------------------
 * Flujo general:
 * 1. Verifica que el usuario exista
 * 2. Revisa si está bloqueado
 * 3. Valida contraseña
 * 4. Maneja intentos fallidos y bloqueos
 * 5. Genera token 2FA y lo envía por correo
 */
export const login = async (req, res) => {
  try {
    /* =========================
       DATOS DEL FRONTEND
    ========================= */
    const { correo, contraseña } = req.body;

    /* =========================
       BUSCAR USUARIO
    ========================= */
    const result = await pool.query(
      "SELECT * FROM usuarios WHERE correo = $1",
      [correo.trim()]
    );

    // ❌ Usuario no existe
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const user = result.rows[0];

    /* =========================
       VALIDAR BLOQUEO
    ========================= */
    // Si bloqueado_hasta existe y es mayor a la fecha actual → bloqueado
    if (user.bloqueado_hasta && new Date(user.bloqueado_hasta) > new Date()) {
      return res.status(403).json({
        message: "Usuario bloqueado. Intenta más tarde.",
      });
    }

    /* =========================
       VALIDAR CONTRASEÑA
    ========================= */
    const passwordOK = await bcrypt.compare(
      contraseña,
      user.contraseña
    );

    // ❌ Contraseña incorrecta
    if (!passwordOK) {
      let intentos = user.intentos_fallidos + 1;
      let bloqueo = null;

      // 🔒 Lógica de bloqueo progresivo
      if (intentos === 3) {
        // Bloqueo de 3 minutos
        bloqueo = new Date(Date.now() + 3 * 60 * 1000);
      } else if (intentos > 3) {
        // Bloqueo de 5 minutos
        bloqueo = new Date(Date.now() + 5 * 60 * 1000);
      }

      // Actualizar intentos y bloqueo
      await pool.query(
        `UPDATE usuarios 
         SET intentos_fallidos = $1,
             bloqueado_hasta = $2
         WHERE id = $3`,
        [intentos, bloqueo, user.id]
      );

      return res.status(401).json({
        message: "Credenciales incorrectas",
      });
    }

    /* =========================
       LOGIN CORRECTO
    ========================= */

    // 🔄 Resetear intentos y bloqueo
    await pool.query(
      `UPDATE usuarios 
       SET intentos_fallidos = 0,
           bloqueado_hasta = NULL
       WHERE id = $1`,
      [user.id]
    );

    /* =========================
       AUTENTICACIÓN 2FA
    ========================= */

    // Generar token de 6 dígitos (u otro formato)
    const token = generarToken();

    // Tiempo de expiración: 5 minutos
    const expira = new Date(Date.now() + 5 * 60 * 1000);

    // Guardar token y expiración en BD
    await pool.query(
      `UPDATE usuarios 
       SET token_2fa = $1,
           token_expira = $2
       WHERE id = $3`,
      [token, expira, user.id]
    );

    // 📧 Enviar token al correo del usuario
    await enviarTokenCorreo(user.correo, token);

    /* =========================
       RESPUESTA AL FRONTEND
    ========================= */
    res.json({
      requiereToken: true, // El frontend sabe que debe pedir el token
      correo: user.correo,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellidop: user.apellidop,
        apellidom: user.apellidom,
        puesto: user.puesto,
        nombrearea: user.nombrearea,
        numeroidentificador: user.numeroidentificador,
        fotourl: user.fotourl,
        firmaurl: user.firmaurl,
        rfc: user.rfc,
        curp: user.curp,
        id_rol: user.id_rol,
        correo: user.correo,
      },
    });

  } catch (error) {
    // ❌ Error inesperado
    console.error("❌ Error login:", error);
    res.status(500).json({ message: "Error en servidor" });
  }
};
