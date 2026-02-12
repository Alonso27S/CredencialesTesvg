import nodemailer from "nodemailer";

export const enviarTokenCorreo = async (correo, token) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Sistema de Acceso <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Token de verificación",
      html: `
        <h2>Verificación de acceso</h2>
        <p>Tu token de acceso es:</p>
        <h1>${token}</h1>
        <p>Este token expira en <b>5 minutos</b>.</p>
        <p>Si no solicitaste este acceso, ignora este mensaje.</p>
      `,
    });

    console.log(" ✅ Token enviado correctamente");
  } catch (error) {
    console.error(" Error enviando correo:", error.message);
    throw new Error("No se pudo enviar el correo");
  }
};
export const enviarCredencialesCorreo = async (correo, nombreCompleto, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `Sistema de Acceso <${process.env.EMAIL_USER}>`,
      to: correo,
      subject: "Credenciales de acceso",
      html: `
        <h2>Bienvenido(a) ${nombreCompleto}</h2>

        <p> Tu usuario ha sido creado correctamente en el sistema.</p>

        <p><b>Usuario:</b> ${correo}</p>
        <p><b>Contraseña temporal:</b></p>
        <h1 style="letter-spacing:2px;">${password}</h1>

        <p> Por seguridad, te recomendamos cambiar tu contraseña al iniciar sesión.</p>

        <br>
        <p>Si no reconoces este registro, ignora este mensaje.</p>
      `,
    });

    console.log(" Credenciales enviadas por correo");
  } catch (error) {
    console.error("Error enviando credenciales:", error.message);
    throw new Error("No se pudo enviar el correo de credenciales");
  }
};
