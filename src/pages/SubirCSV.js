import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";
import "./SubirCSV.css";

function SubirCSV() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [uploads, setUploads] = useState([]);

  // Al montar el componente, recuperamos el historial
  useEffect(() => {
    fetchUploads();
  }, []);

  const fetchUploads = async () => {
    try {
      const response = await API.get("/empleado/upload-history", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setUploads(response.data);
    } catch (error) {
      console.error("Error al obtener historial:", error);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("Selecciona un archivo CSV");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await API.post("/empleado/cargar-csv", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      alert("Archivo subido y procesado correctamente");
      alert(response.data.msg);
      setFile(null);
      // Actualizamos el historial después de subir
      fetchUploads();
    } catch (error) {
      console.error(error);
      alert("Error al subir el archivo");
      // Actualizamos el historial en caso de error también
      fetchUploads();
    }
  };

  const handleBack = () => {
    navigate("/menu");
  };

  return (
    <div className="subir-container">
      <h2>Subir CSV</h2>
      <form onSubmit={handleSubmit} className="subir-form">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <div className="button-group">
          <button type="submit">Subir</button>
          <button type="button" onClick={handleBack} className="back-button">
            Volver al Menú
          </button>
        </div>
      </form>

      <div className="uploads-list">
        <h3>Historial de Subidas</h3>
        {uploads.length === 0 ? (
          <p>No se han subido archivos aún.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Fecha</th>
                <th>Archivo</th>
                <th>Cantidad</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {uploads.map((item, index) => (
                <tr key={index}>
                 <td>{new Date(item.fecha).toLocaleString()}</td>
                  <td>{item.nombreArchivo}</td>
                  <td>{item.cantidad}</td>
                  <td>{item.estado}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SubirCSV;
