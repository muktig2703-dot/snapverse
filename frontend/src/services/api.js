import axios from "axios";

const API = axios.create({
    baseURL: "https://snapverse-api26.onrender.com",
});

export default API;