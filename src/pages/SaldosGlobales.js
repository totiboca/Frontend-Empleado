// src/pages/SaldosGlobales.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./SaldosGlobales.css";

function SaldosGlobales() {
  const navigate = useNavigate();

  // Filtros (tabla principal)
  const [rutaFilterMes, setRutaFilterMes] = useState("");
  const [rutaFilter, setRutaFilter] = useState("");
  const [nombre, setNombre] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [cv, setCv] = useState("");
  const [fletero, setFletero] = useState("");
  const [mes, setMes] = useState(""); // Filtro por mes en la tabla principal

  // NUEVOS: Campos de rango de fechas
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  // Ordenamiento (tabla principal)
  const [sortBy, setSortBy] = useState("");
  const [order, setOrder] = useState("asc");

  // Datos (tabla principal)
  const [datos, setDatos] = useState([]);

  // Datos (tabla ciudad)
  const [datosCiudad, setDatosCiudad] = useState([]);
  const [sortByCity, setSortByCity] = useState("");
  const [orderCity, setOrderCity] = useState("asc");

  // Datos (tabla mes)
  const [datosMes, setDatosMes] = useState([]);
  const [sortByMes, setSortByMes] = useState("");
  const [orderMes, setOrderMes] = useState("asc");

  // ============================================================
  // useEffects para cargar datos
  // ============================================================
  // Carga de la tabla principal cuando cambian filtros/orden (incluyendo rango de fechas)
  useEffect(() => {
    fetchSaldos();
    // eslint-disable-next-line
  }, [rutaFilter, nombre, ciudad, cv, fletero, mes, sortBy, order, fechaInicio, fechaFin]);

  // Carga de totales por ciudad y mes solo al montar o cambiar el filtro de rutaFilterMes
  useEffect(() => {
    fetchSaldosCiudad();
    fetchSaldosMes();
  }, [rutaFilterMes]);

  // ============================================================
  // Funciones para obtener datos desde la API
  // ============================================================
  const fetchSaldos = async () => {
    try {
      const params = new URLSearchParams();
      if (rutaFilter) params.append("ruta", rutaFilter);
      if (nombre) params.append("nombre", nombre);
      if (ciudad) params.append("ciudad", ciudad);
      if (cv) params.append("cv", cv);
      if (fletero) params.append("fletero", fletero);
      if (sortBy) params.append("sortBy", sortBy);
      if (order) params.append("order", order);
      if (mes) params.append("mes", mes);
      if (fechaInicio) params.append("fechaInicio", fechaInicio);
      if (fechaFin) params.append("fechaFin", fechaFin);

      const resp = await API.get(`/empleado/saldos?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDatos(resp.data);
    } catch (error) {
      console.error("Error al obtener saldos:", error);
    }
  };

  const fetchSaldosCiudad = async () => {
    try {
      const resp = await API.get("/empleado/saldos-ciudad", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDatosCiudad(resp.data);
    } catch (error) {
      console.error("Error al obtener saldos por ciudad:", error);
    }
  };

  const fetchSaldosMes = async () => {
    try {
      const params = new URLSearchParams();
      if (rutaFilterMes) params.append("ruta", rutaFilterMes);
      const resp = await API.get("/empleado/saldos-mes?" + params.toString(), {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setDatosMes(resp.data);
    } catch (error) {
      console.error("Error al obtener saldos por mes:", error);
    }
  };

  // ============================================================
  // Ordenamiento tabla principal (se envía al backend)
  // ============================================================
  const handleSort = (column) => {
    if (sortBy === column) {
      setOrder(order === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setOrder("asc");
    }
  };

  // ============================================================
  // Ordenamiento tabla Ciudad (en memoria)
  // ============================================================
  const handleSortCity = (column) => {
    if (sortByCity === column) {
      setOrderCity(orderCity === "asc" ? "desc" : "asc");
    } else {
      setSortByCity(column);
      setOrderCity("asc");
    }
  };

  const getSortedDatosCiudad = () => {
    const sorted = [...datosCiudad];
    sorted.sort((a, b) => {
      let valA, valB;
      switch (sortByCity) {
        case "ciudad":
          valA = a.ciudad || "";
          valB = b.ciudad || "";
          return orderCity === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case "totalCarga":
          valA = Number(a.totalCarga || 0);
          valB = Number(b.totalCarga || 0);
          return orderCity === "asc" ? valA - valB : valB - valA;
        case "totalDevolucion":
          valA = Number(a.totalDevolucion || 0);
          valB = Number(b.totalDevolucion || 0);
          return orderCity === "asc" ? valA - valB : valB - valA;
        case "saldoTotal":
          valA = Number(a.saldoTotal || 0);
          valB = Number(b.saldoTotal || 0);
          return orderCity === "asc" ? valA - valB : valB - valA;
        default:
          return 0;
      }
    });
    return sorted;
  };

  // ============================================================
  // Ordenamiento tabla Mes (en memoria)
  // ============================================================
  const handleSortMes = (column) => {
    if (sortByMes === column) {
      setOrderMes(orderMes === "asc" ? "desc" : "asc");
    } else {
      setSortByMes(column);
      setOrderMes("asc");
    }
  };

  const getSortedDatosMes = () => {
    const sorted = [...datosMes];
    sorted.sort((a, b) => {
      let valA, valB;
      switch (sortByMes) {
        case "mes":
          valA = a.mes || "";
          valB = b.mes || "";
          return orderMes === "asc" ? valA.localeCompare(valB) : valB.localeCompare(valA);
        case "totalCarga":
          valA = Number(a.totalCarga || 0);
          valB = Number(b.totalCarga || 0);
          return orderMes === "asc" ? valA - valB : valB - valA;
        case "totalDevolucion":
          valA = Number(a.totalDevolucion || 0);
          valB = Number(b.totalDevolucion || 0);
          return orderMes === "asc" ? valA - valB : valB - valA;
        case "saldoTotal":
          valA = Number(a.saldoTotal || 0);
          valB = Number(b.saldoTotal || 0);
          return orderMes === "asc" ? valA - valB : valB - valA;
        default:
          return 0;
      }
    });
    return sorted;
  };

  // ============================================================
  // Navegación
  // ============================================================
  const handleVerDetalle = (idRuta) => {
    navigate(`/detalle-ruta/${idRuta}`);
  };

  // ============================================================
  // Cálculo de totales (tabla principal, ciudad, mes)
  // ============================================================
  const totalMainCarga = datos.reduce((acc, cur) => acc + Number(cur.totalCarga || 0), 0);
  const totalMainDevolucion = datos.reduce((acc, cur) => acc + Number(cur.totalDevolucion || 0), 0);
  const totalMainSaldo = datos.reduce((acc, cur) => acc + Number(cur.saldoTotal || 0), 0);

  const totalCiudadCarga = datosCiudad.reduce((acc, cur) => acc + Number(cur.totalCarga || 0), 0);
  const totalCiudadDevolucion = datosCiudad.reduce((acc, cur) => acc + Number(cur.totalDevolucion || 0), 0);
  const totalCiudadSaldo = datosCiudad.reduce((acc, cur) => acc + Number(cur.saldoTotal || 0), 0);

  const totalMesCarga = datosMes.reduce((acc, cur) => acc + Number(cur.totalCarga || 0), 0);
  const totalMesDevolucion = datosMes.reduce((acc, cur) => acc + Number(cur.totalDevolucion || 0), 0);
  const totalMesSaldo = datosMes.reduce((acc, cur) => acc + Number(cur.saldoTotal || 0), 0);

  const sortedCityData = getSortedDatosCiudad();
  const sortedMonthData = getSortedDatosMes();

  return (
    <div className="saldos-container">
      <h2>Saldos de todas las rutas</h2>

      {/* Filtros (tabla principal) */}
      <div className="filtros">
        <div className="filtro-item">
          <label>Mes:</label>
          <input
            type="month"
            value={mes}
            onChange={(e) => setMes(e.target.value)}
            placeholder="AAAA-MM"
          />
        </div>
        <div className="filtro-item">
          <label>Ruta:</label>
          <input
            type="text"
            value={rutaFilter}
            onChange={(e) => setRutaFilter(e.target.value)}
            placeholder="Número de ruta"
          />
        </div>
        <div className="filtro-item">
          <label>Nombre:</label>
          <input
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            placeholder="Nombre del cliente"
          />
        </div>
        <div className="filtro-item">
          <label>Ciudad:</label>
          <input
            type="text"
            value={ciudad}
            onChange={(e) => setCiudad(e.target.value)}
            placeholder="Ciudad"
          />
        </div>
        <div className="filtro-item">
          <label>Logistico:</label>
          <input
            type="text"
            value={fletero}
            onChange={(e) => setFletero(e.target.value)}
            placeholder="Operador Logistico"
          />
        </div>
        <div className="filtro-item">
          <label>Punto de Entrega:</label>
          <input
            type="text"
            value={cv}
            onChange={(e) => setCv(e.target.value)}
            placeholder="Punto de Entrega"
          />
        </div>
        {/* Nuevos campos para rango de fechas */}
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
        <button className="filtrar-button" onClick={fetchSaldos}>
          Filtrar
        </button>
      </div>

      <div className="layout">
        {/* Tabla principal (ordenamiento via backend) */}
        <div className="layout-left">
          <table>
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSort("id_ruta")}>
                  Ruta {sortBy === "id_ruta" && (order === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSort("nombre_ruta")}>
                  Nombre Cliente {sortBy === "nombre_ruta" && (order === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSort("ciudad")}>
                  Ciudad {sortBy === "ciudad" && (order === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSort("canal")}>
                  Canal {sortBy === "canal" && (order === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSort("totalCarga")}>
                  Total Carga {sortBy === "totalCarga" && (order === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSort("totalDevolucion")}>
                  Total Devolución {sortBy === "totalDevolucion" && (order === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSort("saldoTotal")}>
                  Saldo Total {sortBy === "saldoTotal" && (order === "asc" ? "▲" : "▼")}
                </th>
                <th>Detalle</th>
              </tr>
            </thead>
            <tbody>
              {datos.length === 0 ? (
                <tr>
                  <td colSpan="8">No se encontraron registros.</td>
                </tr>
              ) : (
                datos.map((item, idx) => (
                  <tr key={idx}>
                    <td>{item.id_ruta}</td>
                    <td>{item.nombre_ruta}</td>
                    <td>{item.ciudad}</td>
                    <td>{item.canal}</td>
                    <td>{item.totalCarga}</td>
                    <td>{item.totalDevolucion}</td>
                    <td>{item.saldoTotal}</td>
                    <td>
                      <button onClick={() => handleVerDetalle(item.id_ruta)}>
                        Ver Detalle
                      </button>
                    </td>
                  </tr>
                ))
              )}
              {datos.length > 0 && (
                <tr className="total-row">
                  <td colSpan="4"><strong>Total</strong></td>
                  <td><strong>{totalMainCarga}</strong></td>
                  <td><strong>{totalMainDevolucion}</strong></td>
                  <td><strong>{totalMainSaldo}</strong></td>
                  <td></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Panel derecho: Totales por Ciudad y Totales por Mes */}
        <div className="layout-right">
          {/* ================== TABLA MES ================== */}
          <h3>Totales por Mes</h3>
          <div className="month-filter-container">
            <div className="filtro-item small">
              <label>Ruta:</label>
              <input
                type="text"
                value={rutaFilterMes}
                onChange={(e) => setRutaFilterMes(e.target.value)}
                placeholder="Número de ruta"
              />
            </div>
            <button className="filtrar-button" onClick={fetchSaldosMes}>
              Filtrar
            </button>
          </div>
          {rutaFilterMes && datosMes.length > 0 && datosMes[0].rutaNombre && (
            <div className="route-name-display">
              <p>
                Ruta: <strong>{datosMes[0].rutaNombre}</strong>
              </p>
            </div>
          )}
          {rutaFilterMes && (!datosMes.length || !datosMes[0].rutaNombre) && (
            <div className="route-name-display">
              <p>
                Ruta: <strong>{rutaFilterMes}</strong>
              </p>
            </div>
          )}

          <table className="totales-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSortMes("mes")}>
                  Mes {sortByMes === "mes" && (orderMes === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSortMes("totalCarga")}>
                  Total Carga {sortByMes === "totalCarga" && (orderMes === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSortMes("totalDevolucion")}>
                  Total Devolución {sortByMes === "totalDevolucion" && (orderMes === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSortMes("saldoTotal")}>
                  Saldo Total {sortByMes === "saldoTotal" && (orderMes === "asc" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedMonthData.length === 0 ? (
                <tr>
                  <td colSpan="4">No hay datos por mes.</td>
                </tr>
              ) : (
                sortedMonthData.map((item, idx) => {
                  if (!item.mes) return null;
                  const [year, month] = item.mes.split("-");
                  const monthNames = [
                    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
                    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
                  ];
                  const monthName = monthNames[parseInt(month, 10) - 1] || item.mes;
                  return (
                    <tr key={idx}>
                      <td>{`${monthName} - ${year}`}</td>
                      <td>{item.totalCarga}</td>
                      <td>{item.totalDevolucion}</td>
                      <td>{item.saldoTotal}</td>
                    </tr>
                  );
                })
              )}
              {sortedMonthData.length > 0 && (
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{totalMesCarga}</strong></td>
                  <td><strong>{totalMesDevolucion}</strong></td>
                  <td><strong>{totalMesSaldo}</strong></td>
                </tr>
              )}
            </tbody>
          </table>

          {/* ================== TABLA CIUDAD ================== */}
          <h3>Totales por Ciudad</h3>
          <table className="totales-table">
            <thead>
              <tr>
                <th className="sortable" onClick={() => handleSortCity("ciudad")}>
                  Ciudad {sortByCity === "ciudad" && (orderCity === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSortCity("totalCarga")}>
                  Total Carga {sortByCity === "totalCarga" && (orderCity === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSortCity("totalDevolucion")}>
                  Total Devolución {sortByCity === "totalDevolucion" && (orderCity === "asc" ? "▲" : "▼")}
                </th>
                <th className="sortable" onClick={() => handleSortCity("saldoTotal")}>
                  Saldo Total {sortByCity === "saldoTotal" && (orderCity === "asc" ? "▲" : "▼")}
                </th>
                <th>% sobre Total</th>
              </tr>
            </thead>
            <tbody>
              {sortedCityData.length === 0 ? (
                <tr>
                  <td colSpan="5">No hay datos por ciudad.</td>
                </tr>
              ) : (
                sortedCityData.map((item, idx) => {
                  const porcentaje =
                    totalCiudadSaldo !== 0
                      ? ((Number(item.saldoTotal) / totalCiudadSaldo) * 100).toFixed(2)
                      : "0.00";
                  return (
                    <tr key={idx}>
                      <td>{item.ciudad}</td>
                      <td>{item.totalCarga}</td>
                      <td>{item.totalDevolucion}</td>
                      <td>{item.saldoTotal}</td>
                      <td>{porcentaje}%</td>
                    </tr>
                  );
                })
              )}
              {sortedCityData.length > 0 && (
                <tr className="total-row">
                  <td><strong>Total</strong></td>
                  <td><strong>{totalCiudadCarga}</strong></td>
                  <td><strong>{totalCiudadDevolucion}</strong></td>
                  <td><strong>{totalCiudadSaldo}</strong></td>
                  <td><strong>100%</strong></td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default SaldosGlobales;
