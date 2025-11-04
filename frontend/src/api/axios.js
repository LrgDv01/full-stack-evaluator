import axios from 'axios';

const api = axios.create({
  // baseURL: import.meta.env.VITE_API_BASE_URL,
  baseURL: "http://localhost:5215",

});
const url = import.meta.env.VITE_API_BASE_URL;
console.log("API ", url);
console.log("API TYPE", typeof(api.baseURL));


export default api;
