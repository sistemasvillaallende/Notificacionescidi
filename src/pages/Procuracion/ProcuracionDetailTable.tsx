import { createIcons, icons } from "lucide";
import React, {
  ChangeEventHandler,
  MouseEventHandler,
  ReactEventHandler,
  createRef,
  useEffect,
  useRef,
  useState,
} from "react";
import { baseUrl } from "../../utils/axiosConfig";
import { TabulatorFull as Tabulator } from "tabulator-tables";
import { capitalizeFirstLetter } from "../../utils/helper";
import { FormInput, FormSelect } from "../../base-components/Form";
import Lucide from "../../base-components/Lucide";
import NotificationModal from "../../components/NotificationModal";

interface Response {
  nro_Emision?: number;
  nro_Procuracion?: number;
  dominio?: string;
  nro_Badec?: number;
  nombre?: string;
  estado_Actual?: string;
  estado_Actualizado?: string;
  notificado_cidi?: string;
  vencimiento?: string;
  monto_original?: number;
  interes?: number;
  descuento?: number;
  importe_pagar?: number;
}

interface Props {
  url: string;
  detail?: boolean;
  nroEmision?: string;
  setNroEmision: Function;
}

const ProcuracionDetailTable = ({
  url,
  detail = false,
  nroEmision,
  setNroEmision,
}: Props) => {
  const tableRef = createRef<HTMLDivElement>();
  const tabulator = useRef<Tabulator>();
  const [emision, setEmision] = useState<null | string>(null);
  const [filter, setFilter] = useState({
    field: "",
    type: "=",
    estado:""
  });
  const [selectStates, setSelect] = useState<string[]>([])

  const initTabulator = () => {
    if (tableRef.current) {
      tabulator.current = new Tabulator(tableRef.current, {
        ajaxURL: `${baseUrl}${url}${emision}`,
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
            cellClick:function(e, cell){
              cell.getRow().toggleSelect();
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

          // For HTML table
          {
            title: "Procuración",
            minWidth: 90,
            width: 90,
            responsive: 0,
            field: "nro_Procuracion",
            vertAlign: "middle",
            print: false,
            download: false,
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
            width: 100,
            minWidth: 100,
            field: "nro_Badec",
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
              const response: Response = cell.getData();
              return `<div class="h-4 flex items-start">
              <div class="font-normal whitespace-nowrap">${capitalizeFirstLetter(
                response?.nombre as string
              )}</div>
            </div>`;
            },
          },
          {
            title: "CUIT",
            minWidth: 120,
            width: 120,
            field: "cuit",
            // responsive: 1,
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            headerSort: false,
          },
          {
            title: "Estado Inicial",
            minWidth: 150,
            width: 180,
            field: "estado_Actual",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: Response = cell.getData();
              return `<div class="h-4 flex items-start">
              <div class="font-normal whitespace-nowrap">${capitalizeFirstLetter(
                response?.estado_Actual as string
              )}</div>
            </div>`;
            },
          },
          {
            title: "Estado Actual",
            minWidth: 150,
            width: 180,
            field: "estado_Actualizado",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: Response = cell.getData();
              return `<div class="h-4 flex items-start">
              <div class="font-normal whitespace-nowrap">${capitalizeFirstLetter(
                response?.estado_Actualizado as string
              )}</div>
            </div>`;
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
            print: false,
            download: false,
            formatter(cell) {
              const response: Response = cell.getData();
              const estado = response?.notificado_cidi;
              return `<div class="flex items-center lg:justify-start ${
                response.notificado_cidi == "1"
                  ? "text-success"
                  : "text-warning"
              }">
                <span>${estado == "1" ? "Notificado" : "No notificado"}</span>
              </div>`;
            },
          },
          // {
          //   title: "Vencimiento",
          //   minWidth: 120,
          //   width: 120,
          //   field: "vencimiento",
          //   // responsive: 1,
          //   hozAlign: "center",
          //   headerHozAlign: "center",
          //   vertAlign: "middle",
          //   headerSort: false,
          //   formatter(cell) {
          //     const response: Response = cell.getData();
          //     return `<div class="h-4 flex items-center">
          //       <div class="font-normal whitespace-nowrap">${new Date(
          //         response?.vencimiento as string
          //       ).toLocaleDateString()}</div>
          //     </div>`;
          //   },
          // },
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

  // Filter function
  // const onFilter = () => {
  //   const { cuil, estado, field } = filter;
  //   const table = tabulator?.current;

  //   if (table && field) {
  //     if (cuil && field === "cuil") {
  //       const cuilIsValid = validateCuil(cuil);

  //       if (cuilIsValid) {
  //         try {
  //           setFilter({ ...filter, estado: "" });
  //           table.setData(
  //             `${baseUrl}/webapishared/Notificacion_digital/listNotifxcuil?cuil=${cuil}`
  //           );
  //           setCuilInput({ ...cuilInput, error: false, reset: true });
  //         } catch (err) {
  //           console.log(err);
  //         }
  //       } else setCuilInput({ ...cuilInput, error: true });
  //     } else if (estado && field === "estado") {
  //       try {
  //         table.setData(
  //           `${baseUrl}/webapishared/Notificacion_digital/ListNotifxEstado?cod_estado=${estado}`
  //         );
  //       } catch (err) {
  //         console.log(err);
  //       }
  //     }
  //   }
  // };

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
    setEmision(nroEmision as string);
    
  }, []);

  useEffect(() => {
    emision && initTabulator();
    reInitOnResizeWindow();
    setTimeout(()=> {
      const data = tabulator.current?.getData() as {}[]
      const dataState = data.map((row:any)=>row.estado_Actualizado)
      const dataFilter:string[] = dataState?.filter((item, index)=> dataState.indexOf(item) === index)
      setSelect(dataFilter)}
      ,1000)

  }, [emision]);

  const handleBack = () => {
    setNroEmision("");
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const value = e.target.value;
    value && setEmision(value);
  };

  const handleMinus = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const number = emision && parseInt(emision);
    number && setEmision(`${number - 1}`);
  };

  const handlePlus = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const number = emision && parseInt(emision);
    number && setEmision(`${number + 1}`);
  };

  const handleFilter = () => {

  }

  return (
    <>
      <section className="flex justify-between">
        <div
          className="text-secondary font-bold text-lg text-right hover:underline cursor-pointer"
          onClick={handleBack}
        >
          Volver
        </div>

        <div className="items-baseline lg:pl-8 lg:flex sm:mr-4 mt-2 lg:mt-0">
              {tabulator?.current && <FormSelect
                id="tabulator-html-filter-field"
                value={filter.estado}
                onChange={(e) => {
                  const value = e.target.value
                  setFilter({...filter, estado:e.target.value})
                  if(value != 'nofilter'){
                    tabulator.current?.setFilter("estado_Actualizado", "=", value)
                  }else{
                    tabulator.current?.clearFilter(true)
                  }
                  
                }}
                className="w-full 2xl:w-full sm:w-auto"
              >
                <option value="nofilter">Filtrar por estado</option>
                { selectStates?.map((state:string)=>(
                   <option key= {state} value={state}>{state}</option>
                )) }
              </FormSelect>}
            </div>

        <div className="flex items-center">
          <h4 className="mr-2 font-bold">Nro. de emisión</h4>
          <button onClick={(e: any) => handleMinus(e)}>
            <Lucide icon="ChevronLeft" className="w-4 h-4 mx-2" />
          </button>
          <FormInput
            type="text"
            value={emision ?? ""}
            className="w-[4rem] text-center"
            onChange={handleChange}
          />
          <button onClick={(e: any) => handlePlus(e)}>
            <Lucide icon="ChevronRight" className="w-4 h-4 mx-2" />
          </button>
        </div>

        <div>
          <NotificationModal />
        </div>
      </section>
      <div className="overflow-x-scroll scrollbar-hidden">
        <div id="tabulator" ref={tableRef} className="mt-5"></div>
      </div>
    </>
  );
};

export default ProcuracionDetailTable;
