import React, { useState, useRef, useEffect } from "react";
import { Bell, User, Download, KeyRound, LogOut, Phone, X } from "lucide-react";
import jsPDF from "jspdf";

import CredencialFront from "../pages/CredencialFrontOficial";
import CredencialBack from "../pages/CredencialBackOficial";
import html2canvas from "html2canvas/dist/html2canvas.min.js";

const BASE_URL = "https://meztlitech.site";

const UsuarioDashboard = ({ userData }) => {
  const usuario = userData;

  const [vista, setVista] = useState("front");

  const [modalCredencialOpen, setModalCredencialOpen] = useState(false);
  
  const refFront = useRef(null);
  const refBack = useRef(null);

  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const userMenuRef = useRef(null);

  const [modalPassOpen, setModalPassOpen] = useState(false);
  const [passwordActual, setPasswordActual] = useState("");
  const [passwordNueva, setPasswordNueva] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [errorPass, setErrorPass] = useState("");
  const [loadingPass, setLoadingPass] = useState(false);

  // NUEVO: Estados para el modal de descarga
  const [modalDescargaOpen, setModalDescargaOpen] = useState(false);
  const [descargando, setDescargando] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target)) {
        setUserMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
    nss: usuario.nss || "",
    tipopersona: usuario.tipopersona || usuario.tipopersona || "",
    fechaemision: usuario.fechaemision || "",
    fechavigencia: usuario.fechavigencia || "",
  };

  // MODIFICADO: Función que recibe la opción seleccionada
  const handleDownload = async (opcion) => {
    setDescargando(true);

    const options = { 
      scale: 3,
      useCORS: true,
      backgroundColor: "#FFFFFF"
    };

    // CONFIGURACIÓN DE MARGEN Y ESPACIOS
    const MARGEN = 40; // Margen blanco alrededor
    const ESPACIO_ENTRE = 30; // Espacio entre frontal y trasera

    try {
      let canvas;
      let nombreArchivo;

      if (opcion === "frontal") {
        // Capturar frontal
        setVista("front");
        await new Promise(resolve => setTimeout(resolve, 150));
        const frontCanvas = await html2canvas(refFront.current, options);
        
        canvas = document.createElement('canvas');
        canvas.width = ANCHO_BASE;
        canvas.height = ALTO_BASE;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, ANCHO_BASE, ALTO_BASE);
        
        const espacioAncho = ANCHO_BASE - (MARGEN * 2);
        const espacioAlto = ALTO_BASE - (MARGEN * 2);
        const proporcionOriginal = frontCanvas.width / frontCanvas.height;
        
        let drawWidth, drawHeight;
        if (proporcionOriginal > (espacioAncho / espacioAlto)) {
          drawWidth = espacioAncho;
          drawHeight = espacioAncho / proporcionOriginal;
        } else {
          drawHeight = espacioAlto;
          drawWidth = espacioAlto * proporcionOriginal;
        }
        
        const xOffset = (ANCHO_BASE - drawWidth) / 2;
        const yOffset = (ALTO_BASE - drawHeight) / 2;
        
        ctx.drawImage(frontCanvas, xOffset, yOffset, drawWidth, drawHeight);
        
        nombreArchivo = `credencial_frontal_${usuario.numeroidentificador || 'usuario'}`;

      } else if (opcion === "trasera") {
        // Capturar trasera
        setVista("back");
        await new Promise(resolve => setTimeout(resolve, 150));
        const backCanvas = await html2canvas(refBack.current, options);
        
        canvas = document.createElement('canvas');
        canvas.width = ANCHO_BASE;
        canvas.height = ALTO_BASE;
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, ANCHO_BASE, ALTO_BASE);
        
        const espacioAncho = ANCHO_BASE - (MARGEN * 2);
        const espacioAlto = ALTO_BASE - (MARGEN * 2);
        const proporcionOriginal = backCanvas.width / backCanvas.height;
        
        let drawWidth, drawHeight;
        if (proporcionOriginal > (espacioAncho / espacioAlto)) {
          drawWidth = espacioAncho;
          drawHeight = espacioAncho / proporcionOriginal;
        } else {
          drawHeight = espacioAlto;
          drawWidth = espacioAlto * proporcionOriginal;
        }
        
        const xOffset = (ANCHO_BASE - drawWidth) / 2;
        const yOffset = (ALTO_BASE - drawHeight) / 2;
        
        ctx.drawImage(backCanvas, xOffset, yOffset, drawWidth, drawHeight);
        
        nombreArchivo = `credencial_trasera_${usuario.numeroidentificador || 'usuario'}`;

      } else {
        // Capturar ambas
        setVista("front");
        await new Promise(resolve => setTimeout(resolve, 150));
        const frontCanvas = await html2canvas(refFront.current, options);
        
        setVista("back");
        await new Promise(resolve => setTimeout(resolve, 150));
        const backCanvas = await html2canvas(refBack.current, options);
        
        // crea iamgen horizontal 
        
        canvas = document.createElement('canvas');
        canvas.width = frontCanvas.width + backCanvas.width + ESPACIO_ENTRE + (MARGEN * 2);
        canvas.height = Math.max(frontCanvas.height, backCanvas.height) + (MARGEN * 2);
        
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        //dibuja frontal a la izquierda
        
        ctx.drawImage(frontCanvas, MARGEN, MARGEN);

         // Dibujar trasera a la derecha (con espacio entre)
        ctx.drawImage(backCanvas, frontCanvas.width + MARGEN + ESPACIO_ENTRE, MARGEN);nombreArchivo = `credencial_completa_${usuario.numeroidentificador || 'usuario'}`;
      }

      // Descargar
      const link = document.createElement('a');
      link.download = `${nombreArchivo}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      setModalDescargaOpen(false);
      setDescargando(false);

    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Error al descargar la credencial. Intenta de nuevo.");
      setDescargando(false);
    }
  };   

  const handleSubmitPassword = async () => {
    setErrorPass("");

    if (!passwordActual || !passwordNueva || !passwordConfirm) {
      return setErrorPass("Todos los campos son obligatorios");
    }

    if (passwordNueva.length < 8) {
      return setErrorPass(
        "La nueva contraseña debe tener al menos 8 caracteres",
      );
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
        {/* Grid Responsive */}
        <div className="grid grid-cols-1 sm:grid-cols-3 items-center px-4 py-3 gap-2 text-center sm:text-left">
          <div className="flex justify-center sm:justify-start">
            <img src="/assets/logo_gobierno.png" className="h-10 sm:h-12" alt="" />
          </div>

          <h1 className="font-bold text-sm sm:text-lg leading-tight px-2">
            Tecnológico de Estudios Superiores
            <br className="hidden sm:block" />
            de Villa Guerrero
          </h1>

          <div className="flex justify-center sm:justify-end gap-2">
            <img src="/assets/logo_tesvg2.png" className="h-10 sm:h-12" alt="" />
            <img src="/assets/logo_tecnm.png" className="h-10 sm:h-12" alt="" />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:justify-between items-center px-4 sm:px-6 py-2 sm:py-3 text-white bg-[#8A2136] gap-2">
          <h2 className="font-semibold">PANEL DEL USUARIO</h2>

          <div className="flex items-center gap-4">
            <div className="flex flex-col text-center sm:text-right text-[10px] sm:text-xs">
              <span className="font-semibold">
                {usuario.nombre} {usuario.apellidop} {usuario.apellidom}
              </span>
              <span className="italic text-[10px]">{usuario.nombrearea}</span>
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
      <main className="flex-1 mt-[180px] sm:mt-[140px] p-3 sm:p-6">
        <div className="bg-white p-4 sm:p-8 rounded-xl text-center">
          <h1 className="text-xl sm:text-2xl font-bold text-[#8A2136]">
            Credencial Institucional
          </h1>

          <div className="flex justify-center gap-4 mt-6 flex-wrap">
            <button onClick={() => setVista("front")}>Frontal</button>
            <button onClick={() => setVista("back")}>Trasera</button>
          </div>

          <div className="flex justify-center mt-6 sm:mt-8 overflow-x-auto cursor-pointer"
            onClick={() => setModalCredencialOpen(true)}
          >
            <div
              ref={refFront}
              className={`${vista === "front" ? "block" : "absolute -left-[9999px]"}`}
            >
              <CredencialFront datos={datosCredencial} />
            </div>

            <div
              ref={refBack}
              className={`${vista === "back" ? "block" : "absolute -left-[9999px]"}`}
            >
              <CredencialBack datos={datosCredencial} />
            </div>
          </div>

          {/* NUEVO: Botón único que abre el modal de descarga */}
          <button
            onClick={() => setModalDescargaOpen(true)}
            className="mt-6 bg-[#8A2136] text-white px-6 py-2 rounded hover:bg-[#6a1a2b] transition-colors"
          >
            <Download className="inline mr-2" />
            Descargar Credencial
          </button>
        </div>
      </main>

      {/* ==========================================
          MODAL CREDENCIAL PANTALLA COMPLETA
      ========================================== */}
      {modalCredencialOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setModalCredencialOpen(false)}
        >
          <button
            onClick={() => setModalCredencialOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <X size={36} />
          </button>

          <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] max-w-[90vw] flex items-center justify-center"
          >
            <div
              style={{
                transform: "scale(1.6)",
                transformOrigin: "center center",
              }}
            >
              {vista === "front" ? (
                <CredencialFront datos={datosCredencial} />
              ) : (
                <CredencialBack datos={datosCredencial} />
              )}
            </div>
          </div>
        </div>
      )}

      {/* ==========================================
          NUEVO MODAL DE DESCARGA
      ========================================== */}
      {modalDescargaOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setModalDescargaOpen(false)}
        >
          <div
            className="bg-white rounded-xl w-full max-w-md p-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setModalDescargaOpen(false)}
              className="absolute top-3 right-3 hover:text-gray-600"
            >
              <X size={24} />
            </button>

            <h2 className="text-xl font-bold mb-4 text-[#8A2136] text-center">
              Descargar Credencial
            </h2>

            <p className="text-gray-600 text-center mb-6">
              Selecciona la opción que deseas descargar
            </p>

            <div className="space-y-3">
              <button
                onClick={() => handleDownload("frontal")}
                disabled={descargando}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Credencial Frontal</span>
                <Download size={20} />
              </button>

              <button
                onClick={() => handleDownload("trasera")}
                disabled={descargando}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Credencial Trasera</span>
                <Download size={20} />
              </button>

              <button
                onClick={() => handleDownload("ambas")}
                disabled={descargando}
                className="w-full bg-[#8A2136] hover:bg-[#6a1a2b] text-white font-semibold py-3 px-4 rounded-lg transition-colors flex items-center justify-between"
              >
                <span>Ambas Credenciales</span>
                <Download size={20} />
              </button>
            </div>

            {descargando && (
              <div className="mt-4 text-center text-gray-600">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-[#8A2136]"></div>
                <span className="ml-2">Descargando...</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ==========================================
          MODAL CAMBIO DE CONTRASEÑA
      ========================================== */}
      {modalPassOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
        >
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