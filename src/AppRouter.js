// src/AppRouter.js
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginEmpleado from "./pages/LoginEmpleado";
import RegisterEmpleado from "./pages/RegisterEmpleado";
import MenuEmpleado from "./pages/MenuEmpleado";
import CargarBandejas from "./pages/CargarBandejas";
import SubirCSV from "./pages/SubirCSV";
import SaldosGlobales from "./pages/SaldosGlobales";
import DetalleRuta from "./pages/DetalleRuta";
import GestionarMovimientos from "./pages/GestionarMovimientos"; // Asegúrate de que exista este componente


function AppRouter() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginEmpleado />} />
        <Route path="/registro" element={<RegisterEmpleado />} />
        <Route path="/menu" element={<MenuEmpleado />} />
        <Route path="/cargar-bandejas" element={<CargarBandejas />} />
        <Route path="/subir-csv" element={<SubirCSV />} />
        <Route path="/saldos" element={<SaldosGlobales />} />
        <Route path="/detalle-ruta/:id" element={<DetalleRuta />} />
        <Route path="/gestionar-movimientos" element={<GestionarMovimientos />} />
        
      </Routes>
    </Router>
  );
}

export default AppRouter;
