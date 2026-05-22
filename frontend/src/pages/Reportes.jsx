import React, { useState } from "react";
import axios from "axios";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Clock,
} from "lucide-react";

const Reportes = ({ onBack }) => {

  const [filters, setFilters] = useState({
    tipoPersonal: "",
    area: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [data, setData] = useState([]);

  // NUEVO ESTADO PARA ACCESOS
  const [accesos, setAccesos] = useState([]);

  // CONTROL DE VISTA
  const [mostrarAccesos, setMostrarAccesos] = useState(false);

  // Manejo de filtros
  const handleChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  // ---------------------------
  // REPORTE GENERAL
  // ---------------------------
  const fetchReportes = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/reportes",
        {
          params: filters,
        }
      );

      setData(res.data);

      // MOSTRAR TABLA REPORTES
      setMostrarAccesos(false);

    } catch (error) {

      console.error(
        "❌ Error al generar reporte:",
        error
      );

      alert(
        "Error al generar reporte. Revisa tu backend."
      );
    }
  };

  // ---------------------------
  // REPORTE DE ACCESOS
  // ---------------------------
  const fetchAccesos = async () => {

    try {

      const res = await axios.get(
        "http://localhost:5000/api/accesos",
        {
          params: filters,
        }
      );

      setAccesos(res.data);

      // MOSTRAR TABLA ACCESOS
      setMostrarAccesos(true);

    } catch (error) {

      console.error(
        "❌ Error al cargar accesos:",
        error
      );

      alert(
        "Error al cargar accesos."
      );
    }
  };

  return (

    <div className="w-full p-4">

      {/* TÍTULO */}
      <h3 className="text-xl font-semibold mb-6">
        Generación y Filtrado de Reportes
      </h3>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">

        {/* Tipo Personal */}
        <div>
          <label className="text-sm font-medium">
            Tipo de Personal
          </label>

          <select
            name="tipoPersonal"
            className="border p-2 rounded w-full text-sm"
            onChange={handleChange}
          >
            <option value="">Selecciona...</option>
            <option value="Docente">Docente</option>
            <option value="Alumno">Alumno</option>
            <option value="Administrativo">
              Administrativo
            </option>
          </select>
        </div>

        {/* Área */}
        <div>

          <label className="text-sm font-medium">
            Área / Carrera
          </label>

          <select
            name="area"
            className="border p-2 rounded w-full text-sm"
            onChange={handleChange}
          >

            <option value="">Selecciona...</option>

            <option value="Arquitectura">
              Arquitectura
            </option>

            <option value="Administracion">
              Administracion
            </option>

            <option value="Turismo">
              Turismo
            </option>

            <option value="Ingenieria Sistemas Computacionales">
              Ingenieria en Sistemas Computacionales
            </option>

            <option value="Ingenieria Electronica">
              Ingenieria Electronica
            </option>

            <option value="Ingenieria Industrial">
              Ingenieria Industrial
            </option>

            <option value="Ingenieria en Industrias Alimentarias">
              Ingenieria en Industrias Alimentarias
            </option>

            <option value="Ingenieria en Inovacion Agricola Sustentable">
              Ingenieria en Inovacion Agricola Sustentable
            </option>

          </select>

        </div>

        {/* Estado */}
        <div>

          <label className="text-sm font-medium">
            Estado
          </label>

          <select
            name="estado"
            className="border p-2 rounded w-full text-sm"
            onChange={handleChange}
          >

            <option value="">Selecciona...</option>

            <option value="Activo">
              Activo
            </option>

            <option value="Inactivo">
              Inactivo
            </option>

          </select>

        </div>

        {/* Fecha Inicio */}
        <div className="relative">

          <label className="text-sm font-medium">
            Desde
          </label>

          <input
            type="date"
            name="fechaInicio"
            onChange={handleChange}
            className="w-full border p-2 pl-10 rounded text-sm"
          />

          <Calendar
            size={18}
            className="absolute left-3 top-[38px] text-gray-500 pointer-events-none"
          />

        </div>

        {/* Fecha Fin */}
        <div className="relative">

          <label className="text-sm font-medium">
            Hasta
          </label>

          <input
            type="date"
            name="fechaFin"
            onChange={handleChange}
            className="w-full border p-2 pl-10 rounded text-sm"
          />

          <Calendar
            size={18}
            className="absolute left-3 top-[38px] text-gray-500 pointer-events-none"
          />

        </div>

      </div>

      {/* ====================================== */}
      {/* TABLA REPORTES */}
      {/* ====================================== */}

      {!mostrarAccesos && (

        <div className="border rounded-xl p-4 shadow-sm bg-white mb-10">

          <h4 className="font-semibold mb-4">
            Resultados del Reporte
          </h4>

          <table className="w-full text-left text-sm">

            <thead>

              <tr className="bg-gray-100 text-gray-700">

                <th className="p-2 border-b">
                  ID
                </th>

                <th className="p-2 border-b">
                  Nombre Completo
                </th>

                <th className="p-2 border-b">
                  Área
                </th>

                <th className="p-2 border-b">
                  Estado
                </th>

                <th className="p-2 border-b">
                  Fecha
                </th>

                <th className="p-2 border-b">
                  Hora
                </th>

              </tr>

            </thead>

            <tbody>

              {data.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-4 text-gray-500"
                  >
                    No hay datos. Genera un reporte.
                  </td>

                </tr>

              ) : (

                data.map((row) => (

                  <tr key={row.id}>

                    <td className="p-2 border-b">
                      {row.id}
                    </td>

                    <td className="p-2 border-b">
                      {row.nombre_completo}
                    </td>

                    <td className="p-2 border-b">
                      {row.area}
                    </td>

                    <td className="p-2 border-b">
                      {row.estado}
                    </td>

                    <td className="p-2 border-b">
                      {row.fecha}
                    </td>

                    <td className="p-2 border-b">
                      {row.hora}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

      {/* ====================================== */}
      {/* TABLA ACCESOS */}
      {/* ====================================== */}

      {mostrarAccesos && (

        <div className="border rounded-xl p-4 shadow-sm bg-white mb-10">

          <h4 className="font-semibold mb-4 flex items-center gap-2">

            <Clock size={20} />

            Historial de Accesos

          </h4>

          <table className="w-full text-left text-sm">

            <thead>

              <tr className="bg-gray-100 text-gray-700">

                <th className="p-2 border-b">
                  ID
                </th>

                <th className="p-2 border-b">
                  Fecha
                </th>

                <th className="p-2 border-b">
                  Hora Entrada
                </th>

                <th className="p-2 border-b">
                  Hora Salida
                </th>

                <th className="p-2 border-b">
                  Tipo Acceso
                </th>

                <th className="p-2 border-b">
                  ID Credencial
                </th>

              </tr>

            </thead>

            <tbody>

              {accesos.length === 0 ? (

                <tr>

                  <td
                    colSpan="6"
                    className="text-center p-4 text-gray-500"
                  >
                    No hay registros de acceso.
                  </td>

                </tr>

              ) : (

                accesos.map((row) => (

                  <tr key={row.id}>

                    <td className="p-2 border-b">
                      {row.id}
                    </td>

                    <td className="p-2 border-b">
                      {row.fecha}
                    </td>

                    <td className="p-2 border-b">
                      {row.horaentrada}
                    </td>

                    <td className="p-2 border-b">
                      {row.horasalida}
                    </td>

                    <td className="p-2 border-b">
                      {row.tipo_acceso}
                    </td>

                    <td className="p-2 border-b">
                      {row.id_credencial}
                    </td>

                  </tr>

                ))

              )}

            </tbody>

          </table>

        </div>

      )}

      {/* BOTONES */}
      <div className="flex justify-between items-center mt-6">

        <button
          onClick={onBack}
          className="px-8 py-3 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center gap-2 font-semibold text-sm"
        >
          <ArrowLeft size={18} />

          Regresar
        </button>

        <div className="flex gap-4">

          {/* BOTON REPORTE */}
          <button
            onClick={fetchReportes}
            className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-blue-600 flex items-center gap-2"
          >
            Generar Reporte

            <FileText size={20} />
          </button>

          {/* BOTON ACCESOS */}
          <button
            onClick={fetchAccesos}
            className="bg-green-500 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-green-600 flex items-center gap-2"
          >
            Ver Accesos

            <Clock size={20} />
          </button>

        </div>

      </div>

    </div>
  );
};

export default Reportes;