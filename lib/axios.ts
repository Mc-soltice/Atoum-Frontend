import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  headers: {
    Accept: "application/json",
  },
});

/**
 * Intercepteur pour ajouter le token si présent
 */
api.interceptors.request.use((config) => {

  // Vérifier qu'on est côté navigateur
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("auth_token");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }

  return config;
});

/**
 * Intercepteur de réponse
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {

    if (typeof window !== "undefined") {
      if (error.response?.status === 401) {
        localStorage.removeItem("auth_token");
      }
    }

    return Promise.reject(error);
  }
);

export default api;