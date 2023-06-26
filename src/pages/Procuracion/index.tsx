import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import { officesIds } from "../../utils/officesIds.js"
import ProcuracionTable from "./Automotor/ProcuracionTable"
import ProcuracionDetailTable from "./Automotor/ProcuracionDetailTable"
import InmueblesTable from "./Inmuebles/InmueblesTable"
import InmueblesDetailTable from "./Inmuebles/InmueblesDetailTable"
import ComercioTable from "./Comercio/ComercioTable"
import ComercioDetailTable from "./Comercio/ComercioDetailTable"

function Procuracion() {
  const { office } = useParams()
  const [nroEmision, setNumeroEmision] = useState("")
  const navigate = useNavigate()
  const officeId = office
    ? officesIds[office?.toUpperCase() as keyof typeof officesIds]?.id
    : ""
  const isLoggedIn = localStorage.getItem("isLoggedIn") as string
  const user = isLoggedIn ? JSON.parse(isLoggedIn) : null

  const officeExist =
    office &&
    user?.oficina?.filter(
      (e: string) => e.toLowerCase() === office.toLowerCase()
    )[0]

  useEffect(() => {
    office && localStorage?.setItem("selectedOffice", office)
    if (!officesIds[office?.toUpperCase() as keyof typeof officesIds]) {
      navigate("/404")
    }
  }, [])
  // if (!officeExist) {
  //   return <h2>No tienes permiso para acceder a este contenido</h2>;
  // }

  if (office == "oficina automotor")
    return (
      <>
        {nroEmision ? (
          <ProcuracionDetailTable
            url={
              "/WebApiShared/Det_notificacion_estado_proc_auto/listarDetalle?nro_emision="
            }
            detail={true}
            nroEmision={nroEmision}
            setNroEmision={setNumeroEmision}
          />
        ) : (
          <ProcuracionTable
            url={
              "/WebApiShared/Notificacion_estado_proc_auto/listNotifProcAuto"
            }
            detail={true}
            nroEmision={nroEmision}
            setNroEmision={setNumeroEmision}
          />
        )}
      </>
    )
  else if (office == "comercio e industria")
    return (
      <>
        {nroEmision ? (
          <ComercioDetailTable
            url={
              "/WebApiShared/Det_notificacion_estado_proc_iyc/listarDetalle?nro_emision="
            }
            detail={true}
            nroEmision={nroEmision}
            setNroEmision={setNumeroEmision}
          />
        ) : (
          <ComercioTable
            url={
              "/WebApiShared/Notificacion_estado_proc_iyc/listNotifProcIyc"
            }
            detail={true}
            nroEmision={nroEmision}
            setNroEmision={setNumeroEmision}
          />
        )}
      </>
    )
  else if (office == "inmuebles")
  return (
    <>
      {nroEmision ? (
        <InmueblesDetailTable
          url={
            "/WebApiShared/Det_notificacion_estado_proc_inm/listarDetalle?nro_emision="
          }
          detail={true}
          nroEmision={nroEmision}
          setNroEmision={setNumeroEmision}
        />
      ) : (
        <InmueblesTable
          url={
            "/WebApiShared/Notificacion_estado_proc_inm/listNotifProcInm"
          }
          detail={true}
          nroEmision={nroEmision}
          setNroEmision={setNumeroEmision}
        />
      )}
    </>
  )
}

export default Procuracion
