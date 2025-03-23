// src/pages/RegisterEmpleado.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./RegisterEmpleado.css";

function RegisterEmpleado() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [confirmClave, setConfirmClave] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (clave !== confirmClave) {
      setError("Las contraseñas no coinciden");
      return;
    }

    try {
      const response = await API.post("/empleado/registro", { usuario, clave });
      setSuccess(response.data.msg);
      // Opcional: redirigir tras unos segundos
      // setTimeout(() => navigate("/"), 2000);
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.error || "Error en el registro");
    }
  };

  return (
    <div className="register-empleado-container">
      <h2>Registro de Empleado</h2>
      <form className="register-empleado-form" onSubmit={handleSubmit}>
        {error && <div className="error-message">{error}</div>}
        {success && <div className="success-message">{success}</div>}

        <div className="form-group">
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingrese su usuario"
            required
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Ingrese su contraseña"
            required
          />
        </div>
        <div className="form-group">
          <label>Confirmar Contraseña</label>
          <input
            type="password"
            value={confirmClave}
            onChange={(e) => setConfirmClave(e.target.value)}
            placeholder="Confirme su contraseña"
            required
          />
        </div>

        <button type="submit" className="btn-register">
          Registrar
        </button>
      </form>
    </div>
  );
}

export default RegisterEmpleado;
