import React, { useEffect } from "react"
import logo from "../../assets/images/logo.png"
import clsx from "clsx"
import { useAuthContext } from "../../context/AuthProvider"
import LoadingIcon from "../../base-components/LoadingIcon"
import LoginForm from "./LoginForm"
import { useParams } from "react-router-dom";

const Login = () => {
  const { user, error, loading, handleLoginCIDI, handleLoginCooki } = useAuthContext()

  useEffect(() => {
    window.document.title = `Notificaciones CIDI`
    cookieDeEjemplo();
    handleLoginCooki();
    if (error) {
      console.log("error login:", error)
    }
    if (user) {
      location.reload()
    }
  }, [user])

  const cookieDeEjemplo = () => {
    // Valores fijos que se utilizarán para la cookie
    const admin = 1; // 1 significa que es administrador
    const obj = {
      apellido: "Gómez",
      cod_oficina: 123,
      cod_usuario: 456,
      cuit: "20304050607",
      cuit_formateado: "20-30405060-7",
      legajo: 789,
      nombre: "Juan",
      nombre_completo: "Juan Gómez",
      nombre_oficina: "Oficina A",
      nombre_usuario: "jgomez",
    };
    const hash = "tuSesionHash"; // Valor fijo del hash de sesión

    // Definir la fecha de expiración (1000 días a partir de ahora)
    const expireDate = new Date();
    expireDate.setDate(expireDate.getDate() + 1000);

    // Crear un objeto con los datos que quieres guardar en la cookie
    const cookieValue = {
      administrador: admin.toString(),
      apellido: obj.apellido,
      cod_oficina: obj.cod_oficina.toString(),
      cod_usuario: obj.cod_usuario.toString(),
      cuit: obj.cuit,
      cuit_formateado: obj.cuit_formateado,
      legajo: obj.legajo.toString(),
      nombre: obj.nombre,
      nombre_completo: obj.nombre_completo,
      nombre_oficina: obj.nombre_oficina,
      nombre_usuario: obj.nombre_usuario,
      SesionHash: hash,
    };

    // Convertir el objeto a una cadena JSON para guardarlo en la cookie
    const cookieValueString = JSON.stringify(cookieValue);

    // Agregar la cookie con el nombre "VABack.CIDI"
    document.cookie = `VABack.CIDI=${cookieValueString}; expires=${expireDate.toUTCString()}; path=/`;
  }


  const { codigoCIDI } = useParams();
  useEffect(() => {
    handleLoginCIDI(codigoCIDI as string);
  }, []);

  return (
    <>
      <div
        className={clsx([
          "-m-3 sm:-mx-8 p-3 sm:px-8 relative h-screen lg:overflow-hidden bg-secondary xl:bg-white dark:bg-darkmode-800 xl:dark:bg-darkmode-600",
          "before:hidden before:xl:block before:content-[''] before:w-[57%] before:-mt-[28%] before:-mb-[16%] before:-ml-[13%] before:absolute before:inset-y-0 before:left-0 before:transform before:rotate-[-4.5deg] before:bg-secondary/20 before:rounded-[100%] before:dark:bg-darkmode-400",
          "after:hidden after:xl:block after:content-[''] after:w-[57%] after:-mt-[20%] after:-mb-[13%] after:-ml-[13%] after:absolute after:inset-y-0 after:left-0 after:transform after:rotate-[-4.5deg] after:bg-secondary after:rounded-[100%] after:dark:bg-darkmode-700",
        ])}
      >
        <div className="container relative z-10 sm:px-10">
          <div className="block grid-cols-2 gap-4 xl:grid">
            {/* BEGIN: Login Info */}
            <div className="flex-col hidden min-h-screen xl:flex">
              <div className="my-auto">
                <img alt="Logo Villa Allende" className="w-1/2 -mt-16 -intro-x" src={logo} />
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl">
                  {user ? `Bienvenido ${user.nombre} ${user.apellido}` : ""}
                </h2>
                <div className="mt-8 intro-x">
                  <h2 className="text-1xl intro-x xl:text-2xl xl:text-left">
                    {!user && (
                      <>
                        <LoginForm />
                        {loading && (
                          <div className="h-5 my-8">
                            <LoadingIcon icon="three-dots" color="#0F99FF" />
                          </div>
                        )}
                      </>
                    )}
                  </h2>
                  <h3>
                    {error && (
                      <p className="my-5">

                      </p>
                    )}
                  </h3>
                </div>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
      </div>
    </>
  )
}

export default Login
