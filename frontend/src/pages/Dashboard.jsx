// ================================
// Dashboard principal del sistema
// ================================

import React, { useState, useRef, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Phone, Mail, Headset } from "lucide-react";

// 🎨 Iconos usados en el dashboard (Lucide)
import {
  Menu,
  Bell,
  User,
  Home,
  Search,
  Users,
  FileText,
  Settings,
  LogOut,
  GraduationCap,
  IdCard,
  Shield,
} from "lucide-react";

// 🔹 Importación de los módulos del sistema
import Inicio from "./Inicio";
import Buscar from "./Buscar";
import AdminGestores from "./AdminGestores";
import Comunidad from "./ComunidadEstudiantil";
import Reportes from "./Reportes";
import Perfil from "./Perfil";
import Registro from "./Registro";
import Visitas from "./Visitas";

/**
 * COMPONENTE: Dashboard
 * ---------------------
 * Contenedor principal después del login.
 * Maneja:
 * - Header
 * - Footer
 * - Menú lateral
 * - Cambio de módulos
 *
 * @param {object} userData  Datos del usuario autenticado
 * @param {function} onLogout Función para cerrar sesión
 */
const Dashboard = ({ userData, onLogout }) => {
  /* =========================
     ESTADOS DEL COMPONENTE
  ========================= */
  const location = useLocation();

  const [registroImportado, setRegistroImportado] = useState(null);

  // Controla apertura del menú lateral
  const [menuOpen, setMenuOpen] = useState(false);

  // Controla el menú desplegable del usuario
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [soporteOpen, setSoporteOpen] = useState(false);

  // Módulo activo que se muestra en pantalla
  const [activeModule, setActiveModule] = useState("inicio");

  // Referencia para detectar clics fuera del menú de usuario
  const userMenuRef = useRef(null);
  /* =========================
   ABRIR REGISTRO AUTOMÁTICO
========================= */
  useEffect(() => {
    console.log("📍 Location state:", location.state);
    console.log("📍 Active antes:", activeModule);

    if (location.state?.abrirRegistro) {
      console.log("➡️ Cambiando a módulo REGISTRO");

      setActiveModule("registro");

      // Limpia el state para evitar bucle
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  /* =========================
     DATOS DEL USUARIO
  ========================= */

  // Se normalizan datos para evitar errores y mejorar visualización
  const nombre = userData?.nombre?.trim()?.toUpperCase?.() || "USUARIO";

  const apellidop = userData?.apellidop?.trim()?.toUpperCase?.() || "";

  const rol = userData?.rol?.trim()?.toUpperCase?.() || "SIN ROL";

  // ID del usuario (soporta distintos nombres de propiedad)
  const userId = userData?.id || userData?.userId || null;

  /* =========================
     CERRAR MENÚ AL DAR CLIC FUERA
  ========================= */
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Si el clic NO fue dentro del menú → cerrar
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuOpen(false);
      }
    };

    // Escucha clics en todo el documento
    document.addEventListener("mousedown", handleClickOutside);

    // Limpieza al desmontar el componente
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* =========================
          HEADER
      ========================= */}
      <header className="bg-white shadow-md fixed top-0 left-0 w-full z-50">
        {/* Logos + título institucional */}
        <div className="grid grid-cols-3 items-center px-4 md:px-8 py-3 w-full">
          {/* Logo izquierdo */}
          <div className="flex justify-start">
            <img
              src="/assets/logo_gobierno.png"
              className="h-10 md:h-12 lg:h-14"
              alt=""
            />
          </div>

          {/* Título centrado */}
          <div className="flex justify-center text-center">
            <h1 className="font-bold text-sm md:text-lg lg:text-xl leading-tight">
              Tecnológico de Estudios Superiores
              <br />
              de Villa Guerrero
            </h1>
          </div>

          {/* Logos derechos */}
          <div className="flex justify-end gap-3">
            <img
              src="/assets/logo_tesvg2.png"
              className="h-10 md:h-12 lg:h-14"
              alt=""
            />
            <img
              src="/assets/logo_tecnm.png"
              className="h-10 md:h-12 lg:h-14"
              alt=""
            />
          </div>
        </div>

        {/* =========================
            BARRA SUPERIOR
        ========================= */}
        <div
          className="flex justify-between items-center px-4 md:px-8 py-3 text-white"
          style={{ backgroundColor: "#8A2136" }}
        >
          <h2 className="text-sm md:text-lg font-semibold">
            SISTEMA DE CONTROL DE ACCESO
          </h2>

          {/* Información del usuario + botones */}
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Nombre y rol */}
            <div className="hidden sm:flex flex-col text-right text-xs md:text-sm font-semibold">
              {apellidop} {nombre}
              <span className="text-[10px] italic">{rol}</span>
            </div>

            {/* Iconos */}
            <div className="flex space-x-2 md:space-x-4 items-center">
              {/* =========================
                  MENÚ DE USUARIO
              ========================= */}
              <div className="relative" ref={userMenuRef}>
                <button
                  className="hover:bg-white/20 p-2 rounded transition"
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                >
                  <User className="h-6 w-6" />
                </button>

                {/* Menú desplegable */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-white rounded-lg shadow-lg border">
                    {/* Perfil */}
                    <button
                      className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-100 text-black"
                      onClick={() => {
                        setUserMenuOpen(false);
                        setActiveModule("perfil");
                      }}
                    >
                      <User className="h-4 w-4" />
                      <span>Perfil</span>
                    </button>

                    {/* SOPORTE 👇 */}
                    <button
                      onClick={() => {
                        setSoporteOpen(true);
                        setUserMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Soporte
                    </button>

                    {/* Cerrar sesión */}
                    <button
                      className="flex items-center space-x-2 w-full px-4 py-2 hover:bg-gray-100 text-red-600"
                      onClick={onLogout}
                    >
                      <LogOut className="h-4 w-4" />
                      <span>Cerrar sesión</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Botón menú lateral */}
              <button
                className="hover:bg-white/20 p-2 rounded transition"
                onClick={() => setMenuOpen(!menuOpen)}
              >
                <Menu className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* =========================
          CONTENIDO PRINCIPAL
      ========================= */}
      <div className="flex-1 flex mt-[130px] md:mt-[140px] mb-[80px]">
        <main className="flex-1 p-4 md:p-8">
          {/* Render dinámico de módulos */}
          {activeModule === "inicio" && <Inicio />}
          {activeModule === "buscar" && (
            <Buscar onBack={() => setActiveModule("inicio")} />
          )}
          {activeModule === "gestores" && (
            <AdminGestores onBack={() => setActiveModule("inicio")} />
          )}
          {activeModule === "comunidad" && (
            <Comunidad
              onGenerarCredencial={(data) => {
                console.log("📍 Active antes:", activeModule);

                setRegistroImportado(data);
                setActiveModule("registro");

                console.log("📍 Active después: registro");
              }}
            />
          )}

          {activeModule === "reportes" && (
            <Reportes onBack={() => setActiveModule("inicio")} />
          )}
          {activeModule === "registro" && (
            <Registro
              importado={registroImportado}
              onBack={() => setActiveModule("inicio")}
            />
          )}

          {activeModule === "visitas" && <Visitas />}
          {activeModule === "perfil" && <Perfil userId={userId} />}
        </main>

        {/* =========================
            MENÚ LATERAL
        ========================= */}
        <aside
          className={`fixed top-[120px] right-0 h-[calc(100%-200px)] w-64 bg-white shadow-lg transform transition-transform duration-300 z-40 ${
            menuOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <nav className="p-6 space-y-4 text-gray-700">
            {[
              { key: "inicio", icon: <Home />, label: "Panel Principal" },
              { key: "buscar", icon: <Search />, label: "Buscar" },
              { key: "gestores", icon: <Users />, label: "Admin. Gestores" },
              {
                key: "comunidad",
                icon: <GraduationCap />,
                label: "Comunidad Estudiantil",
              },
              { key: "registro", icon: <IdCard />, label: "Registro" },
              { key: "reportes", icon: <FileText />, label: "Reportes" },
              { key: "visitas", icon: <Shield />, label: "Visitas" },
            ].map(({ key, icon, label }) => (
              <button
                key={key}
                onClick={() => {
                  setActiveModule(key);
                  setMenuOpen(false);
                }}
                className={`flex items-center space-x-3 w-full p-2 rounded hover:bg-gray-100 ${
                  activeModule === key ? "bg-gray-100 font-semibold" : ""
                }`}
              >
                {icon}
                <span>{label}</span>
              </button>
            ))}
          </nav>
        </aside>
      </div>

      {/* =========================
    MODAL SOPORTE
========================= */}
      {soporteOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-[90%] max-w-md p-6 relative animate-fadeIn">
            {/* BOTÓN CERRAR */}
            <button
              onClick={() => setSoporteOpen(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-black transition"
            >
              ✕
            </button>

            {/* HEADER */}
            <div className="flex items-center space-x-2 mb-5">
              <Headset className="w-6 h-6 text-blue-600" />
              <h2 className="text-xl font-bold text-gray-800">
                Soporte Técnico
              </h2>
            </div>

            {/* CONTENIDO */}
            <div className="space-y-4">
              {/* TELÉFONO */}
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                <Phone className="w-5 h-5 text-green-600" />
                <div>
                  <p className="text-sm text-gray-500">Teléfono</p>
                  <p className="font-semibold text-gray-800">55 4909 8152 / 722 843 3371</p>
                </div>
              </div>

              {/* CORREO */}
              <div className="flex items-center space-x-3 bg-gray-50 p-3 rounded-lg">
                <Mail className="w-5 h-5 text-red-600" />
                <div>
                  <p className="text-sm text-gray-500">Correo</p>
                  <p className="font-semibold text-gray-800">
                    soporte@tudominio.com
                  </p>
                </div>
              </div>
            </div>

            {/* BOTÓN */}
            <div className="mt-6 text-right">
              <button
                onClick={() => setSoporteOpen(false)}
                className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* =========================
          FOOTER
      ========================= */}
      <footer
        className="fixed bottom-0 left-0 w-full py-3 px-6 flex items-center space-x-3 shadow-inner z-50"
        style={{ backgroundColor: "#8A2136" }}
      >
        <img src="/assets/logo_gobiernob.png" className="h-8 md:h-10" alt="" />
        <p className="text-xs md:text-sm text-white leading-tight">
          Dirección: Carretera Federal Toluca - Ixtapan de la Sal Km 64.5
          <br />
          Col. La Finca, Villa Guerrero, Estado de México
          <br />
          Tel: (714) 14 61 465
        </p>
      </footer>
    </div>
  );
};

export default Dashboard;
