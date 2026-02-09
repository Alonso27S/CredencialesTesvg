// Importa React y el hook useState para manejar estados locales
import React, { useState } from "react";

// Importa el ícono de búsqueda
import { Search } from "lucide-react";

// Axios para realizar peticiones HTTP al backend
import axios from "axios";

// Componente Buscar
// Recibe la función onBack como prop para regresar al módulo anterior
const Buscar = ({ onBack }) => {

  // Estado que almacena el número identificador ingresado por el usuario
  const [numeroidentificador, setNumeroidentificador] = useState("");

  // Estado que almacena los resultados obtenidos del backend
  const [resultados, setResultados] = useState([]);

  // Función que realiza la búsqueda en el backend
  const buscar = async () => {
    try {
      // Objeto que contendrá los parámetros de búsqueda
      const params = {};

      // Si existe un número identificador, se agrega a los parámetros
      if (numeroidentificador)
        params.numeroidentificador = numeroidentificador;

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

    const renovar = async (id) =>{
      try {
        await axios.put(`http://localhost:5000/api/buscar/renovar/${id}`);
        alert("Credencial renovada correctamente");
        buscar();
      } catch (error) {
        alert("Error al renovar la credencial");
      }
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
            placeholder="ej. 2021123005"
            className="w-full outline-none"
            value={numeroidentificador}
            onChange={(e) => setNumeroidentificador(e.target.value)}
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
      <div className="overflow-x-auto mt-4">
        <table className="w-full border-collapse border border-gray-300 rounded-xl overflow-hidden">

          {/* Encabezado de la tabla */}
          <thead className="bg-gray-200 text-left">
            <tr>
              <th className="px-4 py-2 border">ID</th>
              <th className="px-4 py-2 border">Nombre Completo</th>
              <th className="px-4 py-2 border">Carrera</th>
              <th className="px-4 py-2 border">Tipo</th>
              <th className="px-4 py-2 border">Fecha de Vigencia</th>
              <th className="px-4 py-2 border">Acción</th>
            </tr>
          </thead>

          {/* Cuerpo de la tabla */}
          <tbody>

            {/* Mensaje cuando no hay resultados */}
            {resultados.length === 0 ? (
              <tr>
                <td
                  colSpan="5"
                  className="px-4 py-2 border text-center text-gray-500"
                >
                  No hay resultados
                </td>
              </tr>
            ) : (

              // Renderiza cada resultado recibido
              resultados.map((user) => (
                <tr key={user.id}>
                  <td className="px-4 py-2 border font-semibold">
                    {user.id}
                  </td>
                  <td className="px-4 py-2 border">
                    {user.nombre} {user.apellidop} {user.apellidom}
                  </td>
                  <td className="px-4 py-2 border">
                    {user.nombrearea}
                  </td>
                  <td className="px-4 py-2 border">
                    {user.tipopersona}
                  </td>
                 <td className="px-4 py-2 border font-semibold">
                      {user.fechavigencia
                        ? new Date(user.fechavigencia).toLocaleDateString()
                        : "Sin credencial"} 
                 </td>
                 <td className="px-4 py-2 border">
                      {!user.fechavigencia ? (
                        <span className="text-gray-500">Sin credencial</span>
                      ) : user.vencida ? (
                        <button
                          onClick={() => renovar(user.id)}
                          className="bg-red-500 text-white px-3 py-1 rounded"
                        >
                          Renovar
                        </button>
                      ) : (
                        <span className="text-green-600 font-semibold">Vigente</span>
                      )}
                   </td>
                   </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* BOTÓN PARA REGRESAR AL MÓDULO ANTERIOR */}
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

// Exporta el componente Buscar
export default Buscar;
