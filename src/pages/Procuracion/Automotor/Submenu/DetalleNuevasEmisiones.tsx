import { createIcons, icons } from "lucide"
import React, {
  ChangeEventHandler,
  MouseEventHandler,
  ReactEventHandler,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react"
import { baseUrl, baseWebApi } from "../../../../utils/axiosConfig"
import { TabulatorFull as Tabulator } from "tabulator-tables"
import { capitalizeFirstLetter } from "../../../../utils/helper"
import { FormInput, FormSelect } from "../../../../base-components/Form"
import Lucide from "../../../../base-components/Lucide"
import ModalProcuracion from "./ModalProcuracion"

export interface Response {
  nro_emision?: number
  nro_proc?: number
  nro_cedulon?: number
  nro_notificacion?: number
  dominio?: string
  nro_badec?: number
  nombre?: string
  fecha_baja_real?: string
  fecha_vencimiento?: string
  monto_original?: number
  interes?: number
  descuento?: number
  importe_pagar?: number
  notificado_cidi?: boolean
  codigo_estado_actual?: number
  cuit?: number
}

interface Props {
  url: string
  detail?: boolean
  nroEmision?: string
  setNroEmision: Function
}

const DetallesNuevasEmisiones = ({ url, detail = false, nroEmision, setNroEmision }: Props) => {
  const tableRef = createRef<HTMLDivElement>()
  const tabulator = useRef<Tabulator>()
  const [filter, setFilter] = useState({
    field: "",
    type: "=",
    estado: "",
  })
  const [selectedData, setSelectedData] = useState<any>()
  const [statesEmision, setStateEmision] = useState<any>()
  const [notificationsSended, setNotificationsSended] = useState<any>({})
  const [body, setBody] = useState({})
  const initTabulator = () => {
    if (tableRef.current) {
      tabulator.current = new Tabulator(tableRef.current, {
        ajaxURL: `${baseUrl}${url}${nroEmision}`,
        paginationMode: "local",
        filterMode: "local",
        printStyled: true,
        pagination: true,
        paginationSize: 20,
        paginationSizeSelector: [10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        responsiveLayoutCollapseStartOpen: false,
        placeholder: "No se han encontrado registros",
        columns: [
          {
            title: "",
            width: 16,
            titleFormatter: "rowSelection",
            hozAlign: "center",
            headerSort: false,
            titleFormatterParams: {
              rowRange: "active",
            },
            formatter: "rowSelection",
          },
          {
            title: "",
            formatter: "responsiveCollapse",
            width: 40,
            minWidth: 40,
            hozAlign: "center",
            headerSort: false,
          },
          {
            title: "Nro.",
            width: 80,
            minWidth: 80,
            field: "nro_notificacion",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
          },
          {
            title: "Cedulón",
            width: 80,
            minWidth: 80,
            field: "nro_cedulon",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Procuración",
            minWidth: 90,
            width: 90,
            field: "nro_proc",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Dominio",
            width: 100,
            minWidth: 100,
            field: "dominio",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Badec",
            width: 70,
            minWidth: 50,
            field: "nro_badec",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Nombre",
            minWidth: 100,
            width: 180,
            field: "nombre",
            hozAlign: "left",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: Response = cell.getData()
              return `<div class="h-4 flex items-start w-full">
              <div class="font-normal whitespace-nowrap">${capitalizeFirstLetter(
                response?.nombre as string
              )}</div>
            </div>`
            },
          },
          {
            title: "CUIT",
            minWidth: 100,
            width: 140,
            field: "cuit",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Notificación",
            minWidth: 100,
            width: 150,
            field: "notificado_cidi",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: Response = cell.getData()
              const estado = response?.notificado_cidi
              return `<div class="flex items-center lg:justify-start ${
                response.notificado_cidi ? "text-success" : "text-warning"
              }">
                <span>${estado ? "Notificado" : "No notificado"}</span>
              </div>`
            },
          },
          {
            title: "Fecha Baja",
            minWidth: 120,
            width: 120,
            field: "fecha_baja_real",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
            formatter(cell) {
              const response: Response = cell.getData()
              return `<div class="h-4 flex items-center">
                <div class="font-normal whitespace-nowrap">${new Date(
                  response?.fecha_baja_real as string
                ).toLocaleDateString()}</div>
              </div>`
            },
          },
          {
            title: "Vencimiento",
            minWidth: 120,
            width: 120,
            field: "fecha_vencimiento",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
            formatter(cell) {
              const response: Response = cell.getData()
              return `<div class="h-4 flex items-center">
                <div class="font-normal whitespace-nowrap">${new Date(
                  response?.fecha_vencimiento as string
                ).toLocaleDateString()}</div>
              </div>`
            },
          },
          {
            title: "Debe",
            minWidth: 100,
            width: 140,
            field: "debe",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Monto Original",
            minWidth: 100,
            width: 140,
            field: "monto_original",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Interes",
            minWidth: 100,
            width: 150,
            field: "interes",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Descuento",
            minWidth: 100,
            width: 150,
            field: "descuento",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Importe a pagar",
            minWidth: 100,
            width: 150,
            field: "importe_pagar",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
        ],
      })
    }
  }

  tabulator?.current?.on("renderComplete", () => {
    createIcons({
      icons,
      attrs: {
        "stroke-width": 1.5,
      },
      nameAttr: "data-lucide",
    })
  })

  tabulator.current?.on("rowSelectionChanged", () => {
    setSelectedData(tabulator?.current?.getSelectedData())
  })

  // Redraw table onresize
  const reInitOnResizeWindow = () => {
    window.addEventListener("resize", () => {
      if (tabulator.current) {
        tabulator.current.redraw()
        createIcons({
          icons,
          attrs: {
            "stroke-width": 1.5,
          },
          nameAttr: "data-lucide",
        })
      }
    })
  }

  useEffect(() => {
    return () => {
      setNroEmision("")
      setStateEmision([])
      setSelectedData([])
      setBody({})
    }
  }, [])

  useEffect(() => {
    setSelectedData([])
  }, [notificationsSended])

  useEffect(() => {
    nroEmision && initTabulator()
    reInitOnResizeWindow()
    setBody({})

    baseWebApi(
      `/Estados_procuracion/ListarEstadosxNotifNuevas?nro_emision=${nroEmision}&subsistema=4`
    )
      .then((response: any) => {
        setStateEmision(response.data)
        return response.data
      })
      .then((response: any) => {
        response.map((estado: any) => {
          if (estado.emite_notif_cidi == 1) {
            baseWebApi(
              `/Template_notificacion/ObtenerTextoReporte?idTemplate=${estado.codigo_estado}`
            )
              .then((response) => {
                const title = response?.data[0]?.tituloReporte?.trim()
                const data = response?.data[0]?.reporte?.trim() ?? ""
                const idTemplate = response?.data[0]?.idTemplate
                const stateName = estado?.descripcion_estado
                setBody({
                  ...body,
                  [stateName.trim()]: { idTemplate: idTemplate, title: title, body: data },
                })
              })
              .catch((err) => console.error(err))
          }
        })
      })
  }, [nroEmision])

  const handleBack = () => {
    setNroEmision("")
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const value = e.target.value
    value && setNroEmision(value)
  }

  const handleMinus = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const number = nroEmision && parseInt(nroEmision)
    number && setNroEmision(`${number - 1}`)
  }

  const handlePlus = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    const number = nroEmision && parseInt(nroEmision)
    number && setNroEmision(`${number + 1}`)
  }

  const statesValidated = statesEmision
    ?.filter((state: any) => state.emite_notif_cidi == 1)
    ?.map((el: { descripcion_estado: string; codigo_estado: number }) => {
      return {
        descripcion_estado: capitalizeFirstLetter(el.descripcion_estado.trim()),
        codigo_estado: el.codigo_estado,
      }
    })
  return (
    <>
      <section className="flex flex-col">
        <div className="flex justify-between flex-wrap">
          <div
            className="flex items-center mr-2 text-secondary font-bold text-base text-right hover:underline cursor-pointer"
            onClick={handleBack}
          >
            Volver
          </div>

          <div className="items-baseline lg:pl-8 lg:flex sm:mr-4 mt-2 lg:mt-0 w-full sm:w-auto">
            {tabulator?.current && (
              <FormSelect
                id="tabulator-html-filter-field"
                value={filter.estado}
                onChange={(e) => {
                  const value = e.target.value
                  setFilter({ ...filter, estado: e.target.value })
                  if (value != "nofilter") {
                    tabulator.current?.setFilter("codigo_estado_actual", "=", value)
                  } else {
                    tabulator.current?.clearFilter(true)
                  }
                }}
                className="w-full 2xl:w-full"
              >
                <option value="nofilter">Filtrar por estado</option>
                {statesEmision?.map((state: any) => (
                  <option key={state.codigo_estado} value={state.codigo_estado}>
                    {capitalizeFirstLetter(state.descripcion_estado.trim())}
                  </option>
                ))}
              </FormSelect>
            )}
          </div>

          {/* Input nro de emisión */}

          <div className="flex items-center grow justify-between md:justify-center mt-3 sm:mt-0">
            <h4 className="mr-2 font-bold">Nro. de emisión</h4>
            <button onClick={(e: any) => handleMinus(e)}>
              <Lucide icon="ChevronLeft" className="w-4 h-4 mx-2" />
            </button>
            <FormInput
              type="text"
              value={nroEmision ?? ""}
              className="w-[4rem] text-center"
              onChange={handleChange}
            />
            <button onClick={(e: any) => handlePlus(e)}>
              <Lucide icon="ChevronRight" className="w-4 h-4 mx-2" />
            </button>
          </div>

          {/* Boton y modal */}

          <div>
            <ModalProcuracion
              table={tabulator.current}
              dataSelected={selectedData}
              nroEmision={nroEmision}
              statesEmision={statesEmision}
              body={body}
              setNotificationsSended={setNotificationsSended}
            />
          </div>
        </div>
        <div className="mt-5">
          {statesValidated && (
            <p>
              {" "}
              <span className="font-bold">Estados validos para notificar: </span>
              {statesValidated.map((state: any) =>
                statesValidated.indexOf(state) === 0
                  ? state.descripcion_estado
                  : ", " + state.descripcion_estado
              )}
            </p>
          )}
        </div>
      </section>
      <div className="overflow-x-scroll scrollbar-hidden">
        <div id="tabulator" ref={tableRef} className="mt-5"></div>
      </div>
    </>
  )
}

export default DetallesNuevasEmisiones
