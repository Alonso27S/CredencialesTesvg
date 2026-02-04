import { useEffect, useState } from "react";
import axios from "axios";

/* =======================
   CAMPO EDITABLE
======================= */
const CampoEditable = ({ label, value, name, onChange }) => (
  <div className="mb-4">
    <label className="block text-sm font-semibold mb-1">{label}</label>

    {value ? (
      <p className="bg-gray-100 p-2 rounded text-gray-700">{value}</p>
    ) : (
      <input
        type="text"
        name={name}
        className="border p-2 rounded w-full"
        placeholder={`Ingresa ${label}`}
        onChange={onChange}
      />
    )}
  </div>
);

const Perfil = ({ userId }) => {
  const [usuario, setUsuario] = useState(null);
  const [formData, setFormData] = useState({});
  const [foto, setFoto] = useState(null);
  const [preview, setPreview] = useState(null);

  /* =======================
     OBTENER USUARIO
  ======================= */
  const obtenerUsuario = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/usuarios/${userId}`
      );
      setUsuario(res.data);
    } catch (error) {
      console.error(" Error al obtener usuario:", error);
    }
  };

  useEffect(() => {
    obtenerUsuario();
  }, [  ]);

  /* =======================
     MANEJADORES
  ======================= */
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleFoto = (e) => {
    const archivo = e.target.files[0];
    if (!archivo) return;

    setFoto(archivo);
    setPreview(URL.createObjectURL(archivo));
  };

  /* =======================
     GUARDAR FOTO
  ======================= */
  const guardarFoto = async () => {
    if (!foto) return alert("Selecciona o toma una foto");

    try {
      const data = new FormData();
      data.append("foto", foto);

      await axios.put(
        `http://localhost:5000/api/usuarios/${userId}/foto`,
        data,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      alert(" Foto guardada correctamente");
      setFoto(null);
      setPreview(null);
      obtenerUsuario();
    } catch (error) {
      console.error(" Error al subir foto:", error);
    }
  };

  /* =======================
     GUARDAR DATOS
  ======================= */
  const guardarDatos = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/usuarios/${userId}`,
        formData
      );
      alert("Perfil actualizado");
      setFormData({});
      obtenerUsuario();
    } catch (error) {
      console.error("Error al guardar perfil:", error);
    }
  };

  if (!usuario) return <p>Cargando perfil...</p>;

  const nombreCompleto = `${usuario.nombre} ${usuario.apellidop || ""} ${usuario.apellidom || ""}`;

  const hayCamposVacios = Object.values(usuario).some(
    (v) => v === null || v === ""
  );

  /* =======================
     VISTA
  ======================= */
  return (
    <div className="max-w-4xl mx-auto bg-white p-6 rounded shadow grid grid-cols-1 md:grid-cols-3 gap-6">

      {/* ===== COLUMNA IZQUIERDA ===== */}
      <div className="flex flex-col items-center">

        {usuario.foto ? (
          <img
            src={`http://localhost:5000${usuario.foto}`}
            alt="Foto de perfil"
            className="w-40 h-40 rounded-full object-cover border"
          />
        ) : preview ? (
          <img
            src={preview}
            alt="Preview"
            className="w-40 h-40 rounded-full object-cover border"
          />
        ) : (
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
            Sin foto
          </div>
        )}

        <h3 className="mt-4 font-bold text-center">{nombreCompleto}</h3>

        {/* TOMAR FOTO O SUBIR */}
        {!usuario.foto && (
          <>
            <label className="mt-4 w-full text-center cursor-pointer bg-blue-600 text-white py-2 rounded">
               Tomar o subir foto
              <input
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={handleFoto}
              />
            </label>

            {foto && (
              <button
                onClick={guardarFoto}
                className="mt-2 bg-green-600 text-white px-4 py-2 rounded w-full"
              >
                Guardar foto
              </button>
            )}
          </>
        )}
      </div>

      {/* ===== COLUMNA DERECHA ===== */}
      <div className="md:col-span-2">
        <h2 className="text-xl font-bold mb-4">Completa tu información</h2>

        <CampoEditable
          label="RFC"
          value={usuario.rfc}
          name="rfc"
          onChange={handleChange}
        />

        <CampoEditable
          label="CURP"
          value={usuario.curp}
          name="curp"
          onChange={handleChange}
        />

        <CampoEditable
          label="Puesto"
          value={usuario.puesto}
          name="puesto"
          onChange={handleChange}
        />

        <CampoEditable
          label="Área"
          value={usuario.nombrearea}
          name="nombrearea"
          onChange={handleChange}
        />

        {hayCamposVacios && (
          <button
            onClick={guardarDatos}
            className="bg-blue-600 text-white px-4 py-2 rounded mt-4"
          >
            Guardar información
          </button>
        )}
      </div>
    </div>
  );
};

export default Perfil;
