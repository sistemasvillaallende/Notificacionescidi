import { useEffect, useState } from "react"
import { Navigate, useNavigate, useParams } from "react-router-dom"
import { officesIds } from "../../utils/officesIds.js"
import ProcuracionTable from "./Automotor/ProcuracionTable"
import ProcuracionDetailTable from "./Automotor/ProcuracionDetailTable"
import InmueblesTable from "./Inmuebles/InmueblesTable"
import InmueblesDetailTable from "./Inmuebles/InmueblesDetailTable"
import ComercioTable from "./Comercio/ComercioTable"
import ComercioDetailTable from "./Comercio/ComercioDetailTable"
import { User } from "../../context/AuthProvider.js"

function Procuracion() {
  const { office } = useParams()
  const [nroEmision, setNumeroEmision] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const isLoggedIn = localStorage.getItem("isLoggedIn") as string

  const hasPermission = (requiredRole: number[]) => {
    // Verifica si el usuario está autenticado y si tiene el rol requerido
    console.log(user?.permisos)
    console.log(user?.permisos?.some((permiso: any) => requiredRole.includes(permiso.cod_proceso)))
    return user?.permisos?.some((permiso: any) => requiredRole.includes(permiso.cod_proceso))
  }

  useEffect(() => {
    const userLocal = isLoggedIn ? JSON.parse(isLoggedIn) : null
    userLocal && setUser(userLocal)
    office && localStorage?.setItem("selectedOffice", office)
    if (!officesIds[office?.toUpperCase() as keyof typeof officesIds]) {
      navigate("/404")
    }
  }, [])
  if (user) {
    if (office == "oficina automotor") {
      if (hasPermission([461])) {
        return (
          <>
            {nroEmision ? (
              <ProcuracionDetailTable
                url={"/WebApiShared/Det_notificacion_estado_proc_auto/listarDetalle?nro_emision="}
                detail={true}
                nroEmision={nroEmision}
                setNroEmision={setNumeroEmision}
              />
            ) : (
              <ProcuracionTable
                url={"/WebApiShared/Notificacion_estado_proc_auto/listNotifProcAuto"}
                detail={true}
                nroEmision={nroEmision}
                setNroEmision={setNumeroEmision}
              />
            )}
          </>
        )
      } else {
        console.log("no tiene permisos")
        return <Navigate to="/permiso-denegado" replace={true} />
      }
    } else if (office == "comercio e industria") {
      if (hasPermission([462])) {
        return (
          <>
            {nroEmision ? (
              <ComercioDetailTable
                url={"/WebApiShared/Det_notificacion_estado_proc_iyc/listarDetalle?nro_emision="}
                detail={true}
                nroEmision={nroEmision}
                setNroEmision={setNumeroEmision}
              />
            ) : (
              <ComercioTable
                url={"/WebApiShared/Notificacion_estado_proc_iyc/listNotifProcIyc"}
                detail={true}
                nroEmision={nroEmision}
                setNroEmision={setNumeroEmision}
              />
            )}
          </>
        )
      } else return <Navigate to="/permiso-denegado" replace={true} />
    } else if (office == "inmuebles" && hasPermission([460])) {
      if (hasPermission([460])) {
        return (
          <>
            {nroEmision ? (
              <InmueblesDetailTable
                url={"/WebApiShared/Det_notificacion_estado_proc_inm/listarDetalle?nro_emision="}
                detail={true}
                nroEmision={nroEmision}
                setNroEmision={setNumeroEmision}
              />
            ) : (
              <InmueblesTable
                url={"/WebApiShared/Notificacion_estado_proc_inm/listNotifProcInm"}
                detail={true}
                nroEmision={nroEmision}
                setNroEmision={setNumeroEmision}
              />
            )}
          </>
        )
      } else return <Navigate to="/permiso-denegado" replace={true} />
    }
  }
  return <></>
}

export default Procuracion
