import { createIcons, icons } from "lucide";
import React, { createRef, useEffect, useRef } from "react";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { capitalizeFirstLetter } from "../../../utils/helper";
import Lucide from "../../../base-components/Lucide";

interface Response {
  nro_Emision?: number;
  fecha_Emision?: string;
  fecha_Vencimiento?: string;
  cod_Estado_Procuracion?: number;
  nvo_Estado_Procuracion?: string;
  cantidad_Reg?: number;
  total?: number;
  porcentaje?: number;
}

interface Props {
  url: string
  detail?: boolean
  nroEmision?: string
  setNroEmision: Function
}

const ComercioTable = ({ url, detail = false, nroEmision, setNroEmision }: Props) => {
  const tableRef = createRef<HTMLDivElement>();
  const tabulator = useRef<Tabulator>();

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
            field: "nro_Emision",
            vertAlign: "middle",
            print: false,
            download: false,
            headerSort: false,
            formatter(cell) {
              const response: Response = cell.getData();
              return `<div>
                <div class="font-medium whitespace-nowrap">${response?.nro_Emision}</div>
              </div>`;
            },
          },
          {
            title: "Fecha",
            width: 100,
            minWidth: 100,
            field: "fecha_Emision",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: Response = cell.getData();
              return `<div class="h-4 flex items-center">
                <div class="font-normal whitespace-nowrap">${new Date(
                response?.fecha_Emision as string
              ).toLocaleDateString()}</div>
              </div>`;
            },
          },
          {
            title: "Vencimiento",
            width: 150,
            minWidth: 100,
            field: "fecha_Vencimiento",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: Response = cell.getData();
              return `<div class="h-4 flex items-center">
                <div class="font-normal whitespace-nowrap">${new Date(
                response?.fecha_Vencimiento as string
              ).toLocaleDateString()}</div>
              </div>`;
            },
          },
          {
            title: "Estado",
            minWidth: 150,
            width: 220,
            field: "nvo_Estado_Procuracion",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
            formatter(cell) {
              const response: Response = cell.getData();
              return `<div class="h-4 flex items-center w-full">
              <div class="font-normal whitespace-nowrap">${capitalizeFirstLetter(
                response?.nvo_Estado_Procuracion as string
              )}</div>
            </div>`;
            },
          },
          {
            title: "Registros",
            minWidth: 120,
            width: 150,
            field: "cantidad_Reg",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
          },
          {
            title: "Total",
            minWidth: 100,
            width: 120,
            field: "total",
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
                class="font-medium whitespace-nowrap">Ver detalles</div>`;
            },
            cellClick: (e, cell) => {
              const response: Response = cell.getData();
              setNroEmision(response.nro_Emision)
            }
          },
        ],
      });
    }
  };

  tabulator?.current?.on("renderComplete", () => {
    createIcons({
      icons,
      attrs: {
        "stroke-width": 1.5,
      },
      nameAttr: "data-lucide",
    });
  });

  // Redraw table onresize
  const reInitOnResizeWindow = () => {
    window.addEventListener("resize", () => {
      if (tabulator.current) {
        tabulator.current.redraw();
        createIcons({
          icons,
          attrs: {
            "stroke-width": 1.5,
          },
          nameAttr: "data-lucide",
        });
      }
    });
  };

  // On reset filter
  // const onResetFilter = () => {
  //   setFilter({
  //     ...filter,
  //     field: "",
  //     type: "=",
  //     cuil: "",
  //     estado: "",
  //   });
  //   setCuilInput({ ...cuilInput, reset: false });
  //   // onFilter();
  // };

  useEffect(() => {
    initTabulator();
    reInitOnResizeWindow();
  }, []);

  return (
    <>
      <div className="overflow-x-scroll scrollbar-hidden" style={{ padding: '40px', marginTop: '20px', paddingTop: '0px' }}>
        
        <h1 style={{ fontSize: '22px', fontWeight: '600', marginBottom: '5px', display: 'flex', alignItems: 'flex-start' }}>  
          <Lucide icon="Factory" className="w-4 h-4 mr-2" style={{height: '50px', width: '50px', 
            color: 'rgb(192, 158, 118)', borderRight: 'solid', paddingRight: '10px' }}/> 
          <span style={{paddingTop:'5px', paddingLeft: '10px'}}>Industria y Comercio</span> </h1>
        <h1 style={{ fontSize: '16px', fontWeight: '600', color: 'gray', marginLeft: '68px', marginTop: '-30px' }}>
          Procuraciones - Cambio de estado masivo</h1>
        <hr style={{ marginTop: '15px', border: 'solid 1px gray', marginBottom: '20px' }} />
        <div id="tabulator" ref={tableRef} className="mt-5"></div>
      </div>
    </>
  );
};

export default ComercioTable;
