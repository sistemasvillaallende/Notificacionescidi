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
import NuevasEmisiones from "./Automotor/Submenu/NuevasEmisiones.js"
import DetalleNuevasEmisiones from "./Automotor/Submenu/DetalleNuevasEmisiones.js"
import { useLocation } from "react-router-dom"
import { getSecureItem } from "../../modules/secureStorage.js"
import NuevasEmisionesC from "./Comercio/submenu/NuevasEmisiones.js"
import DetallesNuevasEmisionesC from "./Comercio/submenu/DetalleNuevasEmisiones.js"

function Procuracion() {
  const { office } = useParams()
  const [nroEmision, setNumeroEmision] = useState("")
  const [user, setUser] = useState<User | null>(null)
  const navigate = useNavigate()
  const isLoggedIn = getSecureItem("isLoggedIn") as string
  const [itemId, setItemId] = useState<string | null>(null)
  const location = useLocation()
  useEffect(() => {
    // Obtiene el valor del parámetro 'id' de la URL
    const searchParams = new URLSearchParams(location.search)
    const id = searchParams.get("id")
    id ? setItemId(id) : setItemId(null)
  }, [location])

  useEffect(() => {
    // Este efecto secundario se ejecuta cuando itemId cambia
    setNumeroEmision("")
  }, [itemId])

  const hasPermission = (requiredRole: number[], user: User) => {
    // Verifica si el usuario está autenticado y si tiene el rol requerido
    if (user?.administrador === true) return true
    else return user?.permisos?.some((permiso: any) => requiredRole.includes(permiso.cod_proceso))
  }

  useEffect(() => {
    const userLocal = isLoggedIn ? getSecureItem("isLoggedIn") : null
    userLocal && setUser(userLocal)
    office && localStorage?.setItem("selectedOffice", office)
    if (!officesIds[office?.toUpperCase() as keyof typeof officesIds]) {
      navigate("/404")
    }
  }, [])

  if (user) {
    if (office == "oficina automotor") {
      if (hasPermission([453, 461], user)) {
        if (itemId && itemId === "nuevasemisiones") {
          return (
            <>
              {nroEmision ? (
                <DetalleNuevasEmisiones
                  url={`${import.meta.env.VITE_URL_WEBAPISHARED}Det_notificacion_auto/listarDetalle?Nro_emision=`}
                  detail={true}
                  nroEmision={nroEmision}
                  setNroEmision={setNumeroEmision}
                />
              ) : (
                <NuevasEmisiones
                  url={"Notificacion_auto/read"}
                  detail={true}
                  nroEmision={nroEmision}
                  setNroEmision={setNumeroEmision}
                />
              )}
            </>
          )
        } else {
          return (
            <>
              {nroEmision ? (
                <ProcuracionDetailTable
                  url={"Det_notificacion_estado_proc_auto/listarDetalle?nro_emision="}
                  detail={true}
                  nroEmision={nroEmision}
                  setNroEmision={setNumeroEmision}
                />
              ) : (
                <ProcuracionTable
                  url={"Notificacion_estado_proc_auto/listNotifProcAuto"}
                  detail={true}
                  nroEmision={nroEmision}
                  setNroEmision={setNumeroEmision}
                />
              )}
            </>
          )
        }
      } else {
        console.log("no tiene permisos")
        return <Navigate to="/permiso-denegado" replace={true} />
      }
    } else if (office == "comercio e industria") {
      if (hasPermission([454, 462], user)) {

        if (itemId && itemId === "nuevasemisiones") {
          return (
            <>
              {nroEmision ? (
                <DetallesNuevasEmisionesC
                  url={"Det_notificacion_iyc/listarDetalle?Nro_emision="}
                  detail={true}
                  nroEmision={nroEmision}
                  setNroEmision={setNumeroEmision}
                />
              ) : (
                <NuevasEmisionesC
                  url={"Notificacion_iyc/read"}
                  detail={true}
                  nroEmision={nroEmision}
                  setNroEmision={setNumeroEmision}
                />
              )}
            </>
          )
        } else {
          return (
            <>
              {nroEmision ? (
                <ComercioDetailTable
                  url={"Det_notificacion_estado_proc_iyc/listarDetalle?nro_emision="}
                  detail={true}
                  nroEmision={nroEmision}
                  setNroEmision={setNumeroEmision}
                />
              ) : (
                <ComercioTable
                  url={"Notificacion_estado_proc_iyc/listNotifProcIyc"}
                  detail={true}
                  nroEmision={nroEmision}
                  setNroEmision={setNumeroEmision}
                />
              )}
            </>
          )
        }
      } else return <Navigate to="/permiso-denegado" replace={true} />
    } else if (office == "inmuebles" && hasPermission([460], user)) {
      if (hasPermission([454, 460], user)) {
        return (
          <>
            {nroEmision ? (
              <InmueblesDetailTable
                url={"/Det_notificacion_estado_proc_inm/listarDetalle?nro_emision="}
                detail={true}
                nroEmision={nroEmision}
                setNroEmision={setNumeroEmision}
              />
            ) : (
              <InmueblesTable
                url={"/Notificacion_estado_proc_inm/listNotifProcInm"}
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
