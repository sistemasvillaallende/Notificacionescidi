import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const index = () => {

  const navigate = useNavigate()

  const handleAceptar = () => {
    localStorage.setItem("inicio", "false");
    window.location.reload();
  }

  return (
    <>
      <div className="p-5 intro-y box">
        <div className="flex flex-col items-center sm:items-baseline justify-between intro-y sm:flex-row">
          <div className="overflow-x-scroll scrollbar-hidden" style={{ padding: '40px', paddingTop: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '600' }}>INICIO </h1>
            <p className="mt-9">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Est labore aliquid maxime quibusdam illo iure quaerat atque. Harum nihil nostrum, aspernatur quos, culpa quas, accusantium ad odit cupiditate dolore iure.
            </p>
            <button
              onClick={handleAceptar}
              className="button bg-blue-500 text-white mt-5 p-2 rounded-lg"
            >
              ACEPTAR
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default index

