import { Navigate, Routes, Route } from "react-router-dom";
import SideMenu from "../layouts/SideMenu";
import Notifications from "../pages/Notifications";
import SelectOffice from "../pages/SelectOffice";
import Login from "../pages/Auth/Login";
import Header from "../components/Header";
import Procuracion from "../pages/Procuracion";
import NotFound from "../pages/NotFound"
const Router = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") || false;
  const user = isLoggedIn ? JSON.parse(isLoggedIn as string) : null;
  const hasSingleOffice = user?.oficina.length === 1;
  const userOffice = user?.oficina[0];

  return (
    <>
      {!isLoggedIn ? (
        <Routes>
          <Route path="/*" element={<Login />} />
          <Route path="/login/:cidi" element={<Login />} />
        </Routes>
      ) : (
        <>
          <Header />
          <Routes>
            <Route path="/" element={<Navigate to="/login/" />} />
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
              <Route path="/:office/procuracion" element={<Procuracion />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </>
      )}
    </>
  );
};

export default Router;
