import axios from "axios";

export const baseWebApi = axios.create({
  baseURL: `${import.meta.env.VITE_URL_WEBAPISHARED}`,
    headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

baseWebApi.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: { response: { data: any; }; }) => {
    throw { response: error?.response?.data };
  }
);

export const comunicacionesCidi = axios.create({
  baseURL: `${import.meta.env.VITE_URL_WEBAPISHARED}/ComunicacionesCIDI`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

comunicacionesCidi.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: { response: { data: any; }; }) => {
    throw { response: error?.response?.data };
  }
);

// Autenticación
export const userAuth = axios.create({
  baseURL: `${import.meta.env.VITE_URL_WEBAPISHARED}`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

userAuth.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: { response: { data: any; }; }) => {
    throw { response: error?.response?.data };
  }
);

// Oficinas por usuario
export const userOffices = axios.create({
  baseURL: `${import.meta.env.VITE_URL_WEBAPISHARED}/Notificacion_digital`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

userOffices.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: { response: { data: any; }; }) => {
    throw { response: error?.response?.data };
  }
);

// Procuración
export const getProcuracion = axios.create({
  baseURL: `${import.meta.env.VITE_URL_WEBAPISHARED}/Notificacion_estado_proc_auto`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
})

getProcuracion.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: { response: { data: any; }; }) => {
    throw { response: error?.response?.data };
  }
);

// Trae expediente
export const getExpediente = axios.create({
  baseURL: `${import.meta.env.VITE_URL_WEBAPISHARED}/Resoluciones_multas`,
  headers: {
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
});

getExpediente.interceptors.response.use(
  (response: any) => {
    return response;
  },
  (error: { response: { data: any; }; }) => {
    throw { response: error?.response?.data };
  }
);
