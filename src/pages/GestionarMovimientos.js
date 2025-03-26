// src/pages/GestionarMovimientos.js
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./GestionarMovimientos.css";

function GestionarMovimientos() {
  const navigate = useNavigate();
    // Obtenemos la fecha de hoy en formato YYYY-MM-DD
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, "0"); // getMonth() devuelve 0-11
    const dd = String(today.getDate()).padStart(2, "0");
    const ddd = String(today.getDate() + 1).padStart(2, "0");
    const todayLocal = `${yyyy}-${mm}-${dd}`;
    const todayLocal2 = `${yyyy}-${mm}-${ddd}`;

  // Filtros
  const [ruta, setRuta] = useState("");
  const [fechaInicio, setFechaInicio] = useState(todayLocal);
  const [fechaFin, setFechaFin] = useState(todayLocal2);
  const [fletero, setFletero] = useState("");
  const [puntoEntrega, setPuntoEntrega] = useState("");
  const [fechaRemitoInicio, setFechaRemitoInicio] = useState("");
const [fechaRemitoFin, setFechaRemitoFin] = useState("");
const [remito, setRemito] = useState("");

  // Movimientos y edición inline
  const [movimientos, setMovimientos] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editingData, setEditingData] = useState({});

  // Al montar, cargamos los movimientos (sin filtros o con alguno por defecto)
  useEffect(() => {
    fetchMovimientos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Función para obtener movimientos con los filtros
  const fetchMovimientos = async () => {
    try {
      const params = new URLSearchParams();
      if (ruta) params.append("ruta", ruta);
      if (fechaInicio && fechaFin) {
        params.append("fechaInicio", fechaInicio);
        params.append("fechaFin", fechaFin);
      }
      if (fechaRemitoInicio && fechaRemitoFin) {
        params.append("fechaRemitoInicio", fechaRemitoInicio);
        params.append("fechaRemitoFin", fechaRemitoFin);
      }
      if (fletero) params.append("fletero", fletero);
      if (puntoEntrega) params.append("puntoEntrega", puntoEntrega);
      if (remito) params.append("remito", remito);
  
      console.log("GET /empleado/movimientos?" + params.toString());
      const resp = await API.get(`/empleado/movimientos?${params.toString()}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      console.log("Datos recibidos:", resp.data);
      setMovimientos(resp.data);
    } catch (error) {
      console.error("Error al obtener movimientos:", error);
      alert("No se pudieron cargar los movimientos.");
    }
  };
  

  // Al hacer clic en el botón Filtrar
  const handleFiltrar = () => {
    fetchMovimientos();
  };

  // Eliminar un movimiento
  const handleEliminar = async (id) => {
    if (!window.confirm("¿Estás seguro de eliminar este movimiento?")) return;
    try {
      await API.delete(`/empleado/movimientos/${id}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      fetchMovimientos();
    } catch (error) {
      console.error("Error al eliminar el movimiento:", error);
      alert("Error al eliminar el movimiento.");
    }
  };

//Para visualizar la fecha correcta
  const formatDateUTC = (dateStr) => {
    return new Date(dateStr).toLocaleDateString("en-GB", { timeZone: "UTC" });
  };
  

  // Editar inline
  const handleEditar = (mov) => {
    setEditingId(mov.id_movimiento);
    setEditingData({
      fecha_remito: mov.fecha_remito, // asume que mov.fecha_remito es un string o date
      lleva: mov.lleva,
      trae: mov.trae,
      n_remito: mov.n_remito,
      fecha_carga: mov.fecha_carga,
    });
  };

  const handleChange = (e) => {
    setEditingData({ ...editingData, [e.target.name]: e.target.value });
  };

  // Guardar edición
  const handleGuardarEdicion = async (id) => {
    try {
      await API.put(`/empleado/movimientos/${id}`, editingData, {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setEditingId(null);
      setEditingData({});
      fetchMovimientos();
    } catch (error) {
      console.error("Error al actualizar movimiento:", error);
      alert("Error al actualizar el movimiento.");
    }
  };

  // Cancelar edición
  const handleCancelarEdicion = () => {
    setEditingId(null);
    setEditingData({});
  };

  // Calcular totales de carga y devolución
  const totalCarga = movimientos.reduce((acc, mov) => acc + Number(mov.lleva || 0), 0);
  const totalDevolucion = movimientos.reduce((acc, mov) => acc + Number(mov.trae || 0), 0);

  return (
    <div className="gestionar-container">
      <h2>Gestionar Movimientos</h2>

      {/* Filtros */}
      <div className="filtros-movimientos">
  <div>
    <label>Ruta:</label>
    <input
      type="text"
      value={ruta}
      onChange={(e) => setRuta(e.target.value)}
      placeholder="Ej: 1304"
    />
  </div>
  <div>
    <label>Fecha Inicio (carga):</label>
    <input
      type="date"
      value={fechaInicio}
      onChange={(e) => setFechaInicio(e.target.value)}
    />
  </div>
  <div>
    <label>Fecha Fin (carga):</label>
    <input
      type="date"
      value={fechaFin}
      onChange={(e) => setFechaFin(e.target.value)}
    />
  </div>
  <div>
    <label>Fecha Inicio (remito):</label>
    <input
      type="date"
      value={fechaRemitoInicio}
      onChange={(e) => setFechaRemitoInicio(e.target.value)}
    />
  </div>
  <div>
    <label>Fecha Fin (remito):</label>
    <input
      type="date"
      value={fechaRemitoFin}
      onChange={(e) => setFechaRemitoFin(e.target.value)}
    />
  </div>
  <div>
    <label>Fletero:</label>
    <input
      type="text"
      value={fletero}
      onChange={(e) => setFletero(e.target.value)}
      placeholder="Nombre fletero"
    />
  </div>
  <div>
    <label>Punto Entrega:</label>
    <input
      type="text"
      value={puntoEntrega}
      onChange={(e) => setPuntoEntrega(e.target.value)}
      placeholder="Ej: CV"
    />
  </div>
  <div>
    <label>Numero de Remito:</label>
    <input
      type="text"
      value={remito}
      onChange={(e) => setRemito(e.target.value)}
      placeholder="Ej: 123456"
    />
  </div>
  <button onClick={handleFiltrar}>Filtrar</button>
</div>


      <table>
        <thead>
          <tr>
            <th>Fecha Remito</th>
            <th>Remito</th>
            <th>Ruta</th>
            <th>Nombre</th>
            <th>Carga</th>
            <th>Devolución</th>
            <th>Fecha Carga</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {movimientos.length === 0 ? (
            <tr>
              <td colSpan="7">No se encontraron movimientos.</td>
            </tr>
          ) : (
            movimientos.map((mov) => {
              const isEditing = editingId === mov.id_movimiento;
              const carga = Number(mov.lleva || 0);
              const devolucion = Number(mov.trae || 0);
              

              return (
                <tr key={mov.id_movimiento}>
                  {/* Fecha Remito */}
                  <td>
                    {isEditing ? (
                      <input
                        type="date"
                        name="fecha_remito"
                        value={
                          new Date(editingData.fecha_remito).toISOString().substr(0, 10)
                        }
                        onChange={handleChange}
                      />
                    ) : (
                      formatDateUTC(mov.fecha_remito)
                    )}
                  </td>

                  {/* Remito */}
                  <td>
                    {isEditing ? (
                      <input
                        type="text"
                        name="n_remito"
                        value={editingData.n_remito || ""}
                        onChange={handleChange}
                      />
                    ) : (
                      mov.n_remito || "-"
                    )}
                  </td>

                  {/* Ruta */}
                  <td>{mov.id_ruta}</td>

                  {/* Nombre */}
                  <td>{mov.nombre_cliente || "-"}</td>

                  {/* Carga */}
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        name="lleva"
                        value={editingData.lleva}
                        onChange={handleChange}
                      />
                    ) : (
                      carga
                    )}
                  </td>

                  {/* Devolución */}
                  <td>
                    {isEditing ? (
                      <input
                        type="number"
                        name="trae"
                        value={editingData.trae}
                        onChange={handleChange}
                      />
                    ) : (
                      devolucion
                    )}
                  </td>
                  {/* Fecha Carga */}
                  <td>
                    {isEditing ? (
                      <input
                        type="date"
                        name="fecha_carga"
                        value={
                          new Date(editingData.fecha_carga).toISOString().substr(0, 10)
                        }
                        onChange={handleChange}
                      />
                    ) : (
                      new Date(mov.fecha_carga).toLocaleDateString()
                    )}
                  </td>

                  {/* Acciones */}
                  <td>
                    {isEditing ? (
                      <>
                        <button onClick={() => handleGuardarEdicion(mov.id_movimiento)}>
                          ✔️
                        </button>
                        <button onClick={handleCancelarEdicion}>❌</button>
                      </>
                    ) : (
                      <>
                        <button onClick={() => handleEditar(mov)}>✏️</button>
                        <button onClick={() => handleEliminar(mov.id_movimiento)}>🗑️</button>
                      </>
                    )}
                  </td>
                </tr>
              );
            })
          )}

          {/* Fila de totales al final */}
          {movimientos.length > 0 && (
            <tr className="fila-totales">
              <td colSpan="4" style={{ textAlign: "right", fontWeight: "bold" }}>
                Totales:
              </td>
              <td style={{ fontWeight: "bold" }}>{totalCarga}</td>
              <td style={{ fontWeight: "bold" }}>{totalDevolucion}</td>
              <td></td>
            </tr>
          )}
        </tbody>
      </table>

      <button onClick={() => navigate(-1)} className="back-button">
        Volver
      </button>
    </div>
  );
}

// Calcula totales
function totalCarga(movs) {
  return movs.reduce((acc, mov) => acc + Number(mov.lleva || 0), 0);
}
function totalDevolucion(movs) {
  return movs.reduce((acc, mov) => acc + Number(mov.trae || 0), 0);
}

export default GestionarMovimientos;
