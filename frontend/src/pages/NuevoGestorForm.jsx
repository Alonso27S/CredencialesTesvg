import React, { useState } from "react";
import { ArrowLeft, Save } from "lucide-react";

/**
 * Sanitiza entradas para reducir riesgo de SQL Injection
 * (Capa extra en frontend, NO reemplaza seguridad backend)
 */
const sanitizeInput = (value) => {
  if (typeof value !== "string") return value;

  return value
    .replace(/'/g, "")
    .replace(/"/g, "")
    .replace(/;/g, "")
    .replace(/--/g, "")
    .replace(/\/\*/g, "")
    .replace(/\*\//g, "")
    .replace(/=/g, "");
};

/**
 * Componente para crear un nuevo Gestor
 */
const NuevoGestorForm = ({ onBack }) => {
  const [form, setForm] = useState({
    nombre: "",
    apellidoPaterno: "",
    apellidoMaterno: "",
    tipoIdentificador: "",
    numeroIdentificador: "",
    rfc: "",
    curp: "",
    puesto: "",
    nombreArea: "",
    correo: "",
    activo: true,
    id_rol: 2,
    esusuarioinicial: false,
  });

  const [errors, setErrors] = useState({});

  /**
   * Maneja cambios del formulario
   * ⚠️ IMPORTANTE:
   * - Inputs de texto → se sanitizan
   * - Selects → NO se transforman (si no, React no muestra la opción)
   */
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    let newValue = value;

    // ✅ Checkbox normal
    if (type === "checkbox") {
      newValue = checked;
    }

    // ✅ NO tocar selects
    else if (e.target.tagName === "SELECT") {
      newValue = value;
    }

    // ✅ Inputs de texto
    else {
      newValue = sanitizeInput(value);

      if (name === "correo") {
        newValue = newValue.toLowerCase();
      } else {
        newValue = newValue.toUpperCase();
      }
    }

    setForm({
      ...form,
      [name]: newValue,
    });

    setErrors({
      ...errors,
      [name]: "",
    });
  };

  const validarFormulario = () => {
    let newErrors = {};

    const regexTexto = /^[A-Za-zÁÉÍÓÚÑáéíóúñ\s]+$/;
    const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const regexRFC = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;
    const regexCURP = /^[A-Z]{4}\d{6}[HM][A-Z]{5}[A-Z0-9]\d$/;
    const regexSQLInjection = /(select|insert|delete|update|drop|union|--|;)/i;

    Object.keys(form).forEach((field) => {
      if (typeof form[field] === "string" && !form[field].trim()) {
        newErrors[field] = "Campo obligatorio";
      }

      if (
        typeof form[field] === "string" &&
        regexSQLInjection.test(form[field])
      ) {
        newErrors[field] = "Entrada no permitida";
      }
    });

    if (form.nombre && !regexTexto.test(form.nombre))
      newErrors.nombre = "Solo letras";

    if (form.apellidoPaterno && !regexTexto.test(form.apellidoPaterno))
      newErrors.apellidoPaterno = "Solo letras";

    if (form.apellidoMaterno && !regexTexto.test(form.apellidoMaterno))
      newErrors.apellidoMaterno = "Solo letras";

    if (form.correo && !regexCorreo.test(form.correo))
      newErrors.correo = "Correo inválido";

    if (form.rfc && !regexRFC.test(form.rfc))
      newErrors.rfc = "RFC inválido";

    if (form.curp && !regexCURP.test(form.curp))
      newErrors.curp = "CURP inválida";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validarFormulario()) return;

    try {
      const res = await fetch("http://localhost:5000/api/gestores", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.mensaje || "Error al guardar");
        return;
      }

      alert("✅ Gestor creado correctamente\n📧 Contraseña enviada al correo");

      setForm({
        nombre: "",
        apellidoPaterno: "",
        apellidoMaterno: "",
        tipoIdentificador: "",
        numeroIdentificador: "",
        rfc: "",
        curp: "",
        puesto: "",
        nombreArea: "",
        correo: "",
        activo: true,
        id_rol: 2,
        esusuarioinicial: false,
      });

      setErrors({});
    } catch (err) {
      console.error(err);
      alert("Error de conexión");
    }
  };

  const inputClass = (field) =>
    `border px-4 py-3 rounded-lg w-full ${
      errors[field] ? "border-red-500" : ""
    }`;

  return (
    <div className="p-6">
      <h3 className="text-xl font-semibold mb-6 text-[#8A2136]">
        Añadir Nuevo Gestor
      </h3>

      <div className="bg-white p-6 rounded-xl shadow-md border">
        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-5">

          {[
            ["nombre", "Nombre"],
            ["apellidoPaterno", "Apellido Paterno"],
            ["apellidoMaterno", "Apellido Materno"],
          ].map(([name, label]) => (
            <div key={name}>
              <input
                name={name}
                placeholder={label}
                value={form[name]}
                onChange={handleChange}
                className={inputClass(name)}
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}

          <div>
            <select
              name="tipoIdentificador"
              value={form.tipoIdentificador}
              onChange={handleChange}
              className={inputClass("tipoIdentificador")}
            >
              <option value="">Tipo de identificador</option>
              <option value="Numero de Control">Número de Control</option>
              <option value="Matricula">Matrícula</option>
            </select>
            {errors.tipoIdentificador && (
              <p className="text-red-500 text-sm">{errors.tipoIdentificador}</p>
            )}
          </div>

          {[
            ["numeroIdentificador", "Número de Identificador"],
            ["rfc", "RFC"],
            ["curp", "CURP"],
            ["puesto", "Puesto"],
            ["nombreArea", "Área"],
            ["correo", "Correo"],
          ].map(([name, label]) => (
            <div key={name}>
              <input
                name={name}
                type={name === "correo" ? "email" : "text"}
                placeholder={label}
                value={form[name]}
                onChange={handleChange}
                className={inputClass(name)}
              />
              {errors[name] && <p className="text-red-500 text-sm">{errors[name]}</p>}
            </div>
          ))}

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              name="activo"
              checked={form.activo}
              onChange={handleChange}
            />
            Usuario activo
          </label>
        </form>

        <div className="flex justify-center gap-4 mt-10">
          <button
            onClick={onBack}
            className="bg-gray-300 px-6 py-3 rounded-full flex items-center gap-2"
          >
            <ArrowLeft size={18} /> Regresar
          </button>

          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-6 py-3 rounded-full flex items-center gap-2"
          >
            <Save size={18} /> Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NuevoGestorForm;
