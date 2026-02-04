import React, { useEffect, useState } from "react";

/**
 * Componente Login
 * ----------------
 * Maneja:
 * - Animación de entrada
 * - Validación de formulario
 * - Login normal
 * - Login con verificación por token
 */
const Login = ({ onLoginSuccess, onRequireToken }) => {
  /* =========================
     ESTADOS
  ========================= */
  const [animate, setAnimate] = useState(false);     // Animación inicial
  const [loading, setLoading] = useState(false);     // Estado de carga
  const [correo, setCorreo] = useState("");          // Correo ingresado
  const [contraseña, setContraseña] = useState("");  // Contraseña ingresada

  /* =========================
     EFECTO DE ANIMACIÓN
  ========================= */
  useEffect(() => {
    const timer = setTimeout(() => setAnimate(true), 100);
    return () => clearTimeout(timer);
  }, []);

  /* =========================
     ENVÍO DEL FORMULARIO
  ========================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    /* ---- Validación básica ---- */
    if (!correo.trim() || !contraseña.trim()) {
      alert("Por favor, completa todos los campos");
      return;
    }

    /* ---- Validación de correo ---- */
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      alert("Correo inválido");
      return;
    }

    setLoading(true);

    try {
      /* ---- Petición al backend ---- */
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correo.trim(),
          contraseña,
        }),
      });

      const data = await response.json();

      /* =========================
         LOGIN CON TOKEN
      ========================= */
      if (data.requiereToken) {
        // Oculta parte del correo por seguridad
        const oculto = data.correo.replace(/^(.{2}).+(@.+)$/, "$1**$2");
        alert(`Se envió un token de verificación al correo ${oculto}`);

        // Redirige a la vista de verificación
        onRequireToken(data.correo);
        return; // ⬅ Detiene el flujo normal
      }

      /* =========================
         ERROR DE LOGIN
      ========================= */
      if (!response.ok) {
        alert(data.message || "Error en el login");
        return;
      }

      /* =========================
         LOGIN CORRECTO
      ========================= */

      // Determinar rol
      let rol = "usuario";
      if (data.id_rol === 1) rol = "superadmin";
      else if (data.id_rol === 2) rol = "admin";
      else if (data.id_rol === 3) rol = "usuario";

      /* ---- Usuario plano (frontend) ---- */
      const usuarioPlano = {
        id: data.user.id,
        nombre: data.user.nombre,
        apellidop: data.user.apellidop,
        apellidom: data.user.apellidom,
        puesto: data.user.puesto,
        nombrearea: data.user.nombrearea,
        numeroidentificador: data.user.numeroidentificador,
        fotourl: data.user.fotourl,
        firmaurl: data.user.firmaurl,
        rfc: data.user.rfc,
        curp: data.user.curp,
        correo: data.user.correo,
        id_rol: data.user.id_rol,
      };

      /* ---- Guardar sesión ---- */
      localStorage.setItem("usuario", JSON.stringify(usuarioPlano));
      localStorage.setItem("id_usuario", data.id_usuario);
      localStorage.setItem("id_rol", data.id_rol);

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      // Redirección final
      onLoginSuccess(rol, data.user);

    } catch (error) {
      console.error("Error en login:", error);
      alert("Error de conexión con el servidor");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RENDER
  ========================= */
  return (
    <div className="min-h-screen flex flex-col bg-gray-100 overflow-hidden">
      
      {/* ================= HEADER ================= */}
      <header className="fixed top-0 left-0 w-full bg-white shadow-md z-50">
        <div className="grid grid-cols-3 items-center px-4 py-3">
          <img src="/assets/logo_gobierno.png" alt="Gobierno" className="h-10" />
          <img src="/assets/logo_tesvg2.png" alt="TESVG" className="h-10 mx-auto" />
          <img src="/assets/logo_tecnm.png" alt="TecNM" className="h-10 ml-auto" />
        </div>
      </header>

      {/* ================= MAIN ================= */}
      <main className="flex-grow flex items-center justify-center px-4 py-32 mt-[120px]">

        {/* Imagen */}
        <div
          className={`hidden md:flex w-1/2 justify-center transition-all duration-1000 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <img src="/assets/logo_tesvg.png" alt="TESVG" className="w-80" />
        </div>

        {/* Formulario */}
        <div
          className={`w-full md:w-1/2 bg-white shadow-xl rounded-2xl p-8 transition-all duration-1000 delay-200 ${
            animate ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
        >
          <h2 className="text-2xl font-bold text-center mb-6">
            Sistema de Control de Acceso
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Correo */}
            <input
              type="email"
              placeholder="Correo electrónico"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md"
            />

            {/* Contraseña */}
            <input
              type="password"
              placeholder="Contraseña"
              value={contraseña}
              onChange={(e) => setContraseña(e.target.value)}
              disabled={loading}
              className="w-full px-4 py-2 border rounded-md"
            />

            {/* Botón */}
            <button
              type="submit"
              disabled={loading}
              className="w-full text-white font-semibold py-2 rounded-md"
              style={{ backgroundColor: loading ? "#9E9E9E" : "#8A2136" }}
            >
              {loading ? "Cargando..." : "Iniciar sesión"}
            </button>
          </form>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="px-4 py-3 flex items-center space-x-4 bg-[#8A2136] text-white">
        <img src="/assets/logo_gobiernob.png" alt="Footer" className="h-10" />
        <p className="text-xs">
          Carretera Toluca - Ixtapan Km 64.5 · Villa Guerrero · (714) 146 1465
        </p>
      </footer>
    </div>
  );
};

export default Login;
