import { createIcons, icons } from "lucide"
import React, { createRef, useEffect, useRef, useState } from "react"
import { TabulatorFull as Tabulator } from "tabulator-tables"
import { capitalizeFirstLetter } from "../../../utils/helper"
import { FormInput, FormSelect } from "../../../base-components/Form"
import Lucide from "../../../base-components/Lucide"
import ModalProcuracion from "./ModalProcuracion"
import { baseWebApi } from "../../../utils/axiosConfig"
import { ResponseDetailsTable, PropsDetailTable } from "../../../types/notificaiones"

const InmueblesDetailTable = ({ url, detail = false, nroEmision, setNroEmision }: PropsDetailTable) => {
  const tableRef = createRef<HTMLDivElement>()
  const tabulator = useRef<Tabulator>()
  const [filter, setFilter] = useState({
    field: "",
    type: "=",
    estado: "",
  })
  const [selectedData, setSelectedData] = useState<any>()
  const [statesEmision, setStateEmision] = useState<any>()
  const [body, setBody] = useState({})

  const initTabulator = () => {
    if (tableRef.current) {
      tabulator.current = new Tabulator(tableRef.current, {
        ajaxURL: `${import.meta.env.VITE_URL_WEBAPISHARED}${url}${nroEmision}`,
        paginationMode: "local",
        filterMode: "local",
        printStyled: true,
        pagination: true,
        paginationSize: 20,
        paginationSizeSelector: [10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        responsiveLayoutCollapseStartOpen: false,
        groupBy: "estado_Actualizado",
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
            cellClick: function (e, cell) {
              const data: ResponseDetailsTable = cell.getData()
              if (
                statesValidated &&
                statesValidated.includes(
                  capitalizeFirstLetter(data?.estado_Actualizado?.trim() as string)
                )
              )
                cell.getRow().toggleSelect()
            },
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
            title: "Procuración",
            minWidth: 70,
            width: 100,
            field: "nro_procuracion",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Badec",
            width: 80,
            minWidth: 60,
            field: "nro_badec",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "CUIT",
            minWidth: 120,
            width: 120,
            field: "cuit",
            hozAlign: "left",
            headerHozAlign: "center",
            vertAlign: "middle",
          },
          {
            title: "Estado Actual",
            minWidth: 150,
            width: 220,
            field: "estado_Actualizado",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: ResponseDetailsTable = cell.getData()
              return `<div class="h-4 flex items-start w-full">
              <div class="font-normal whitespace-nowrap">${capitalizeFirstLetter(
                response?.estado_Actualizado as string
              )}</div>
            </div>`
            },
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
              const response: ResponseDetailsTable = cell.getData()
              const estado = response?.notificado_cidi
              return `<div class="flex items-center lg:justify-start ${response.notificado_cidi == 1 ? "text-success" : "text-warning"
                }">
                <span>${estado == 1 ? "Enviado" : "No enviado"}</span>
              </div>`
            },
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
              const response: ResponseDetailsTable = cell.getData()
              return `<div class="h-4 flex items-start w-full">
              <div class="font-normal whitespace-nowrap">${capitalizeFirstLetter(
                response?.nombre as string
              )}</div>
            </div>`
            },
          },
          {
            title: "Estado Inicial",
            minWidth: 150,
            width: 180,
            field: "estado_actual",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: ResponseDetailsTable = cell.getData()
              return `<div class="h-4 flex items-start w-full">
              <div class="font-normal whitespace-nowrap">${capitalizeFirstLetter(
                response?.estado_actual as string
              )}</div>
            </div>`
            },
          },
          {
            title: "Vencimiento",
            minWidth: 120,
            width: 120,
            field: "vencimiento",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
            formatter(cell) {
              const response: ResponseDetailsTable = cell.getData()
              return `<div class="h-4 flex items-center">
                <div class="font-normal whitespace-nowrap">${new Date(
                response?.vencimiento as string
              ).toLocaleDateString()}</div>
              </div>`
            },
          },
          {
            title: "Cedulón",
            minWidth: 80,
            width: 100,
            field: "nro_cedulon",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Debe",
            minWidth: 80,
            width: 100,
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
    nroEmision && initTabulator()
    reInitOnResizeWindow()
    setBody({})

    baseWebApi(`/Estados_procuracion/ListarEstadosxNotif?nro_emision=${nroEmision}&subsistema=1`)
      .then((response: any) => {
        setStateEmision(response.data)
        return response.data
      })
      .then((response: any) => {
        response.map((estado: any) => {
          if (estado.emite_notif_cidi == 1) {
            baseWebApi(
              "/Template_notificacion/ObtenerTextoReporte?idTemplate=" + estado.codigo_estado + "&subsistema=3"
            )
              .then((response) => {
                const title = response?.data[0]?.tituloReporte.trim()
                const data = response?.data[0]?.reporte.trim() ?? ""
                const stateName = estado?.descripcion_estado
                setBody({ ...body, [stateName.trim()]: { title: title, body: data } })
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
    ?.map((el: { descripcion_estado: string }) =>
      capitalizeFirstLetter(el.descripcion_estado.trim())
    )
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
                    tabulator.current?.setFilter("estado_Actualizado", "=", value)
                  } else {
                    tabulator.current?.clearFilter(true)
                  }
                }}
                className="w-full 2xl:w-full"
              >
                <option value="nofilter">Filtrar por estado</option>
                {statesEmision?.map((state: any) => (
                  <option key={state.codigo_estado} value={state.descripcion_estado.trim()}>
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
            />
          </div>
        </div>
        <div className="mt-5">
          {statesValidated && (
            <p>
              {" "}
              <span className="font-bold">Estados validos para notificar: </span>
              {statesValidated.join(", ")}
            </p>
          )}
        </div>
      </section>
      <div className="overflow-x-scroll scrollbar-hidden" style={{ padding: '40px', paddingTop: '10px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '600' }}>Procuraciones - Cambio de estado masivo</h1>
        <hr style={{ marginTop: '15px', border: 'solid 1px gray', marginBottom: '35px' }} />
        <div id="tabulator" ref={tableRef} className="mt-5"></div>
      </div>
    </>
  )
}

export default InmueblesDetailTable
