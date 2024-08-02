import { useState, useContext, createContext, useEffect } from "react"
import { UNSAFE_useRouteId, useNavigate } from "react-router-dom"
import { baseWebApi } from "../utils/axiosConfig"
import { capitalizeFirstLetter } from "../utils/helper"
import { setSecureItem } from "../modules/secureStorage"
import axios from "axios"

export interface User {
  nombre: string
  apellido: string
  email: string
  userName: string
  cuit: string | null
  nombre_oficina: string
  cod_oficina: number
  cod_usuario: string
  administrador: boolean
  img?: string
  hash?: string
  permisos: {}[]
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  handleLogin: (user: string, password: string) => void
  handleLogout: () => void
  error: any
  loading: boolean
  handleLoginCIDI: (codigoCIDI: string) => void
  inicio: boolean
  setInicio: (inicio: boolean) => void
}

const AuthContext = createContext({} as AuthContextType)

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useUserContext debe ser utilizado dentro de un UserProvider")
  }
  return context
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const [error, setError] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [inicio, setInicio] = useState(false)


  const handleLoginCIDI = async (codigoCIDI: string) => {
    console.log("codigoCIDI", codigoCIDI)
    try {
      const response = await axios.get(`${import.meta.env.VITE_URL_WEBAPISHARED}UsuarioCIDI/ObtenerUsuarioCIDI2?Hash=${codigoCIDI}`);
      if (response.data) {
        console.log(response.data)
        const user = response.data;

        const empleado = JSON.parse(response.data.empleado)
        console.log("empleado", empleado)
        const responseOffice: { data: any } = await baseWebApi.get(`/Notificacion_digital/GetOficinas?cod_usuario=${empleado.cod_usuario}`)
        const officesResponse: { oficina: string }[] = responseOffice?.data

        const responsePermisos = await baseWebApi.get(`/Login/GetPermisosCidi?cod_usuario=${empleado.cod_usuario}`)

        if (user.empleado == "N" || !user.empleado) {
          console.log("NO EMPLEADO: ", user.empleado)
        } else {
          const userData = response?.data
          const offices: string[] = []
          officesResponse?.map((e: any) => offices.push(capitalizeFirstLetter(e.oficina)))
          setUser({
            nombre: userData?.nombre,
            apellido: userData?.apellido,
            email: userData?.email,
            userName: empleado?.nombre,
            cuit: userData?.cuil,
            administrador: true,
            cod_oficina: userData?.cod_oficina,
            cod_usuario: empleado.cod_usuario,
            nombre_oficina: officesResponse[0]?.oficina,
            hash: codigoCIDI,
            permisos: !userData?.administrador ? responsePermisos?.data : ["admin"],
          })
        }
      } else {
        setError("Usuario o contraseña incorrectos");
      }
    }
    catch (error) {
      console.error("Error al validar el usuario:", error);
      setError("Usuario o contraseña incorrectos");
    }
  }

  const handleLogin = async (user: string, password: string) => {
    setError(null)
    setLoading(true)

    try {
      const response = await baseWebApi.get(
        `/Login/ValidaUsuarioConOficina?user=${user}&password=${password}`
      )
      console.log("cod_usuario", response?.data?.cod_usuario)
      const responseOffice: { data: any } = await baseWebApi.get(`/Notificacion_digital/GetOficinas?cod_usuario=${response?.data?.cod_usuario}`)
      const officesResponse: { oficina: string }[] = responseOffice?.data
      const responsePermisos = await baseWebApi.get(`/Login/GetPermisosCidi?cod_usuario=${response?.data?.cod_usuario}`)
      if (response && officesResponse) {
        setLoading(false)

        if (response?.statusText === "OK") {
          const userData = response?.data
          const offices: string[] = []
          officesResponse?.map((e: any) => offices.push(capitalizeFirstLetter(e.oficina)))
          setUser({
            nombre: capitalizeFirstLetter(userData?.nombre_completo?.split(" ")[0]) ?? "",
            apellido: capitalizeFirstLetter(userData?.nombre_completo?.split(" ")[1]) ?? "",
            email: userData?.email,
            userName: userData?.nombre,
            cuit: userData?.cuit,
            administrador: userData?.administrador,
            cod_oficina: userData?.cod_oficina,
            cod_usuario: userData?.cod_usuario,
            nombre_oficina: userData?.nombre_oficina,
            permisos: !userData?.administrador ? responsePermisos?.data : ["admin"],
          })
        } else {
          console.error("Inicio de sesión fallido")
        }
      }
    } catch (error) {
      setError(error)
      setLoading(false)
      console.error("Error al obtener datos del usuario:", error)
    }
  }

  const handleLogout = async () => {
    localStorage.removeItem("isLoggedIn")
    setUser(null)
    navigate("#/login")
    location.reload()
  }

  useEffect(() => {
    if (user) {
      setSecureItem("isLoggedIn", user)
      if (location.hash.includes("login")) {
        if (user.administrador === true) {
          navigate("/seleccionar-oficina/", { replace: true })
        } else if (user?.nombre_oficina) {
          navigate(`/${user.nombre_oficina}/notificaciones`)
        } else {
          console.error("No se pudo determinar la oficina del usuario")
        }
      }
    }
  }, [user, navigate])

  useEffect(() => {
    if (user) {
      setSecureItem("isLoggedIn", user)
      navigate(`/${user.nombre_oficina}/notificaciones`)
    }
  }, [user])


  return (
    <AuthContext.Provider value={{
      user,
      setUser,
      handleLogin,
      handleLogout,
      error,
      loading,
      handleLoginCIDI,
      inicio,
      setInicio
    }}>
      {children}
    </AuthContext.Provider>
  )
}
