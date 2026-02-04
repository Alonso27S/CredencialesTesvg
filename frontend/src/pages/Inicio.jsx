// Importa hooks de React para manejar estado y ciclos de vida
import React, { useEffect, useState } from "react";

// Importa íconos desde lucide-react
import { Home, Users, ClipboardList } from "lucide-react";

// Axios para realizar peticiones HTTP al backend
import axios from "axios";

// Componente que muestra la tabla de usuarios
import TablaUsuarios from "../components/TablaUsuario";

// Componente principal del módulo Inicio (Panel Principal)
const Inicio = () => {

  // Estado para almacenar el conteo de usuarios por tipo
  const [counts, setCounts] = useState({
    Alumno: 0,
    Docente: 0,
    Administrativo: 0,
  });

  // Estado que guarda la lista de usuarios a mostrar en la tabla
  const [listaUsuarios, setListaUsuarios] = useState([]);

  // Estado que indica qué tipo de usuario se está mostrando (Alumno, Docente, Administrativo)
  const [mostrarTipo, setMostrarTipo] = useState(null);

  // useEffect que se ejecuta una sola vez al cargar el componente
  useEffect(() => {

    // Función para obtener los conteos desde el backend
    const fetchCounts = async () => {
      try {
        // Petición al endpoint que devuelve los totales por tipo
        const res = await axios.get("http://localhost:5000/api/dashboard/counts");

        // Se actualiza el estado asegurando valores por defecto
        setCounts({
          Alumno: res.data.Alumno || 0,
          Docente: res.data.Docente || 0,
          Administrativo: res.data.Administrativo || 0,
        });

      } catch (error) {
        // Manejo de errores en consola
        console.error("Error al cargar los totales:", error);
      }
    };

    // Llamada a la función
    fetchCounts();

  }, []); // Array vacío = solo se ejecuta al montar el componente

  // Función que carga usuarios según el tipo seleccionado
  const cargarUsuarios = async (tipo) => {
    try {
      // Variable para definir la URL según el tipo
      let url = "";

      // Se asigna la URL correspondiente
      if (tipo === "Alumno") url = "http://localhost:5000/api/dashboard/Alumnos";
      if (tipo === "Docente") url = "http://localhost:5000/api/dashboard/Docentes";
      if (tipo === "Administrativo") url = "http://localhost:5000/api/dashboard/Administrativos";

      // Petición al backend para obtener los usuarios
      const res = await axios.get(url);

      // Guarda la lista de usuarios recibidos
      setListaUsuarios(res.data);

      // Define qué tipo de usuario se está mostrando
      setMostrarTipo(tipo);

    } catch (error) {
      // Manejo de errores
      console.error("Error al cargar usuarios:", error);
    }
  };

  return (
    <div>

      {/* Título del módulo */}
      <h3 className="text-lg md:text-xl font-semibold mb-6">
        Panel Principal
      </h3>

      {/* Tarjetas con totales */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

        {/* Tarjeta de Alumnos */}
        <div
          className="bg-white shadow-md rounded-xl p-6 text-center border-t-4 border-[#8A2136] cursor-pointer"
          onClick={() => cargarUsuarios("Alumno")}
        >
          <Home className="h-8 w-8 mx-auto mb-2 text-[#8A2136]" />
          <h4 className="text-lg font-semibold">Alumnos</h4>
          <p className="text-2xl font-bold text-[#8A2136]">
            {counts.Alumno}
          </p>
        </div>

        {/* Tarjeta de Docentes */}
        <div
          className="bg-white shadow-md rounded-xl p-6 text-center border-t-4 border-[#8A2136] cursor-pointer"
          onClick={() => cargarUsuarios("Docente")}
        >
          <Users className="h-8 w-8 mx-auto mb-2 text-[#8A2136]" />
          <h4 className="text-lg font-semibold">Docentes</h4>
          <p className="text-2xl font-bold text-[#8A2136]">
            {counts.Docente}
          </p>
        </div>

        {/* Tarjeta de Administrativos */}
        <div
          className="bg-white shadow-md rounded-xl p-6 text-center border-t-4 border-[#8A2136] cursor-pointer"
          onClick={() => cargarUsuarios("Administrativo")}
        >
          <ClipboardList className="h-8 w-8 mx-auto mb-2 text-[#8A2136]" />
          <h4 className="text-lg font-semibold">Administrativo</h4>
          <p className="text-2xl font-bold text-[#8A2136]">
            {counts.Administrativo}
          </p>
        </div>

      </div>

      {/* Tabla que se muestra solo cuando hay un tipo seleccionado */}
      {mostrarTipo && (
        <TablaUsuarios
          usuarios={listaUsuarios}
          titulo={`Listado de ${mostrarTipo}s`}
        />
      )}

    </div>
  );
};

// Exporta el componente para poder usarlo en el Dashboard
export default Inicio;
