import { Navigate, Routes, Route } from "react-router-dom";
import SideMenu from "../layouts/SideMenu";
import Notifications from "../pages/Notifications";
import SelectOffice from "../pages/SelectOffice";
import Login from "../pages/Auth/Login";
import Header from "../components/Header";
import NotFound from "../pages/NotFound"
const Router = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") || false;
  const user = isLoggedIn ? JSON.parse(isLoggedIn as string) : null;
  const hasSingleOffice = !user?.administrador;
  const userOffice = user?.nombre_oficina;

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
                element={<Notifications />}
              />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default Router;
