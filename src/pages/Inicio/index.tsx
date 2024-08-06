import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const index = () => {


  return (
    <>
      <div className="p-5 intro-y box">
        <div className="flex flex-col items-center sm:items-baseline justify-between intro-y sm:flex-row">
          <div className="overflow-x-scroll scrollbar-hidden" style={{ padding: '40px', paddingTop: '10px' }}>
            <h1 style={{ fontSize: '22px', fontWeight: '600' }}>Bienvenido </h1>
            <p className="mt-9">

            </p>
          </div>
        </div>
      </div>
    </>
  )
}

export default index

