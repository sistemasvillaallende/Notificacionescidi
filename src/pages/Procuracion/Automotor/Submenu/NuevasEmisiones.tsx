import { createIcons, icons } from "lucide"
import React, { createRef, useEffect, useRef } from "react"
import { TabulatorFull as Tabulator } from "tabulator-tables"
import { capitalizeFirstLetter } from "../../../../utils/helper"
import Lucide from "../../../../base-components/Lucide"
interface Response {
  nro_emision?: number
  fecha_emision?: string
  fecha_vencimiento?: string
  cod_estado_procuracion?: number
  nvo_estado_procuracion?: string
  cantidad_reg?: number
  total?: number
  porcentaje?: number
}

interface Props {
  url: string
  detail?: boolean
  nroEmision?: string
  setNroEmision: Function
}

const NuevasEmisiones = ({ url, detail = false, nroEmision, setNroEmision }: Props) => {
  const tableRef = createRef<HTMLDivElement>()
  const tabulator = useRef<Tabulator>()

  const initTabulator = () => {
    if (tableRef.current) {
      tabulator.current = new Tabulator(tableRef.current, {
        ajaxURL: `${import.meta.env.VITE_URL_WEBAPISHARED}${url}`,
        paginationMode: "local",
        filterMode: "remote",
        printStyled: true,
        pagination: true,
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        responsiveLayoutCollapseStartOpen: false,
        placeholder: "No se han encontrado registros",
        columns: [
          {
            title: "",
            formatter: "responsiveCollapse",
            width: 40,
            minWidth: 40,
            hozAlign: "center",
            headerSort: false,
          },
          {
            title: "Emisión",
            minWidth: 90,
            width: 90,
            responsive: 0,
            field: "nro_emision",
            vertAlign: "middle",
            print: false,
            download: false,
            headerSort: false,
            formatter(cell) {
              const response: Response = cell.getData()
              return `<div>
                <div class="font-medium whitespace-nowrap">${response?.nro_emision}</div>
              </div>`
            },
          },
          {
            title: "Fecha",
            width: 100,
            minWidth: 100,
            field: "fecha_emision",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: Response = cell.getData()
              return `<div class="h-4 flex items-center">
                <div class="font-normal whitespace-nowrap">${new Date(
                  response?.fecha_emision as string
                ).toLocaleDateString()}</div>
              </div>`
            },
          },
          {
            title: "Vencimiento",
            width: 150,
            minWidth: 100,
            field: "fecha_vencimiento",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
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
            title: "Registros",
            minWidth: 100,
            width: 120,
            field: "cantidad_reg",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
          },
          {
            title: "Total Adeudado  ",
            minWidth: 100,
            width: 120,
            field: "total_adeudado",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
          },
          {
            title: "Porcentaje",
            minWidth: 100,
            width: 150,
            field: "porcentaje",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "",
            minWidth: 90,
            width: 100,
            responsive: 0,
            field: "nro_Emision",
            vertAlign: "middle",
            print: false,
            download: false,
            headerSort: false,
            formatter(cell) {
              return `<div 
                class="font-medium whitespace-nowrap">Ver detalles</div>`
            },
            cellClick: (e, cell) => {
              const response: Response = cell.getData()
              setNroEmision(response.nro_emision)
            },
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
    initTabulator()
    reInitOnResizeWindow()
    setNroEmision("")
  }, [])

  return (
    <>
      <div className="overflow-x-scroll scrollbar-hidden" style={{ padding: '40px', marginTop: '20px', paddingTop: '0px' }}>
        
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '5px', display: 'flex', alignItems: 'flex-start' }}>  
          <Lucide icon="Car" className="w-4 h-4 mr-2" style={{height: '50px', width: '50px', 
            color: 'rgb(192, 158, 118)', borderRight: 'solid', paddingRight: '10px' }}/> 
          <span style={{paddingTop:'5px', paddingLeft: '10px'}}>Automotores</span> </h1>
        <h1 style={{ fontSize: '16px', fontWeight: '600', color: 'gray', marginLeft: '68px', marginTop: '-30px' }}>
          Procuraciones - Nuevas Emiciones</h1>
        <hr style={{ marginTop: '15px', border: 'solid 1px gray', marginBottom: '20px' }} />
        <div id="tabulator" ref={tableRef} className="mt-5"></div>
      </div>
    </>
  )
}

export default NuevasEmisiones
