import { useState, useContext, createContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAuth, userOffices } from "../utils/axiosConfig";
import { capitalizeFirstLetter } from "../utils/helper";

interface User {
  nombre: string;
  apellido: string;
  email: string;
  userName: string;
  cuit: string;
  tipo: string;
  codigo: string;
  rol: string;
  hash: string;
  img: string;
  oficina:string[]
}

interface AuthContextType {
  user: User | null;
  setUser: (user: User | null) => void;
  handleLogin: (hash: string) => void;
  handleLogout: () => void;
  error: any;
  loading: boolean;
}

const AuthContext = createContext({} as AuthContextType);

export function useAuthContext() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      "useUserContext debe ser utilizado dentro de un UserProvider"
    );
  }
  return context;
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const [error, setError] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleLogin = async (hash: string) => {
    setLoading(true);
    try {
      const response = await userAuth.get("/UsuarioCIDI/ObtenerUsuarioCIDI2", {
        params: {
          Hash: hash,
        },
      });
      const responseOffice: {data:any} = await userOffices.get(`/GetOficinas?cod_usuario=109`)
      const officesResponse:[] = responseOffice?.data
      if (response && officesResponse) {
        setLoading(false);

        if (response.data.respuesta.resultado === "OK") {
          const userData = response.data;
          const offices:string[] = []
          officesResponse.map((e:any)=>offices.push(capitalizeFirstLetter(e.oficina)))
          setUser({
            nombre: userData.nombre.split(' ')[0],
            apellido: userData.apellido.split(' ')[0],
            email: userData.Email,
            userName: userData.nroDocumento,
            cuit: userData.cuil,
            tipo: "admin",
            codigo: "109",
            rol: "Empleado",
            hash: hash,
            img: userData.foto,
            oficina:offices
          });
        } else {
          console.error("Inicio de sesión fallido");
        }
      }
    } catch (error) {
      setError(error);
      console.error("Error al obtener datos del usuario:", error);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem("isLoggedIn");
    setUser(null);
    navigate("/#/login");
  };

  useEffect(() => {
    if (user) {
      localStorage.setItem("isLoggedIn", JSON.stringify(user));

      if (location.hash.includes('login')) {
        if(user.oficina && user.oficina.length > 1) {
        navigate("/seleccionar-oficina/",{replace:true});
      } else if (user.oficina && user.oficina.length === 1) {
        navigate(`/#/${user.oficina[0]}/notificaciones`);
      } else {
        console.error("No se pudo determinar la oficina del usuario");
      }
    }
    }
  }, [user, navigate]);

  return (
    <AuthContext.Provider
      value={{ user, setUser, handleLogin, handleLogout, error, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
}
