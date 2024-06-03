import axios from "axios";

export const baseUrl = "http://10.0.0.24"

export const baseWebApi = axios.create({
  baseURL: `${baseUrl}/WebApiShared`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

baseWebApi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw { response: error?.response?.data };
  }
);

export const comunicacionesCidi = axios.create({
  baseURL: `${baseUrl}/WebApiShared/ComunicacionesCIDI`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

comunicacionesCidi.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw { response: error?.response?.data };
  }
);

// Autenticación
export const userAuth = axios.create({
  baseURL: `${baseUrl}/WebApiShared`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

userAuth.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw { response: error?.response?.data };
  }
);

// Oficinas por usuario
export const userOffices = axios.create({
  baseURL: `${baseUrl}/WebApiShared/Notificacion_digital`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

userOffices.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw { response: error?.response?.data };
  }
);

// Procuración
export const getProcuracion = axios.create({
  baseURL: `${baseUrl}/WebApiShared/Notificacion_estado_proc_auto`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
})

getProcuracion.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw { response: error?.response?.data };
  }
);

// Trae expediente
export const getExpediente = axios.create({
  baseURL: `${baseUrl}/WebApiShared/Resoluciones_multas`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

getExpediente.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    throw { response: error?.response?.data };
  }
);
