import axios from "axios";
// export const baseURL = "http://localhost:8080";
export const baseURL = "https://chatappbackend-w9o2.onrender.com";
export const httpClient = axios.create({
  baseURL: baseURL,
});
