// Importa React y el hook useState para manejar estados locales
import React, { useState } from "react";

// Importa el ícono de búsqueda
import { Search } from "lucide-react";

// Axios para realizar peticiones HTTP al backend
import axios from "axios";

// Componente Buscar
// Recibe la función onBack como prop para regresar al módulo anterior
const Buscar = ({ onBack, onEditar }) => {

  // Estado que almacena el número identificador ingresado por el usuario
  const [busqueda, setBusqueda] = useState("");

  // Estado que almacena los resultados obtenidos del backend
  const [resultados, setResultados] = useState([]);

  // Función que realiza la búsqueda en el backend
  const buscar = async () => {
    try {
      // Objeto que contendrá los parámetros de búsqueda
      const params = {};

      // Si existe un número identificador, se agrega a los parámetros
      if (busqueda)
        params.busqueda = busqueda;

      // Petición GET al endpoint de búsqueda
      const response = await axios.get(
        "https://credencialestesvg.com.mx/api/buscar",
        { params }
      );

      // Se guardan los resultados obtenidos en el estado
      setResultados(response.data);

    } catch (error) {
      // Manejo de errores
      console.error("Error al buscar:", error);
      alert("Ocurrió un error al buscar usuarios");
    }
  };
//Renovar credencial
     const renovar = async (id) => {

    await axios.put(`https://credencialestesvg.com.mx/api/credencial/renovar/${id}`);
    buscar();
  };

   const cambiarEstado = async (id) => {
    await axios.put(`https://credencialestesvg.com.mx/api/credencial/estado/${id}`);
    buscar();
  };

  const formatearFecha = (fecha) => {
    return new Date(fecha).toLocaleDateString();
  };

  const obtenerEstado = (user) => {
    if (!user.fechavigencia) return "Sin credencial";
    if (user.vencida) return "Vencida";
    return "Vigente";
  };

  return (
    <div className="w-full max-w-4xl mx-auto">

      {/* TÍTULO DEL MÓDULO */}
      <h3 className="text-lg md:text-xl font-semibold mb-6 flex items-center gap-2">
        <Search className="text-[#8A2136]" />
        Buscar Registro
      </h3>

      {/* BUSCADOR PRINCIPAL */}
      <div className="flex flex-col md:flex-row items-center gap-3 mb-8">

        {/* Input de búsqueda */}
        <div className="flex items-center bg-white border rounded-full px-4 py-2 w-full md:w-96 shadow-sm">
          <Search className="text-gray-500 mr-2" size={20} />
          <input
            type="text"
            placeholder="Nombre,Número de control o correo"
            className="w-full outline-none"
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
          />
        </div>

        {/* Botón de búsqueda */}
        <button
          className="bg-[#8A2136] px-6 py-2 rounded-full font-semibold shadow hover:brightness-90"
          onClick={buscar}
        >
          BUSCAR
        </button>
      </div>

      {/* TABLA DE RESULTADOS */}
      <div className="w-full overflow-x-auto rounded-2xl shadow-md border border-gray-200 mt-4">
        <table className="min-w-[1000px] w-full text-sm md:text-base border-collapse">

          {/* Encabezado de la tabla */}
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-4 py-3 text-left">Nombre Completo</th>
              <th className="px-4 py-3 text-left">Area</th>
              <th className="px-4 py-3 text-left">Tipo</th>
              <th className="px-4 py-3 text-left">Correo</th>
              <th className="px-4 py-3 text-left">Estado</th>
              <th className="px-4 py-3 text-left">Credencial</th>
              <th className="px-4 py-3 text-left">Editar</th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody>

            {/* Mensaje cuando no hay resultados */}
            {resultados.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-3 text-left text-center text-gray-500"
                >
                  No hay resultados
                </td>
              </tr>
            ) : (

              // Renderiza cada resultado recibido
              resultados.map((user) => (
                 <tr
                  key={user.id}
                  className="border-b hover:bg-gray-50 transition-all duration-200"
                  
                >
                  {/* NOMBRE */}
                  <td className="px-4 py-3 font-medium">
                    {user.nombre} {user.apellidop} {user.apellidom}
                  </td>
                   {/* Nombre area */}
                  <td className="px-4 py-3">
                    {user.nombrearea}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {user.tipopersona}
                  </td>
                  <td className="px-4 py-3 break-all">
                    {user.correo}
                  </td>
                   {/* ESTADO */}
                  <td className="px-4 py-3 text-left text-center font-semibold">
                    {obtenerEstado(user) === "Vencida" && user.activo ? (
                      <button
                        onClick={() => renovar(user.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded"
                      >
                        Vencida (Renovar)
                      </button>
                    ) : (
                      <span
                        className={`font-semibold ${
                          obtenerEstado(user) === "Vigente"
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        {obtenerEstado(user)}
                      </span>
                    )}
                  </td>

                   {/* CREDENCIAL = SWITCH CON TEXTO */}
                  <td className="px-4 py-3 text-left text-center">
                    <div
                      onClick={() => cambiarEstado(user.id)}
                      className={`relative mx-auto w-24 h-8 flex items-center rounded-full cursor-pointer transition-all duration-300 ${
                        user.activo ? "bg-green-500" : "bg-gray-400"
                      }`}
                    >
                      <div
                        className={`absolute w-7 h-7 bg-white rounded-full shadow-md transform transition-all duration-300 ${
                          user.activo ? "translate-x-16" : "translate-x-1"
                        }`}
                      />
                      <span className="absolute w-full text-xs font-bold text-white text-center">
                        {user.activo ? "Activa" : "Inactiva"}
                      </span>
                    </div>

                     {/* BOTÓN EDITAR */}

                    <td className="px-4 py-2 border text-center">
                      <button
                      onClick={() => onEditar(user)}
                       className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-1 rounded-lg"
                      >
                         Editar Usuario
                      </button>
                    </td>
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
          className="bg-gray-300 px-6 py-2 rounded-full font-semibold hover:bg-gray-400 transition"
          onClick={onBack}
        >
          Regresar
        </button>
      </div>
    </div>
  );
};

export default Buscar;                