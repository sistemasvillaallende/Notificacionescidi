import React, { useState, useEffect } from "react"
import { Response } from "./DetalleNuevasEmisiones"
import { Preview } from "../../../../base-components/PreviewComponent"
import { Dialog } from "../../../../base-components/Headless"
import Button from "../../../../base-components/Button"
import { capitalizeFirstLetter } from "../../../../utils/helper"
import { useAuthContext } from "../../../../context/AuthProvider"
import { validateCuil } from "../../../../utils/cuilValidator"
import ModalVerification from "../../components/ModalVerification"
import { baseWebApi } from "../../../../utils/axiosConfig"
import { officesIds } from "../../../../utils/officesIds"

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
  const statesArray = statesEmision?.filter((row: { codigo_estado: number }) =>
    dataSelected.some((data: Response) => data.codigo_estado_actual === row?.codigo_estado)
  )
  const statesSelected = statesArray?.filter(
    (item: any, index: number) => statesArray.indexOf(item) === index
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
              statesSelected.some((state: any) =>
                state.descripcion_estado.includes(el?.descripcion_estado?.trim())
              )
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
    setErrorMessage("Selecciona alguna procuración válida para notificar")
  }, [nroEmision])

  useEffect(() => {
    if (!isSend) {
      getStates()
        .then((response) => {
          setValidSelectedStates(response)
          return response
        })
        .then((response) => {
          const data = dataSelected?.filter((row: any) => {
            return row?.cuit?.length > 1 && !row.bloqueado && validateCuil(row?.cuit.trim())
          })
          if (data?.length === 0)
            setErrorMessage("No hay procuraciones seleccionadas válidas para notificar")
          else setErrorMessage("")
          setValidatedData(data)
          return data
        })
    }
  }, [dataSelected])

  const sendNotifications = async () => {
    let successfulCount = 0
    let failedCount = 0
    const successfulNotifications: any = []
    const failedNotifications: any = []

    const notifications = validatedData?.map((procuracion: Response) => {
      const descripcion_estado = statesSelected.find(
        (state: { codigo_estado: number }) =>
          procuracion.codigo_estado_actual === state.codigo_estado
      )?.descripcion_estado
      return new Promise((resolve, reject) => {
        const headers = {
          "Content-Type": "application/json",
          Accept: "application/json",
        }
        const bodyObject = {
          cuit: procuracion.cuit,
          subject: body[descripcion_estado]?.title,
          body: body[descripcion_estado]?.body,
          Nro_Emision: procuracion.nro_emision,
          Nro_Notificacion: procuracion.nro_notificacion,
          nro_procuracion: procuracion.nro_proc,
          nro_cedulon: procuracion.nro_cedulon,
          id_oficina: parseInt(officeId),
          id_usuario: user?.cod_usuario,
          tipo_proc: 4,
          idTemplate: body[descripcion_estado]?.idTemplate,
          tituloReporte: body[descripcion_estado]?.title,
          cod_estado_actual: procuracion.codigo_estado_actual ?? "",
        }
        baseWebApi
          .post("/ComunicacionesCIDI/enviarNotificacionProcuracionNuevas", bodyObject, {
            headers: headers,
          })
          .then((response: any) => {
            console.log("Notificación enviada correctamente:", response)
            successfulCount++
            successfulNotifications.push(response)
            resolve(procuracion)
          })
          .catch((error: any) => {
            console.error("Error al enviar notificación:", error)
            failedCount++
            failedNotifications.push(procuracion)
            reject(error)
          })
      })
    })

    if (notifications) {
      setNotificationsSended({
        successfulNotifications: notifications?.length,
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
        return await Promise.all(notifications) // Espera a que se cumplan todas las promesas
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
                        {validSelectedStates?.map((estado: any) => {
                          const codigo_estado = statesSelected?.filter((state: any) =>
                            state?.descripcion_estado
                              .toLowerCase()
                              .trim()
                              .includes(estado.toLowerCase().trim())
                          )?.[0]?.codigo_estado
                          const itemsForStates = validatedData?.filter(
                            (e: Response) => e?.codigo_estado_actual === codigo_estado
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
                    validatedData={validatedData}
                    setSuperlargeModalSizePreview={setSuperlargeModalSizePreview}
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
