// src/pages/MenuEmpleado.js
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Menu.css"; // Importa el CSS

function MenuEmpleado() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="menu-container">
      <h2>MENÚ</h2>
      <nav>
        <ul>
          <li>
            <Link to="/cargar-bandejas">CARGAR BANDEJAS</Link>
          </li>
          <li>
            <Link to="/gestionar-movimientos">GESTIONAR MOVIMIENTOS</Link>
          </li>
          <li>
            <Link to="/subir-csv">SUBIR CSV</Link>
          </li>
          <li>
            <Link to="/saldos">VER SALDOS</Link>
          </li>
        </ul>
      </nav>

      <button onClick={handleLogout} className="logout-button">
        Cerrar Sesión
      </button>
    </div>
  );
}

export default MenuEmpleado;
