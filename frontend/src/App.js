import React, { useState, useEffect } from "react";

// 🔑 Componentes principales
import Login from "./components/Login";
import VerificacionToken from "./pages/VerificarToken";
import { Routes, Route } from "react-router-dom";

// 📊 Dashboards según rol
import Dashboard from "./pages/Dashboard"; // Superadmin y Admin
import GestorDashboard from "./layouts/GestorDashboard"; // (reservado)
import UsuarioDashboard from "./layouts/UsuarioDashboard";

function App() {

  // ======================================================
  // 🔐 ESTADOS DE AUTENTICACIÓN
  // ======================================================
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userRole, setUserRole] = useState(null);

  // ======================================================
  // 👤 DATOS DEL USUARIO AUTENTICADO
  // ======================================================
  const [userData, setUserData] = useState({
    id: null,
    nombre: "",
    apellidop: "",
    apellidom: "",
    id_rol: null,
    correo: "",
    rol: null,
  });

  // ======================================================
  // 🔄 RESTAURAR SESIÓN AL RECARGAR (F5) ✅ FIX DEFINITIVO
  // ======================================================
  useEffect(() => {
    const usuarioGuardado = localStorage.getItem("usuario");

    if (!usuarioGuardado) return;

    try {
      const usuario = JSON.parse(usuarioGuardado);

      // 🛑 Validación mínima real
      if (!usuario.id || !usuario.id_rol) {
        localStorage.clear();
        return;
      }

      let rol = "usuario";
      if (usuario.id_rol === 1) rol = "superadmin";
      else if (usuario.id_rol === 2) rol = "admin";

      // 🔑 ACTIVAR SESIÓN
      setIsAuthenticated(true);
      setUserRole(rol);

      setUserData({
        id: usuario.id,
        nombre: usuario.nombre || "",
        apellidop: usuario.apellidop || "",
        apellidom: usuario.apellidom || "",
        puesto: usuario.puesto || "",
        nombrearea: usuario.nombrearea || "",
        numeroidentificador: usuario.numeroidentificador || "",
        fotourl: usuario.fotourl || "",
        firmaurl: usuario.firmaurl || "",
        rfc: usuario.rfc || "",
        curp: usuario.curp || "",
        correo: usuario.correo || "",
        qr: usuario.qr || "",
        fechaemision: usuario.fechaemision || "",
        fechavigencia: usuario.fechavigencia || "", 
        id_rol: usuario.id_rol,
        rol: rol,
      });

      console.log("🔁 Sesión restaurada desde localStorage");
    } catch (error) {
      console.error("❌ Error restaurando sesión:", error);
      localStorage.clear();
    }
  }, []);

  // ======================================================
  // 🔐 ESTADOS PARA VERIFICACIÓN POR TOKEN
  // ======================================================
  const [requiereToken, setRequiereToken] = useState(false);
  const [correoToken, setCorreoToken] = useState(null);

  // ======================================================
  // 🧪 DEBUG
  // ======================================================
  useEffect(() => {
    console.log("🔄 isAuthenticated:", isAuthenticated);
    console.log("🔄 userRole:", userRole);
    console.log("🔄 userData:", userData);
    console.log("🔄 requiereToken:", requiereToken);
  }, [isAuthenticated, userRole, userData, requiereToken]);

  // ======================================================
  // ✅ LOGIN FINAL
  // ======================================================
const handleLoginSuccess = (role, data) => {
  const normalizedRole = role?.toLowerCase().trim();

  // ✅ GUARDAR USUARIO PARA F5
  localStorage.setItem("usuario", JSON.stringify(data));

  setIsAuthenticated(true);
  setUserRole(normalizedRole);

  setUserData({
    id: data.id,
    numeroidentificador:
      data.numero_identificador ||
      data.numeroidentificador ||
      data.id,
    nombre: data.nombre || "",
    apellidop: data.apellidop || "",
    apellidom: data.apellidom || "",
    nombrearea: data.nombrearea || data.nombre_area || "",
    puesto: data.puesto || "",
    rfc: data.rfc || "",
    curp: data.curp || "",
    fechaemision: data.fechaemision || "",
    fechavigencia: data.fechavigencia || "",
    qr: data.qr || "",
    fotourl: data.fotourl || data.foto || "",
    firmaurl: data.firmaurl || "",
    correo: data.correo || "",
    id_rol: data.id_rol,
    rol: normalizedRole,
  });

  console.log("✅ Login exitoso");
};

  // ======================================================
  // 🔐 BACKEND EXIGE TOKEN
  // ======================================================
  const handleRequireToken = (correo) => {
    setCorreoToken(correo);
    setRequiereToken(true);
  };

  // ======================================================
  // 🔐 TOKEN VERIFICADO
  // ======================================================
  const handleTokenVerified = (data) => {
    let rol = "usuario";
    if (data.id_rol === 1) rol = "superadmin";
    else if (data.id_rol === 2) rol = "admin";

    setRequiereToken(false);
    handleLoginSuccess(rol, data);
  };

  // ======================================================
  // 🚪 LOGOUT
  // ======================================================
  const handleLogout = () => {
    localStorage.clear();

    setIsAuthenticated(false);
    setUserRole(null);
    setRequiereToken(false);
    setCorreoToken(null);

    setUserData({
      id: null,
      nombre: "",
      apellidop: "",
      apellidom: "",
      id_rol: null,
      correo: "",
      rol: null,
    });
  };

  // ======================================================
  // 🧭 RENDER PRINCIPAL
  // ======================================================
  return (

    <div>
      {requiereToken ? (
        <VerificacionToken
          correo={correoToken}
          onVerificado={handleTokenVerified}
        />
      ) : isAuthenticated ? (
        userRole === "superadmin" || userRole === "admin" ? (
          <Dashboard userData={userData} onLogout={handleLogout} />
        ) : (
          <UsuarioDashboard userData={userData} onLogout={handleLogout} />
        )
      ) : (
        <Login
          onLoginSuccess={handleLoginSuccess}
          onRequireToken={handleRequireToken}
        />
      )}
    </div>
  );
}

export default App;
