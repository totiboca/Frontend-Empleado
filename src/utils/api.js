// src/utils/api.js
import axios from "axios";

const API = axios.create({
//   baseURL: "https://prueba-bandejas-production.up.railway.app/api", 
baseURL: "https://backend-v1-z420.onrender.com/api",
});

export default API;
