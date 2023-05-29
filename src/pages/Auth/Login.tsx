import React, { useEffect, useState } from "react";
import logo from "../../assets/images/logo.svg";
import logoCIDI from "../../assets/images/cidi.png";
import clsx from "clsx";
import { useAuthContext } from "../../context/AuthProvider";
import { useParams } from "react-router-dom";
import LoadingIcon from "../../base-components/LoadingIcon";

const Login = () => {
  const { handleLogin, user, error, loading } = useAuthContext();
  const { cidi } = useParams();

  useEffect(() => {
    window.document.title = `${import.meta.env.VITE_APLICATION_NAME}`;
    if (cidi) {
      handleLogin(cidi);
    }
    if (error) {
      console.log("error login:", error);
    }
    // if(localStorage.getItem('isLoggedIn')){
    //   location.reload()
    // }
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
                <img
                  alt="Logo Villa Allende"
                  className="w-1/2 -mt-16 -intro-x"
                  src={logo}
                />
              </div>
            </div>
            {/* END: Login Info */}
            {/* BEGIN: Login Form */}
            <div className="flex h-screen py-5 my-10 xl:h-auto xl:py-0 xl:my-0">
              <div className="w-full px-5 py-8 mx-auto my-auto bg-white rounded-md shadow-md xl:ml-20 dark:bg-darkmode-600 xl:bg-transparent sm:px-8 xl:p-0 xl:shadow-none w-3/4 lg:w-2/4 xl:w-auto">
                <h2 className="text-2xl font-bold text-center intro-x xl:text-3xl">
                  {user
                    ? `Bienvenido ${user.nombre} ${user.apellido}`
                    : "Iniciar sesión"}
                </h2>
                <div className="mt-8 intro-x">
                  <h2 className="text-1xl intro-x xl:text-2xl xl:text-left">
                    {!user && (
                      <>
                        <a href={import.meta.env.VITE_URL_CIDI_LOGIN}>
                          <img src={logoCIDI} alt="CIDI" />
                        </a>
                        {loading && (
                          <div className="h-5 my-8">
                            <LoadingIcon icon="three-dots" color="#0F99FF" />
                          </div>
                        )}
                      </>
                    )}
                  </h2>
                  <h3>{error && `ERROR DEL SERVIDOR: ${error.message}`}</h3>
                </div>
              </div>
            </div>
            {/* END: Login Form */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
