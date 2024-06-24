import axios from "axios";

//export const baseUrl = "https://vecino.villaallende.gov.ar"
export const baseUrl = "http://localhost:5298"
export const baseWebApi = axios.create({
  //baseURL: `${baseUrl}/WebApiShared`,
  baseURL: `http://localhost:5298`,
  //baseURL: `http://10.0.0.24/WebApiShared`,
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
  //baseURL: `${baseUrl}/WebApiShared/ComunicacionesCIDI`,
  baseURL: `${baseUrl}/ComunicacionesCIDI`,
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
  //baseURL: `${baseUrl}/WebApiShared`,
  baseURL: `${baseUrl}`,
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
  //baseURL: `${baseUrl}/WebApiShared/Notificacion_digital`,
  baseURL: `${baseUrl}/Notificacion_digital`,
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
  //baseURL: `${baseUrl}/WebApiShared/Notificacion_estado_proc_auto`,
  baseURL: `${baseUrl}/Notificacion_estado_proc_auto`,
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
  //baseURL: `${baseUrl}/WebApiShared/Resoluciones_multas`,
  baseURL: `${baseUrl}/Resoluciones_multas`,
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
