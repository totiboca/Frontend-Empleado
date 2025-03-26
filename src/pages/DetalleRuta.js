// src/pages/DetalleRuta.js
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./DetalleRuta.css";

function DetalleRuta() {
  const { id } = useParams(); // id de la ruta
  const navigate = useNavigate();

  const [movimientos, setMovimientos] = useState([]);
  const [totales, setTotales] = useState({ carga: 0, devolucion: 0, saldo: 0 });

  // Estados para el rango de fechas
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    // Carga inicial (sin filtros de fechas)
    fetchMovimientos();
    // eslint-disable-next-line
  }, [id]);

  const fetchMovimientos = async () => {
    try {
      // Construimos la URL con los parámetros de fecha si existen
      let url = `/empleado/movimientos/${id}`;
      const params = new URLSearchParams();
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      // Si hay query params, los añadimos a la URL
      if (params.toString()) {
        url += "?" + params.toString();
      }

      const response = await API.get(url, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setMovimientos(response.data);

      // Calculamos totales
      let totalCarga = 0, totalDevolucion = 0, totalSaldo = 0;
      response.data.forEach((mov) => {
        const carga = Number(mov.lleva) || 0;
        const devolucion = Number(mov.trae) || 0;
        const saldoDelDia = carga - devolucion;
        totalCarga += carga;
        totalDevolucion += devolucion;
        totalSaldo += saldoDelDia;
      });
      setTotales({ carga: totalCarga, devolucion: totalDevolucion, saldo: totalSaldo });
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
    }
  };

  return (
    <div className="detalle-container">
      <h2>Detalle de Movimientos de la Ruta {id}</h2>
     

      {/* Filtros de rango de fechas */}
      <div className="filtros-detalle">
  <div className="filtro-item">
    <label>Fecha Inicio:</label>
    <input
      type="date"
      value={fechaInicio}
      onChange={(e) => setFechaInicio(e.target.value)}
    />
  </div>
  <div className="filtro-item">
    <label>Fecha Fin:</label>
    <input
      type="date"
      value={fechaFin}
      onChange={(e) => setFechaFin(e.target.value)}
    />
 
  </div>
  <button onClick={fetchMovimientos} className="back-button">
    Filtrar
  </button>
  <button onClick={() => navigate(-1)} className="back-button">
        Volver
      </button>
</div>




      <table>
        <thead>
          <tr>
            <th>Fecha</th>
            <th>Carga</th>
            <th>Devolución</th>
            <th>Saldo del Día</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.length === 0 ? (
            <tr>
              <td colSpan="4">No se encontraron movimientos.</td>
            </tr>
          ) : (
            movimientos.map((mov, index) => {
              const carga = Number(mov.lleva) || 0;
              const devolucion = Number(mov.trae) || 0;
              const saldoDelDia = carga - devolucion;
              const formatDateUTC = (dateStr) => {
                return new Date(dateStr).toLocaleDateString("en-GB", { timeZone: "UTC" });
              };
              return (
                <tr key={index}>
                  <td>{ formatDateUTC(mov.fecha_remito)}</td>
                  <td>{carga}</td>
                  <td>{devolucion}</td>
                  <td>{saldoDelDia}</td>
                </tr>
              );
            })
          )}
          {movimientos.length > 0 && (
            <tr className="totales">
              <td><strong>Totales</strong></td>
              <td><strong>{totales.carga}</strong></td>
              <td><strong>{totales.devolucion}</strong></td>
              <td><strong>{totales.saldo}</strong></td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default DetalleRuta;
