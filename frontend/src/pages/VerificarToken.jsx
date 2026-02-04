import React, { useState, useEffect } from "react";

const VerificarToken = ({ correo, onVerificado }) => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!correo?.trim()) {
      alert("Error interno: correo no disponible. Vuelve a iniciar sesión.");
    }
  }, [correo]);

  const handleVerify = async (e) => {
    e.preventDefault();

    if (!correo?.trim()) {
      alert("Correo no disponible");
      return;
    }

    if (!/^\d{6}$/.test(token)) {
      alert("El token debe tener 6 dígitos numéricos");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/verificartoken", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          correo: correo.trim(),
          token,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.message || "Token inválido o expirado");
        return;
      }

      alert("✅ Verificación exitosa");
   
      if (data.token) {
      localStorage.setItem("token", data.token);
}
     onVerificado(data);

    } catch (error) {
      console.error(error);
      alert("Error al verificar token");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-xl w-96">
        <h2 className="text-xl font-bold text-center mb-4">
          Verificación en dos pasos
        </h2>

        <p className="text-sm text-gray-600 mb-4 text-center">
          Ingresa el token enviado a tu correo
        </p>

        <form onSubmit={handleVerify} className="space-y-4">
          <input
            type="text"
            maxLength={6}
            inputMode="numeric"
            placeholder="Token de 6 dígitos"
            value={token}
            onChange={(e) =>
              setToken(e.target.value.replace(/\D/g, ""))
            }
            className="w-full border px-4 py-2 rounded-md text-center tracking-widest"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#8A2136] text-white py-2 rounded-md"
          >
            {loading ? "Verificando..." : "Verificar"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerificarToken;