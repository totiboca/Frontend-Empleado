import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./CargarBandejas.css";

function CargarBandejas() {
  const navigate = useNavigate();
  const [ruta, setRuta] = useState("");
  const [cliente, setCliente] = useState("");
  const [lleva, setLleva] = useState("");
  const [trae, setTrae] = useState("");
  const [fecha, setFecha] = useState("");
  const [remito, setRemito] = useState("");
  const [confirmacion, setConfirmacion] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");


  // Estado para mostrar error si la ruta no existe
  const [errorRuta, setErrorRuta] = useState("");

  // Buscar cliente al cambiar la ruta
  const handleRutaChange = async (e) => {
    const valor = e.target.value;
    setRuta(valor);
    setCliente("");
    setErrorRuta("");

    if (!valor) return; // Si se borra la ruta, no consultamos nada

    try {
      const resp = await API.get(`/empleado/buscar-cliente?ruta=${valor}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // Suponiendo que si la ruta existe, resp.data.cliente tenga un string con el nombre
      if (resp.data.cliente) {
        setCliente(resp.data.cliente);
        setErrorRuta("");
      } else {
        setCliente("");
        setErrorRuta("La ruta no existe.");
      }
    } catch (error) {
      console.error(error);
      setCliente("");
      setErrorRuta("La ruta no existe.");
    }
  };

  // Validamos antes de mostrar la confirmación
  const handleSubmit = (e) => {
    e.preventDefault();

    // 1. Verificar si la ruta no existe (errorRuta no está vacío)
    if (errorRuta) {
      alert("No puedes continuar: la ruta no existe.");
      return;
    }

    if (!ruta) {
        alert("La ruta es obligatoria.");
        return;
      }

    // 2. Validar que la fecha sea obligatoria
    if (!fecha) {
      alert("La fecha es obligatoria.");
      return;
    }

    // 3. Validar que 'lleva' y 'trae' no sean negativos
    //    y permitir vacíos (los interpretamos como 0).
    const valorLleva = lleva.trim() === "" ? 0 : parseInt(lleva);
    const valorTrae = trae.trim() === "" ? 0 : parseInt(trae);

    if (isNaN(valorLleva) || valorLleva < 0) {
      alert("El campo 'Carga (lleva)' no puede ser negativo.");
      return;
    }
    if (isNaN(valorTrae) || valorTrae < 0) {
      alert("El campo 'Devolución (trae)' no puede ser negativo.");
      return;
    }

    
    // 4. Nueva restricción: Si ambos son 0, no dejamos continuar
    if (valorLleva === 0 && valorTrae === 0) {
        alert("Debes cargar algún valor en Carga o Devolución.");
        return;
      }

      // 5. Validar que la fecha no sea mayor a la fecha actual
  const chosenDate = new Date(fecha);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // establecemos la hora a 00:00 para una comparación correcta
  if (chosenDate > today) {
    alert("La fecha no puede ser mayor a la fecha actual.");
    return;
  }

    // Si todo está bien, mostramos la confirmación
    setConfirmacion(true);
  };

  const confirmarEnvio = async () => {
    try {
      // Armamos el objeto a enviar
      const data = {
        // El servidor espera "id_ruta", así que lo construimos con "ruta"
        id_ruta: parseInt(ruta),
        // El servidor espera "lleva", "trae", "fecha_remito", "n_remito"
        lleva: lleva.trim() === "" ? "0" : lleva,
        trae: trae.trim() === "" ? "0" : trae,
        fecha_remito: fecha, // para que coincida con "fecha_remito"
        n_remito: remito.trim() === "" ? null : remito
      };

      const response=await API.post("/empleado/cargar-bandejas", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      // En vez de alert, mostramos un modal
    setSuccessMessage(response.data.msg || "Datos guardados correctamente.");

      // Limpiar formulario
      setRuta("");
      setCliente("");
      setLleva("");
      setTrae("");
      setFecha("");
      setRemito("");
      setConfirmacion(false);
      setErrorRuta("");
    } catch (error) {
      console.error(error);
      alert("Error al guardar datos");
   // Si el backend devuelve el error "Ya hay un movimiento cargado con ese número de remito"
   if (error.response && error.response.data && error.response.data.error) {
    alert(error.response.data.error);
  } else {
    alert("Error al guardar datos");
  }
    }
  };

  const cancelarEnvio = () => {
    setConfirmacion(false);
  };

  // Botón para volver al menú
  const handleVolverMenu = () => {
    navigate("/menu");
  };

  return (
    <div className="container">
      <h2>Cargar Bandejas</h2>

      <form onSubmit={handleSubmit}>
        {/* Fila de la Ruta */}
        <div className="form-row">
          <label>Ruta:</label>
          <input
            type="text"
            value={ruta}
            onChange={handleRutaChange}
          />
          {errorRuta && <p className="error-ruta">{errorRuta}</p>}
        </div>

        <div className="form-row">
          <label>Cliente:</label>
          <input type="text" value={cliente} disabled />
        </div>

        <div className="form-row">
          <label>Carga (lleva):</label>
          <input
            type="number"
            value={lleva}
            onChange={(e) => setLleva(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Devolución (trae):</label>
          <input
            type="number"
            value={trae}
            onChange={(e) => setTrae(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Fecha:</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
          />
        </div>

        <div className="form-row">
          <label>Remito:</label>
          <input
            type="text"
            value={remito}
            onChange={(e) => setRemito(e.target.value)}
          />
        </div>

        <div className="main-buttons">
    <button type="submit">Aceptar</button>
    <button type="button" onClick={handleVolverMenu} className="volver-button">
      Volver al Menú
    </button>
  </div>
      </form>

       {/* Modal de Confirmación de Datos */}
       {confirmacion && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>¿Estás seguro de los datos ingresados?</h3>
            <ul>
              <li>Ruta: {ruta}</li>
              <li>Cliente: {cliente}</li>
              <li>Lleva: {lleva}</li>
              <li>Trae: {trae}</li>
              <li>Fecha: {fecha}</li>
              <li>Remito: {remito}</li>
            </ul>
            <div className="modal-buttons">
              <button onClick={confirmarEnvio}>Sí, guardar</button>
              <button onClick={cancelarEnvio}>Cancelar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Éxito (si successMessage no está vacío) */}
      {successMessage && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{successMessage}</h3>
            <button onClick={() => setSuccessMessage("")}>Aceptar</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default CargarBandejas;