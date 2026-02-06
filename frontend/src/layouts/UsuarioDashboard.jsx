import React, { useState, useRef, useEffect } from "react";
import {
  Bell,
  User,
  Download,
  KeyRound,
  LogOut,
  Phone,
  X,
} from "lucide-react";

import CredencialFront from "../pages/CredencialFrontOficial";
import CredencialBack from "../pages/CredencialBackOficial";
import html2canvas from "html2canvas/dist/html2canvas.min.js";

const BASE_URL = "https://credencialestesvg.com.mx";

const UsuarioDashboard = ({ userData }) => {
  const usuario = userData;

  const [vista, setVista] = useState("front");
  const refCredencial = useRef(null);

  // 🔹 menú usuario
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  // 🔐 modal cambiar contraseña
  const [modalPassOpen, setModalPassOpen] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);

  // 🧠 cerrar menú al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!usuario) {
    return (
      <div className="flex items-center justify-center h-screen">
        Cargando usuario...
      </div>
    );
  }

  const datosCredencial = {
    nombre: usuario.nombre || "",
    apellidop: usuario.apellidop || "",
    apellidom: usuario.apellidom || "",
    nombrearea: usuario.nombrearea || "",
    numeroidentificador: usuario.numeroidentificador || "",
    fotourl: usuario.fotourl || "",
    firmaurl: usuario.firmaurl || "",
    qr: usuario.qr || "",
    rfc: usuario.rfc || "",
    curp: usuario.curp || "",
    fechaemision: usuario.fechaemision || "",
    fechavigencia: usuario.fechavigencia || "",
  };

  // 📥 Descargar credencial
  const handleDownload = async () => {
    const canvas = await html2canvas(refCredencial.current, {
      scale: 4,
      useCORS: true,
      backgroundColor: "#FFFFFF",
    });

    const img = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = img;
    link.download = "credencial.png";
    link.click();
  };

  // 🔐 cambiar contraseña (REAL)
  const handleSubmitPassword = async () => {
    setErrorPass("");

    if (!passwordActual || !passwordNueva || !passwordConfirm) {
      return setErrorPass("Todos los campos son obligatorios");
    }

    if (passwordNueva.length < 8) {
      return setErrorPass("La nueva contraseña debe tener al menos 8 caracteres");
    }

    if (passwordNueva !== passwordConfirm) {
      return setErrorPass("Las contraseñas no coinciden");
    }

    try {
      setLoadingPass(true);

      
      const res = await fetch(`${BASE_URL}/api/usuarios/cambiar-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          passwordActual,
          passwordNueva,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.message);
     
      console.log("Contraseña actual:", passwordActual);
      console.log("Nueva contraseña:", passwordNueva);

      // ✅ éxito
      setModalPassOpen(false);
      setPasswordActual("");
      setPasswordNueva("");
      setPasswordConfirm("");
      alert("Contraseña actualizada correctamente");

    } catch (err) {
      setErrorPass(err.message || "Error al cambiar contraseña");
    } finally {
      setLoadingPass(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* HEADER */}
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        <div className="grid grid-cols-3 items-center px-4 py-3">
          <img src="/assets/logo_gobierno.png" className="h-12" alt="" />
          <h1 className="text-center font-bold text-lg">
            Tecnológico de Estudios Superiores
            <br /> de Villa Guerrero
          </h1>
          <div className="flex justify-end gap-2">
            <img src="/assets/logo_tesvg2.png" className="h-12" alt="" />
            <img src="/assets/logo_tecnm.png" className="h-12" alt="" />
          </div>
        </div>

        <div className="flex justify-between px-6 py-3 text-white bg-[#8A2136]">
          <h2 className="font-semibold">PANEL DEL USUARIO</h2>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex flex-col text-right text-xs">
              <span className="font-semibold">
                {usuario.nombre} {usuario.apellidop} {usuario.apellidom}
              </span>
              <span className="italic text-[10px]">
                {usuario.nombrearea}
              </span>
            </div>

            <Bell />

            <div className="relative" ref={userMenuRef}>
              <User
                className="cursor-pointer"
                onClick={() => setUserMenuOpen(!userMenuOpen)}
              />

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-black rounded-lg shadow-xl z-50">
                  <button
                    onClick={() => {
                      setModalPassOpen(true);
                      setUserMenuOpen(false);
                    }}
                    className="flex gap-2 px-4 py-3 hover:bg-gray-100 w-full text-sm"
                  >
                    <KeyRound size={16} /> Cambiar contraseña
                  </button>

                  <button className="flex gap-2 px-4 py-3 hover:bg-gray-100 w-full text-sm">
                    <Phone size={16} /> Contactos
                  </button>

                  <hr />

                  <button
                    onClick={handleLogout}
                    className="flex gap-2 px-4 py-3 hover:bg-red-50 text-red-600 w-full text-sm"
                  >
                    <LogOut size={16} /> Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO */}
      <main className="flex-1 mt-[140px] p-6">
        <div className="bg-white p-8 rounded-xl text-center">
          <h1 className="text-2xl font-bold text-[#8A2136]">
            Credencial Institucional
          </h1>

          <div className="flex justify-center gap-4 mt-6">
            <button onClick={() => setVista("front")}>Frontal</button>
            <button onClick={() => setVista("back")}>Trasera</button>
          </div>

          <div ref={refCredencial} className="flex justify-center mt-8">
            {vista === "front" ? (
              <CredencialFront datos={datosCredencial} />
            ) : (
              <CredencialBack datos={datosCredencial} />
            )}
          </div>

          <button
            onClick={handleDownload}
            className="mt-6 bg-[#8A2136] text-white px-6 py-2 rounded"
          >
            <Download className="inline mr-2" />
            Descargar Credencial
          </button>
        </div>
      </main>

      {/* 🔐 MODAL CAMBIAR CONTRASEÑA */}
      {modalPassOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl w-full max-w-md p-6 relative">
            <button
              onClick={() => setModalPassOpen(false)}
              className="absolute top-3 right-3"
            >
              <X />
            </button>

            <h2 className="text-xl font-bold mb-4 text-[#8A2136]">
              Cambiar contraseña
            </h2>

            {errorPass && (
              <div className="bg-red-100 text-red-700 p-2 rounded mb-3 text-sm">
                {errorPass}
              </div>
            )}

            <input
              type="password"
              placeholder="Contraseña actual"
              className="w-full border p-2 rounded mb-3"
              value={passwordActual}
              onChange={(e) => setPasswordActual(e.target.value)}
            />

            <input
              type="password"
              placeholder="Nueva contraseña"
              className="w-full border p-2 rounded mb-3"
              value={passwordNueva}
              onChange={(e) => setPasswordNueva(e.target.value)}
            />

            <input
              type="password"
              placeholder="Confirmar nueva contraseña"
              className="w-full border p-2 rounded mb-4"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
            />

            <button
              onClick={handleSubmitPassword}
              disabled={loadingPass}
              className="bg-[#8A2136] text-white w-full py-2 rounded"
            >
              {loadingPass ? "Guardando..." : "Cambiar contraseña"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UsuarioDashboard;
