import { Navigate, Routes, Route } from "react-router-dom"
import SideMenu from "../layouts/SideMenu"
import Notifications from "../pages/Notifications"
import SelectOffice from "../pages/SelectOffice"
import Login from "../pages/Auth/Login"
import Header from "../components/Header"
import NotFound from "../pages/NotFound"
import Procuracion from "../pages/Procuracion"
import { User } from "../context/AuthProvider"
import PermissionDenied from "../pages/PermissionDenied"
import { getSecureItem } from "../modules/secureStorage"
import Inicio from "../pages/Inicio"
import { useAuthContext } from "../context/AuthProvider"
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Router = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") ?? false
  const user: User = isLoggedIn && getSecureItem("isLoggedIn")
  // const hasSingleOffice = !user?.administrador
  const userOffice = user?.nombre_oficina

  const hasPermission = (requiredRole: number[], user: User) => {
    // Verifica si el usuario está autenticado y si tiene el rol requerido
    if (user?.administrador) return true
    else return user?.permisos?.some((permiso: any) => requiredRole.includes(permiso.cod_proceso))
  }

  const navigate = useNavigate()

  const [inicio, setInicio] = useState(false);

  useEffect(() => {
    const inicioValue = localStorage.getItem("inicio");
    if (inicioValue === "true") {
      setInicio(true);
    } else {
      setInicio(false);
      navigate("/")
    }
  }, []);

  return (
    <>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/login/" element={<Login />} />
          <Route path="/CIDI/:codigoCIDI" element={<Login />} />
        </Routes>
      ) : (
        <>
          <Header />
          <Routes>
            {inicio ? (
              <Route path="*" element={<Inicio />} />
            ) : (
              <>
                <Route path="/" element={<Navigate to="/seleccionar-oficina/" />} />
                <Route
                  path="/seleccionar-oficina/"
                  element={<Navigate to={`/${userOffice}/notificaciones`} />}
                />
                <Route path="/:office" element={<SideMenu />}>
                  <Route
                    path="/:office/notificaciones"
                    element={
                      <Notifications />
                    }
                  />
                  <Route
                    path="/:office/procuracion"
                    element={
                      hasPermission([452, 452, 454, 460, 461, 462], user) ? (
                        <Procuracion />
                      ) : (
                        <Navigate to="/permiso-denegado" replace={true} />
                      )
                    }
                  />
                </Route>
                <Route path="/permiso-denegado" element={<PermissionDenied />} />
                <Route path="*" element={<NotFound />} />
              </>
            )}
          </Routes>
        </>
      )}
    </>
  )
}

export default Router
