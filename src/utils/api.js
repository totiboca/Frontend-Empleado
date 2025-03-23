// src/utils/api.js
import axios from "axios";

const API = axios.create({
//   baseURL: "https://prueba-bandejas-production.up.railway.app/api", 
baseURL: "http://localhost:5000/api",
});

export default API;
