import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../utils/api";
import "./LoginEmpleado.css";

function LoginEmpleado() {
  const navigate = useNavigate();
  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      // Llamada al backend para login
      const response = await API.post("/empleado/login", { usuario, clave });
      const { token, rol } = response.data;

      if (rol !== "Operador") {
        setError("No tienes permisos de empleado");
        return;
      }

      localStorage.setItem("token", token);
      navigate("/menu");
    } catch (err) {
      console.error(err);
      setError("Usuario o contraseña incorrectos.");
    }
  };

  return (
    <div className="login-empleado-container">
      <h2>Login</h2>
      <form className="login-empleado-form" onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label>Usuario</label>
          <input
            type="text"
            value={usuario}
            onChange={(e) => setUsuario(e.target.value)}
            placeholder="Ingrese su usuario"
          />
        </div>
        <div className="form-group">
          <label>Contraseña</label>
          <input
            type="password"
            value={clave}
            onChange={(e) => setClave(e.target.value)}
            placeholder="Ingrese su contraseña"
          />
        </div>
        <button type="submit" className="btn-login">
          Iniciar Sesión
        </button>
      </form>
      <div className="registro-link">
        <Link to="/registro">¿No tienes cuenta? Regístrate</Link>
      </div>
    </div>
  );
}

export default LoginEmpleado;
