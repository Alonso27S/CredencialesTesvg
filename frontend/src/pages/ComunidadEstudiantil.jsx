import React, { useEffect, useRef, useState } from "react";
import { Upload, Trash2, IdCard } from "lucide-react";
import { useNavigate } from "react-router-dom";

const API = "https://credencialestesvg.com.mx";

const ComunidadEstudiantil = ({ onGenerarCredencial }) => {
  const [datos, setDatos] = useState([]);
  const fileRef = useRef(null);
  const navigate = useNavigate(); // ✅ Hook bien colocado
// ================================
//   CARGAR DATOS IMPORTADOS
// ================================
const cargarDatos = async () => {
  try {
    // 🔧 URL corregida
    const res = await fetch(`${API}/api/importacion`);

    // Validar respuesta
    if (!res.ok) {
      throw new Error("Error al obtener datos");
    }

    const data = await res.json();

    // Mantiene funcionalidad original
    setDatos(Array.isArray(data) ? data : []);

  } catch (error) {
    console.error("Error cargando datos:", error);
    setDatos([]);
  }
};

useEffect(() => {
  cargarDatos();
}, []);


// ================================
//   IMPORTAR EXCEL
// ================================
const importarExcel = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  // 🔧 URL corregida
  await fetch(`${API}/api/importacion/importar-excel`, {
    method: "POST",
    body: formData,
  });

  // Recargar tabla
  cargarDatos();
};


// ================================
//   ELIMINAR REGISTRO IMPORTADO
// ================================
const eliminar = async (id) => {

  // 🔧 URL corregida
  await fetch(`${API}/api/importacion/${id}`, {
    method: "DELETE",
  });

  // Recargar datos
  cargarDatos();
};

  // ================================
  //   UI
  // ================================
  return (
    <div className="w-full p-4">
      {/* ================================
          IMPORTAR
      ================================ */}
      <div className="mb-6">
        <input
          type="file"
          accept=".xlsx,.xls"
          hidden
          ref={fileRef}
          onChange={importarExcel}
        />
        <button
          onClick={() => fileRef.current.click()}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold"
        >
          <Upload size={18} /> Importar Comunidad Estudiantil
        </button>
      </div>

      {/* ================================
          TABLA
      ================================ */}
      <div className="border rounded-xl p-4 bg-white shadow">
        <h3 className="font-semibold text-lg mb-4">Datos Importados</h3>

        <div className="grid grid-cols-3 font-semibold mb-2">
          <span>Nombre</span>
          <span>Carrera</span>
          <span>Opciones</span>
        </div>

        <div className="max-h-72 overflow-y-auto">
          {datos.map((item) => (
            <div
              key={item.id}
              className="grid grid-cols-3 items-center bg-gray-100 p-3 mb-2 rounded-xl"
            >
              <span>
                {item.nombre} {item.apellido_paterno} {item.apellido_materno}
              </span>

              <span>{item.carrera}</span>

              <div className="flex gap-4">
                <button
                  onClick={() => eliminar(item.id)}
                  className="text-red-600 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Eliminar
                </button>

                <button
                  onClick={() =>
                    onGenerarCredencial({
                      nombre: item.nombre,
                      apellidop: item.apellido_paterno,
                      apellidom: item.apellido_materno,
                      curp: item.curp,
                      rfc: item.rfc,
                      numeroIdentificador: item.numero_control,
                      nombreArea: item.carrera,
                      correo: item.correo,
                      tipoPersona: "Alumno",
                    })
                  }
                  className="font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
                >
                  Generar Credencial <IdCard size={18} />
                </button>
              </div>
            </div>
          ))}

          {datos.length === 0 && (
            <p className="text-gray-500 text-sm text-center mt-4">
              No hay registros importados
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComunidadEstudiantil;
