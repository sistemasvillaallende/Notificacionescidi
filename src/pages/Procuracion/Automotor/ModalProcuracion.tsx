import React, { useState, useEffect } from "react"
import { Response } from "./ProcuracionDetailTable"
import { Preview } from "../../../base-components/PreviewComponent"
import { Dialog } from "../../../base-components/Headless"
import Button from "../../../base-components/Button"
import { capitalizeFirstLetter } from "../../../utils/helper"
import { useAuthContext } from "../../../context/AuthProvider"
import { validateCuil } from "../../../utils/cuilValidator"
import ModalVerification from "../components/ModalVerification"
import { baseWebApi } from "../../../utils/axiosConfig"
import { officesIds } from "../../../utils/officesIds"

function ModalProcuracion({
  table,
  dataSelected,
  nroEmision,
  statesEmision,
  body,
  setNotificationsSended,
}: any) {
  const [validSelectedStates, setValidSelectedStates] = useState<string[]>([])
  const [validatedData, setValidatedData] = useState<{}[]>()
  const [errorMessage, setErrorMessage] = useState("")
  const [isSend, setIsSend] = useState(false)
  const data = table?.getData()
  const statesArray = dataSelected?.map((row: Response) =>
    capitalizeFirstLetter(row?.estado_Actualizado as string)
  )
  const statesSelected = statesArray?.filter(
    (item: string, index: number) => statesArray.indexOf(item) === index
  )
  const office = window?.localStorage?.getItem("selectedOffice") ?? ""
  const { user } = useAuthContext()
  const officeId = officesIds[office.toUpperCase() as keyof typeof officesIds]?.id ?? 0
  const getStates = async () => {
    setErrorMessage("")
    try {
      const statesWithNotification = statesEmision?.filter(
        (state: { emite_notif_cidi: number }) => state?.emite_notif_cidi == 1
      )
      if (statesWithNotification) {
        if (statesSelected?.length > 0) {
          const validateStates = statesWithNotification.filter(
            (el: { descripcion_estado: string }) =>
              statesSelected.includes(capitalizeFirstLetter(el?.descripcion_estado?.trim()))
          )
          if (validateStates?.length > 0) {
            if (validatedData && validatedData?.length > 0) {
              setErrorMessage("")
            }
            return validateStates.map((state: { descripcion_estado: string }) =>
              capitalizeFirstLetter(state.descripcion_estado?.trim())
            )
          } else
            setErrorMessage(
              "No has seleccionado procuraciones o las seleccionadas no son válidas para notificar"
            )
        } else setErrorMessage("No hay estados seleccionados válidos para notificar")
        return null
      } else setErrorMessage("No hay estados válidos para notificar")
      return null
    } catch (err) {
      console.error(err)
    }
  }

  useEffect(() => {
    setValidatedData([])
    setValidSelectedStates([])
    setErrorMessage("")
  }, [isSend])

  useEffect(() => {
    setValidatedData([])
    setValidSelectedStates([])
    setErrorMessage("Selecciona alguna procuración para iniciar")
  }, [nroEmision])

  useEffect(() => {
    getStates()
      .then((response) => {
        setValidSelectedStates(response)
        return response
      })
      .then((response) => {
        const data = dataSelected?.filter(
          (row: any) =>
            row?.cuit?.length > 1 &&
            row.notificado_cidi == 0 &&
            row?.cuit_valido.trim() === "CUIT_VALIDADO" &&
            validateCuil(row?.cuit.trim()) &&
            response?.includes(capitalizeFirstLetter(row.estado_Actualizado.trim()))
        )
        if (data?.length === 0)
          setErrorMessage("No hay procuraciones seleccionadas válidas para notificar")
        else setErrorMessage("")
        setValidatedData(data)
        return data
      })
  }, [dataSelected])

  const sendNotifications = async () => {
    let successfulCount = 0
    let failedCount = 0
    const successfulNotifications: any = []
    const failedNotifications: any = []

    const notifications = async () => {
      const promisesNotifications = validatedData?.map(async (procuracion: any) => {
        const codigoEstado = statesEmision.find((estado: { descripcion_estado: string }) => {
          return (
            estado.descripcion_estado.trim().toLowerCase() ===
            procuracion.estado_Actualizado.trim().toLowerCase()
          )
        })
        const newPromise = new Promise((resolve) => {
          const headers = {
            "Content-Type": "application/json",
            "hash": user?.hash,
            Accept: "application/json",
          }
          const bodyObject = {
            cuit: procuracion.cuit,
            subject: body[procuracion.estado_Actualizado]?.title,
            body: body[procuracion.estado_Actualizado]?.body,
            Nro_Emision: procuracion.nro_Emision,
            Nro_Notificacion: procuracion.nro_Notificacion,
            nro_procuracion: procuracion.nro_Procuracion,
            id_oficina: parseInt(officeId),
            id_usuario: user?.cod_usuario,
            tipo_proc: 4,
            idTemplate: body[procuracion.estado_Actualizado]?.idTemplate,
            tituloReporte: body[procuracion.estado_Actualizado]?.title,
            cod_estado_actual: codigoEstado?.codigo_estado ?? "",
          }
          baseWebApi
            .post("/ComunicacionesCIDI/enviarNotificacionProcuracion", bodyObject, {
              headers: headers,
            })
            .then((response) => {
              console.log("Notificación enviada correctamente:", response)
              successfulCount++
              successfulNotifications.push(response)
              resolve(procuracion)
            })
            .catch((error) => {
              console.error("Error al enviar notificación:", error)
              setErrorMessage("Error al enviar la notificación")
              failedCount++
              failedNotifications.push(procuracion)
            })
        })
        return newPromise
      })
      if (promisesNotifications) {
        const response = await Promise.all(promisesNotifications)
        console.log("response dentro", response)
        return response
      } else {
        return []
      }
    }
    const resolvedNotifications = await notifications()
    if (resolvedNotifications) {
      setNotificationsSended({
        successfulNotifications: resolvedNotifications?.length,
        failedNotifications: failedNotifications,
      })
      setErrorMessage("")
      setIsSend(true)
      setTimeout(() => {
        setValidatedData([])
        setSuperlargeModalSizePreview(false)
        setIsSend(false)
      }, 3000)
      try {
        return await Promise.all(resolvedNotifications) // Espera a que se cumplan todas las promesas
      } catch (error) {
        // Manejar errores si es necesario
        console.error(error)
        throw error
      }
    } else {
      return [] // Devuelve una matriz vacía si notifications es undefined
    }
  }

  const handleSubmit = async () => {
    try {
      const response = await sendNotifications()
      response && console.log("Notificaciones enviadas exitosamente")
    } catch (error) {
      console.error("Error al enviar notificaciones", error)
    }
  }

  const [superlargeModalSizePreview, setSuperlargeModalSizePreview] = useState(false)

  return (
    <>
      <Preview>
        <div className="flex items-center text-center">
          {/* BEGIN: Super Large Modal Toggle */}
          <Button
            as="a"
            href="#"
            variant="primary"
            onClick={(event: React.MouseEvent) => {
              event.preventDefault()
              setSuperlargeModalSizePreview(true)
            }}
            className={
              errorMessage
                ? "mr-2 sm:ml-5 mt-5 md:mt-0 shadow-md bg-light cursor-not-allowed"
                : "mr-2 sm:ml-5 mt-5 md:mt-0 shadow-md bg-secondary"
            }
          >
            Notificar
          </Button>
          {/* END: Super Large Modal Toggle */}
        </div>

        {/* BEGIN: Super Large Modal Content */}
        <Dialog
          size="xl"
          open={superlargeModalSizePreview}
          onClose={() => {
            setSuperlargeModalSizePreview(false)
          }}
        >
          <Dialog.Panel className="p-10 text-center max-h-[95vh] overflow-y-auto">
            {isSend ? (
              <h2 className="text-success text-xl font-bold">Notificaciones Enviadas con Exito</h2>
            ) : errorMessage?.length > 0 ? (
              <h3 className="font-bold text-lg text-warning">{errorMessage}</h3>
            ) : (
              <>
                <h2 className="font-bold  text-2xl">Crea una nueva notificación</h2>
                <main className="my-6">
                  <article className="text-left my-5 text-base">
                    <p>
                      <span className="">Procuraciones válidas para notificar: </span>
                      {validatedData?.length}
                    </p>
                    <div>
                      <span className="">Estados Seleccionados: </span>
                      <ul>
                        {validSelectedStates?.map((estado) => {
                          const itemsForStates = validatedData?.filter((e: any) =>
                            e.estado_Actualizado.toLowerCase().includes(estado.toLowerCase())
                          )?.length
                          if (itemsForStates && itemsForStates > 0) {
                            return (
                              <li key={estado} className="mt-6">
                                <span className="font-bold text-lg">{`- ${estado}`}</span>
                                <p>
                                  Procuraciones Seleccionadas:
                                  {` ${itemsForStates}`}
                                </p>
                                <span>
                                  <p>Asunto: {body[estado?.toUpperCase()]?.title}</p>
                                  <p className="">Notificación: </p>
                                  <p>{body[estado?.toUpperCase()]?.body}</p>
                                </span>
                              </li>
                            )
                          }
                        })}
                      </ul>
                    </div>
                  </article>
                  <ModalVerification
                    setSuperlargeModalSizePreview={setSuperlargeModalSizePreview}
                    validatedData={validatedData}
                    onClick={handleSubmit}
                  />
                </main>
              </>
            )}
          </Dialog.Panel>
        </Dialog>
        {/* END: Super Large Modal Content */}
      </Preview>
    </>
  )
}

export default ModalProcuracion
