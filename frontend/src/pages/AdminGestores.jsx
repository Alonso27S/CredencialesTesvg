import React, { useEffect, useState } from "react";
import { Users, Plus, Search } from "lucide-react";
import NuevoGestorForm from "./NuevoGestorForm";

const AdminGestores = ({ onBack }) => {

  // 🔹 Controla si se muestra el formulario para crear un nuevo gestor
  const [showForm, setShowForm] = useState(false);

  // 🔹 Lista de gestores (usuarios con id_rol 1 y 2)
  // ⚠️ El filtrado por rol SE HACE EN EL BACKEND
  const [gestores, setGestores] = useState([]);

  // 🔹 Texto escrito en el buscador
  const [busqueda, setBusqueda] = useState("");

  // 🔹 Endpoint del backend
  const BASE_URL = "https://credencialestesvg.com.mx/api/gestores";

  // 🔐 Token de autenticación (JWT)
  const token = localStorage.getItem("token");

  /* =====================================================
     🔹 OBTENER GESTORES DESDE LA BD
     ===================================================== */
  const obtenerGestores = async () => {
    try {
      const res = await fetch(
        `${BASE_URL}?nombre=${busqueda}`,
        {
          headers: {
            Authorization: `Bearer ${token}`, // 🔐 necesario para rutas protegidas
          },
        }
      );

      const data = await res.json();

      // 🛡️ Evita errores si el backend devuelve algo incorrecto
      setGestores(Array.isArray(data) ? data : []);

    } catch (error) {
      console.error("❌ Error al cargar gestores", error);
    }
  };

  // 🔹 Carga inicial de gestores al montar el componente
  useEffect(() => {
    obtenerGestores();
  }, []);

  /* =====================================================
     🔹 ELIMINAR GESTOR (SOLO ADMIN)
     ===================================================== */
  const eliminarGestor = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este gestor?")) return;

    try {
      const res = await fetch(`${BASE_URL}/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // 🔒 protegido por requireAdmin
        },
      });

      if (!res.ok) {
        alert("No tienes permisos para eliminar este gestor");
        return;
      }

      // 🔄 Recargar la tabla después de eliminar
      obtenerGestores();

    } catch (error) {
      console.error("Error al eliminar gestor", error);
    }
  };

  // 🔹 Muestra el formulario para crear gestor
  if (showForm) {
    return <NuevoGestorForm onBack={() => setShowForm(false)} />;
  }

  return (
    <div className="p-4">

      {/* TÍTULO */}
      <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
        <Users className="text-[#8A2136]" /> Administración de Gestores
      </h3>

      {/* BUSCADOR + BOTÓN */}
      <div className="flex flex-col md:flex-row items-center gap-4 mb-6">

        {/* INPUT DE BÚSQUEDA POR NOMBRE */}
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-3 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Buscar por nombre"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyUp={obtenerGestores}
            className="w-full border px-10 py-2 rounded-lg outline-none"
          />
        </div>

        {/* BOTÓN NUEVO GESTOR */}
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#8A2136] text-white px-5 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
        >
          <Plus size={18} /> Añadir Nuevo Gestor
        </button>
      </div>

      {/* TEXTO */}
      <p className="text-gray-700 mb-3">Gestores Activos</p>

      {/* TABLA */}
      <div className="border rounded-lg overflow-hidden shadow-sm">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-3 font-semibold">ID</th>
              <th className="p-3 font-semibold">NOMBRE COMPLETO</th>
              <th className="p-3 font-semibold">PRIVILEGIOS</th>
              <th className="p-3 font-semibold">ACCIONES</th>
            </tr>
          </thead>

          <tbody>
            {gestores.length === 0 ? (
              <tr>
                <td colSpan="4" className="p-4 text-center text-gray-500">
                  No hay gestores registrados
                </td>
              </tr>
            ) : (
              gestores.map((gestor, index) => (
                <tr
                  key={gestor.id}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="p-3">{gestor.id}</td>
                  <td className="p-3">{gestor.nombre}</td>

                  {/* puesto viene del backend */}
                  <td className="p-3">{gestor.puesto}</td>

                  <td className="p-3 flex gap-2">
                   {/*  <button className="text-blue-600 hover:underline">
                    Editar rol
                    </button> 
                    <span>|</span> */}
                    <button
                      onClick={() => eliminarGestor(gestor.id)}
                      className="text-red-600 hover:underline"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BOTÓN REGRESAR */}
      <div className="flex justify-end mt-5">
        <button
          className="bg-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-gray-400"
          onClick={onBack}
        >
          Regresar
        </button>
      </div>
    </div>
  );
};

export default AdminGestores;
