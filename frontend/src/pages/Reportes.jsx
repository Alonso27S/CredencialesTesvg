import React, { useState } from "react";
import axios from "axios";
import { ArrowLeft, Calendar, FileText } from "lucide-react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const Reportes = ({ onBack }) => {
  const [filters, setFilters] = useState({
    tipoPersonal: "",
    area: "",
    estado: "",
    fechaInicio: "",
    fechaFin: "",
  });

  const [data, setData] = useState([]);

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const fetchReportes = async () => {
    try {
      const res = await axios.get(
        "https://credencialestesvg.com.mx/api/reportes",
        {
          params: filters,
        }
      );

      setData(res.data);
    } catch (error) {
      console.error("❌ Error al generar reporte:", error);
      alert("Error al generar reporte.");
    }
  };

  const exportarExcel = () => {
    if (data.length === 0) {
      alert("No hay datos para exportar");
      return;
    }

    const fechaGeneracion = new Date().toLocaleDateString();

    const encabezado = [
      ["Sistema de Credencialización TESVG"],
      ["Reporte de Registros"],
      [`Fecha de generación: ${fechaGeneracion}`],
      [],
    ];

    const columnas = [
      [
        "ID",
        "Nombre Completo",
        "Número Identificador",
        "NSS",
        "Área",
        "Estado",
        "Fecha",
        "Hora",
      ],
    ];

    const filas = data.map((row) => [
      row.id,
      row.nombre_completo,
      row.numeroidentificador,
      row.nss,
      row.area,
      row.estado,
      row.fecha,
      row.hora,
    ]);

    const worksheet = XLSX.utils.aoa_to_sheet([
      ...encabezado,
      ...columnas,
      ...filas,
    ]);

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Reporte");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });

    const fileData = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    saveAs(fileData, "reporte_registros_tesvg.xlsx");
  };

  return (
    <div className="w-full p-4">
      <h3 className="text-xl font-semibold mb-6">
        Generación y Filtrado de Reportes
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-10">

        <div>
          <label className="text-sm font-medium">Tipo de Personal</label>
          <select
            name="tipoPersonal"
            className="border p-2 rounded w-full text-sm"
            onChange={handleChange}
          >
            <option value="">Selecciona...</option>
            <option value="Docente">Docente</option>
            <option value="Alumno">Alumno</option>
            <option value="Administrativo">Administrativo</option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Área / Carrera</label>
          <select
            name="area"
            className="border p-2 rounded w-full text-sm"
            onChange={handleChange}
          >
            <option value="">Selecciona...</option>
            <option value="Arquitectura">Arquitectura</option>
            <option value="Administracion">Administracion</option>
            <option value="Turismo">Turismo</option>
            <option value="Igenieria Sistemas Compuatcionales">
              Igenieria Sistemas Compuatcionales
            </option>
            <option value="Ingenieria Electronica">
              Ingenieria Electronica
            </option>
            <option value="Ingenieria Industrial">
              Ingenieria Industrial
            </option>
            <option value="Ingenieria en Indrustrias Alimentarias">
              Ingenieria en Indrustrias Alimentarias
            </option>
            <option value="Ingenieria en Innovacion Agricola Sustentable">
              Ingenieria en Innovacion Agricola Sustentable
            </option>
          </select>
        </div>

        <div>
          <label className="text-sm font-medium">Estado</label>
          <select
            name="estado"
            className="border p-2 rounded w-full text-sm"
            onChange={handleChange}
          >
            <option value="">Selecciona...</option>
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>

        <div className="relative">
          <label className="text-sm font-medium">Desde</label>
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

        <div className="relative">
          <label className="text-sm font-medium">Hasta</label>
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

      <div className="border rounded-xl p-4 shadow-sm bg-white mb-10">
        <h4 className="font-semibold mb-4">Resultados del Reporte</h4>

        <table className="w-full text-left text-sm">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="p-2 border-b">ID</th>
              <th className="p-2 border-b">Nombre Completo</th>
              <th className="p-2 border-b">Número Identificador</th>
              <th className="p-2 border-b">NSS</th>
              <th className="p-2 border-b">Área</th>
              <th className="p-2 border-b">Estado</th>
              <th className="p-2 border-b">Fecha</th>
              <th className="p-2 border-b">Hora</th>
            </tr>
          </thead>

          <tbody>
            {data.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center p-4 text-gray-500">
                  No hay datos. Genera un reporte.
                </td>
              </tr>
            ) : (
              data.map((row) => (
                <tr key={row.id}>
                  <td className="p-2 border-b">{row.id}</td>
                  <td className="p-2 border-b">{row.nombre_completo}</td>
                  <td className="p-2 border-b">{row.numeroidentificador}</td>
                  <td className="p-2 border-b">{row.nss}</td>
                  <td className="p-2 border-b">{row.area}</td>
                  <td className="p-2 border-b">{row.estado}</td>
                  <td className="p-2 border-b">{row.fecha}</td>
                  <td className="p-2 border-b">{row.hora}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <div className="flex justify-between items-center mt-6">
        <button
          onClick={onBack}
          className="px-8 py-3 rounded-full bg-gray-300 hover:bg-gray-400 flex items-center gap-2 font-semibold text-sm"
        >
          <ArrowLeft size={18} /> Regresar
        </button>

        <div className="flex gap-4">
          <button
            onClick={fetchReportes}
            className="bg-blue-500 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-blue-600 flex items-center gap-2"
          >
            Generar Reporte <FileText size={20} />
          </button>

          <button
            onClick={exportarExcel}
            className="bg-green-600 text-white px-8 py-3 rounded-full font-semibold text-sm hover:bg-green-700 flex items-center gap-2"
          >
            Exportar Excel
          </button>
        </div>
      </div>
    </div>
  );
};

export default Reportes;