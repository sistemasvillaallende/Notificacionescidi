import { useState, useContext, createContext, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { baseWebApi, userAuth, userOffices } from "../utils/axiosConfig"
import { capitalizeFirstLetter } from "../utils/helper"

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
  permisos: {}[]
}

interface AuthContextType {
  user: User | null
  setUser: (user: User | null) => void
  handleLogin: (user: string, password: string) => void
  handleLogout: () => void
  error: any
  loading: boolean
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

  const handleLogin = async (user: string, password: string) => {
    setLoading(true)
    try {
      const response = await userAuth.get(
        `/Login/ValidaUsuarioConOficina?user=${user}&password=${password}`
      )
      const responseOffice: { data: any } = await userOffices.get(
        `/GetOficinas?cod_usuario=${response?.data?.cod_usuario}`
      )
      const officesResponse: {}[] = responseOffice?.data
      const responsePermisos = await baseWebApi.get(
        `/Login/GetPermisosCidi?cod_usuario=${response?.data?.cod_usuario}`
      )
      if (response && officesResponse) {
        setLoading(false)

        if (response?.statusText === "OK") {
          const userData = response.data
          const offices: string[] = []
          officesResponse?.map((e: any) => offices.push(capitalizeFirstLetter(e.oficina)))
          setUser({
            nombre: capitalizeFirstLetter(userData.nombre_completo?.split(" ")[0]) ?? "",
            apellido: capitalizeFirstLetter(userData.nombre_completo?.split(" ")[1]) ?? "",
            email: userData.Email,
            userName: userData.nombre,
            cuit: userData.cuit,
            administrador: false,
            cod_oficina: userData.cod_oficina,
            cod_usuario: userData.cod_usuario,
            nombre_oficina: userData.nombre_oficina,
            permisos: responsePermisos?.data,
          })
        } else {
          console.error("Inicio de sesión fallido")
        }
      }
    } catch (error) {
      setError(error)
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
      localStorage.setItem("isLoggedIn", JSON.stringify(user))

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

  return (
    <AuthContext.Provider value={{ user, setUser, handleLogin, handleLogout, error, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
