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

  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const [opcionDescarga, setOpcionDescarga] = useState("ambas");

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

  /* 
      DESCARGA UNA SOLA IMAGEN (FRONT + BACK)
  */
  const handleDownload = async (tipo) => {
    const options = {
      scale: 3,
      useCORS: true,
      backgroundColor: "#FFFFFF",
    };

    const ANCHO_BASE = 1080;
    const ALTO_BASE = 1920;
    const MARGEN = 40;

    try {
      let canvas;
      let nombreArchivo;

      if (tipo === "frontal") {
        setVista("front");
        await new Promise(r => setTimeout(r, 150));
        const frontCanvas = await html2canvas(refFront.current, options);

        canvas = document.createElement("canvas");
        canvas.width = ANCHO_BASE;
        canvas.height = ALTO_BASE;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, ANCHO_BASE, ALTO_BASE);

        const scale = Math.min(
          (ANCHO_BASE - MARGEN * 2) / frontCanvas.width,
          (ALTO_BASE - MARGEN * 2) / frontCanvas.height
        );

        const w = frontCanvas.width * scale;
        const h = frontCanvas.height * scale;

        ctx.drawImage(frontCanvas, (ANCHO_BASE - w) / 2, (ALTO_BASE - h) / 2, w, h);

        nombreArchivo = "credencial_frontal";
      }

      else if (tipo === "trasera") {
        setVista("back");
        await new Promise(r => setTimeout(r, 150));
        const backCanvas = await html2canvas(refBack.current, options);

        canvas = document.createElement("canvas");
        canvas.width = ANCHO_BASE;
        canvas.height = ALTO_BASE;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, ANCHO_BASE, ALTO_BASE);

        const scale = Math.min(
          (ANCHO_BASE - MARGEN * 2) / backCanvas.width,
          (ALTO_BASE - MARGEN * 2) / backCanvas.height
        );

        const w = backCanvas.width * scale;
        const h = backCanvas.height * scale;

        ctx.drawImage(backCanvas, (ANCHO_BASE - w) / 2, (ALTO_BASE - h) / 2, w, h);

        nombreArchivo = "credencial_trasera";
      }

      else {
        setVista("front");
        await new Promise(r => setTimeout(r, 150));
        const frontCanvas = await html2canvas(refFront.current, options);

        setVista("back");
        await new Promise(r => setTimeout(r, 150));
        const backCanvas = await html2canvas(refBack.current, options);

        canvas = document.createElement("canvas");
        canvas.width = ANCHO_BASE;
        canvas.height = ALTO_BASE;

        const ctx = canvas.getContext("2d");
        ctx.fillStyle = "#FFFFFF";
        ctx.fillRect(0, 0, ANCHO_BASE, ALTO_BASE);

        const half = ALTO_BASE / 2;

        const scaleF = Math.min(ANCHO_BASE / frontCanvas.width, half / frontCanvas.height);
        const scaleB = Math.min(ANCHO_BASE / backCanvas.width, half / backCanvas.height);

        const fw = frontCanvas.width * scaleF;
        const fh = frontCanvas.height * scaleF;

        const bw = backCanvas.width * scaleB;
        const bh = backCanvas.height * scaleB;

        ctx.drawImage(frontCanvas, (ANCHO_BASE - fw) / 2, 40, fw, fh);
        ctx.drawImage(backCanvas, (ANCHO_BASE - bw) / 2, half + 20, bw, bh);

        nombreArchivo = "credencial_completa";
      }

      setVista("front");

      const link = document.createElement("a");
      link.download = `${nombreArchivo}_${usuario.numeroidentificador}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();

      setMostrarOpciones(false);

    } catch (error) {
      console.error("Error al descargar:", error);
      alert("Error al descargar la credencial. Intenta de nuevo.");
    }
  };

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

      {/* BOTÓN DE DESCARGA */}
      <button
        onClick={() => setMostrarOpciones(true)}
        className="mt-4 bg-[#8A2136] text-white px-6 py-2 rounded"
      >
        <Download className="inline mr-2" />
        Descargar credencial
      </button>

      {/* OPCIONES DESCARGA */}
      {mostrarOpciones && (
        <div
          className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center"
          onClick={() => setMostrarOpciones(false)}
        >
          <div
            className="bg-white p-6 rounded-xl w-[280px]"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="font-bold mb-4 text-[#8A2136]">
              Elegir descarga
            </h2>

            <button onClick={() => handleDownload("frontal")} className="w-full p-2 bg-gray-200 mb-2 rounded">
              Frontal
            </button>

            <button onClick={() => handleDownload("trasera")} className="w-full p-2 bg-gray-200 mb-2 rounded">
              Trasera
            </button>

            <button onClick={() => handleDownload("ambas")} className="w-full p-2 bg-[#8A2136] text-white rounded">
              Ambas caras
            </button>
          </div>
        </div>
      )}

      {/* 🔴 TODO LO DEMÁS TUYO QUEDA IGUAL (NO LO MODIFIQUÉ) */}

  

         {/* <button
            onClick={handleDownload}
            className="mt-6 bg-[#8A2136] text-white px-6 py-2 rounded"
          >
            <Download className="inline mr-2" />
            Descargar Credencial
          </button>
        </div>
      </main>*/}


    {/* ==========================================
          MODAL CREDENCIAL PANTALLA COMPLETA
      ========================================== */}
      {modalCredencialOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4"
          onClick={() => setModalCredencialOpen(false)}
        >
          {/* Botón cerrar */}
          <button
            onClick={() => setModalCredencialOpen(false)}
            className="absolute top-4 right-4 text-white hover:text-gray-300 z-50"
          >
            <X size={36} />
          </button>

          {/* Evita que al hacer click en la credencial se cierre */}
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