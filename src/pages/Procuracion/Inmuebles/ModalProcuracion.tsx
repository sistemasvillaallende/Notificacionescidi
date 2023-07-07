import React, { useState, useEffect } from "react"
import { Response } from "./InmueblesDetailTable"
import { Preview } from "../../../base-components/PreviewComponent"
import { Dialog } from "../../../base-components/Headless"
import Button from "../../../base-components/Button"
import { capitalizeFirstLetter } from "../../../utils/helper"
import { useAuthContext } from "../../../context/AuthProvider"
import { validateCuil } from "../../../utils/cuilValidator"
import ModalVerification from "../components/ModalVerification"

function ModalProcuracion({ table, dataSelected, nroEmision, statesEmision, body }: any) {
  const [validSelectedStates, setValidSelectedStates] = useState<string[]>([])
  const [validatedData, setValidatedData] = useState<{}[]>()
  const [errorMessage, setErrorMessage] = useState("")
  const data = table?.getData()
  const statesArray = dataSelected?.map((row: Response) =>
    capitalizeFirstLetter(row?.estado_Actualizado as string)
  )
  const statesSelected = statesArray?.filter(
    (item: string, index: number) => statesArray.indexOf(item) === index
  )
  const office = window?.localStorage?.getItem("selectedOffice") ?? ""
  const { user } = useAuthContext()

  const getStates = async () => {
    try {
      const statesWithNotification = statesEmision?.filter(
        (state: { emite_notif_cidi: number }) => state?.emite_notif_cidi == 1
      )
      if (statesWithNotification) {
        if (statesSelected.length > 0) {
          const validateStates = statesWithNotification?.filter(
            (el: { descripcion_estado: string }) =>
              statesSelected?.includes(capitalizeFirstLetter(el.descripcion_estado.trim()))
          )
          if (validateStates.length > 0) {
            if (validatedData && validatedData?.length > 0) {
              setErrorMessage("")
            }
            return validateStates.map((state: { descripcion_estado: string }) =>
              capitalizeFirstLetter(state.descripcion_estado?.trim())
            )
          } else setErrorMessage("No hay procuraciones seleccionadas válidas para notificar")
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
    setErrorMessage(
      "No has seleccionado procuraciones o las seleccionadas no son válidas para notificar"
    )
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
            validateCuil(row?.cuit.trim()) &&
            response?.includes(capitalizeFirstLetter(row.estado_Actualizado.trim()))
        )
        setValidatedData(data)
        return data
      })
  }, [dataSelected])

  const sendNotifications = () => {
    const notifications = validatedData?.map((procuracion: any) => {
      new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log({
            cuit: procuracion.cuit,
            subject: "",
            body: body[procuracion.estado_Actualizado],
            Nro_Emision: procuracion.nro_emision,
            Nro_Notificacion: procuracion.nro_notificacion,
            nro_procuracion: procuracion.nro_procuracion,
            id_oficina: "23",
            id_usuario: user?.cod_usuario,
            tipo_proc: procuracion.tipo_proc,
          })
        }, 1000)
      })
      console.log("Cargando...")
      return procuracion
    })
    return Promise.all<any>(notifications)
  }

  const handleSubmit = async () => {
    try {
      const response = await sendNotifications()
      response && console.log("Notificaciones enviadas exitosamente")
      console.log("Respuestas:", response)
    } catch (error) {
      console.error("Error al enviar notificaciones", error)
    }
  }

  const [superlargeModalSizePreview, setSuperlargeModalSizePreview] = useState(false)

  return (
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
          // reset();
        }}
      >
        <Dialog.Panel className="p-10 text-center max-h-[95vh] overflow-y-auto">
          {errorMessage?.length > 0 ? (
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
                                <p>Asunto: {body[estado.toUpperCase()]?.title}</p>
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
                <ModalVerification onClick={handleSubmit} />
              </main>
            </>
          )}
        </Dialog.Panel>
      </Dialog>
      {/* END: Super Large Modal Content */}
    </Preview>
  )
}

export default ModalProcuracion
