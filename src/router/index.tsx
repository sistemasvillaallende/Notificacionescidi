import { Navigate, Routes, Route } from "react-router-dom"
import SideMenu from "../layouts/SideMenu"
import Notifications from "../pages/Notifications"
import SelectOffice from "../pages/SelectOffice"
import Login from "../pages/Auth/Login"
import Header from "../components/Header"
import NotFound from "../pages/NotFound"
import Procuracion from "../pages/Procuracion"
import ProcuracionComercio from "../pages/ProcuracionComercio"
import { User } from "../context/AuthProvider"
import PermissionDenied from "../pages/PermissionDenied"
const Router = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") ?? false
  const user = isLoggedIn && JSON.parse(isLoggedIn as string)
  const hasSingleOffice = !user?.administrador
  const userOffice = user?.nombre_oficina
  const hasPermission = (requiredRole: number[]) => {
    // Verifica si el usuario está autenticado y si tiene el rol requerido
    console.log(user?.permisos.some((permiso: any) => requiredRole.includes(permiso.cod_proceso)))
    return user?.permisos.some((permiso: any) => requiredRole.includes(permiso.cod_proceso))
  }

  return (
    <>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/login/" element={<Login />} />
        </Routes>
      ) : (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/seleccionar-oficina/" />} />
            {hasSingleOffice ? (
              <Route
                path="/seleccionar-oficina/"
                element={<Navigate to={`/${userOffice}/notificaciones`} />}
              />
            ) : (
              <Route path="/seleccionar-oficina/" element={<SelectOffice />} />
            )}
            <Route path="/:office" element={<SideMenu />}>
              <Route
                path="/:office/notificaciones"
                element={
                  hasPermission([457]) ? (
                    <Notifications />
                  ) : (
                    <Navigate to="/permiso-denegado" replace={true} />
                  )
                }
              />
              <Route
                path="/:office/procuracion"
                element={
                  hasPermission([452, 453, 457]) ? (
                    <Procuracion />
                  ) : (
                    <Navigate to="/permiso-denegado" replace={true} />
                  )
                }
              />
            </Route>
            <Route path="/permiso-denegado" element={<PermissionDenied />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}
    </>
  )
}

export default Router
