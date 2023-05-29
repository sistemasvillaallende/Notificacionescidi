import Button from "../../base-components/Button";
import { FormInput, FormSelect } from "../../base-components/Form";
import { useEffect, useState } from "react";
import NotificationModal from "../../components/NotificationModal";
import { useNavigate, useParams } from "react-router-dom";
import { officesIds } from "../../utils/officesIds.js";
import ProcuracionTable from "./ProcuracionTable";
import ProcuracionDetailTable from "./ProcuracionDetailTable";

function Procuracion() {
  const { office } = useParams();
  const [filter, setFilter] = useState({
    field: "",
    type: "=",
    cuil: "",
    estado: "",
  });
  const [nroEmision, setNumeroEmision] = useState("");
  const navigate = useNavigate();
  const officeId = office
    ? officesIds[office?.toUpperCase() as keyof typeof officesIds]?.id
    : "";
  const isLoggedIn = localStorage.getItem("isLoggedIn") as string;
  const user = isLoggedIn ? JSON.parse(isLoggedIn) : null;

  const officeExist =
    office &&
    user?.oficina?.filter(
      (e: string) => e.toLowerCase() === office.toLowerCase()
    )[0];

  useEffect(() => {
    office && localStorage?.setItem("selectedOffice", office);
    if (!officesIds[office?.toUpperCase() as keyof typeof officesIds]) {
      navigate("/404");
    }
  }, []);
  console.log(officeExist);
  // if (!officeExist) {
  //   return <h2>No tienes permiso para acceder a este contenido</h2>;
  // }

  return (
    <>
      <div className="p-5 intro-y box rounded-xl shadow-[0px_4px_4px_0px_#00000020]">
        <div className="flex flex-col items-center sm:items-baseline justify-between intro-y sm:flex-row">
          {/* <form
            id="tabulator-html-filter-form"
            className="flex flex-col lg:flex-row width-screen md:width-auto sm:mr-auto"
            onSubmit={(e) => {
              e.preventDefault();
              // onFilter();
            }}
          >
            <div>
              <div className="flex">
                <FormInput
                  id="tabulator-html-filter-value"
                  value={filter.cuil}
                  type="text"
                  className=" sm:w-40 2xl:w-full sm:mt-0"
                  placeholder="Buscar..."
                />
                <Button
                  id="tabulator-html-filter-go"
                  variant="primary"
                  type="button"
                  className="w-auto h-auto sm:w-16 bg-secondary border-none ml-5"
                  // onClick={onFilter}
                >
                  Ir
                </Button>
                 {cuilInput.reset && (
                  <a
                    className="self-center underline text-secondary pl-2"
                    // onClick={onResetFilter}
                    href=""
                  >
                    Resetear
                  </a>
                )}
              </div>
               {cuilInput.error && filter.cuil && (
                <span className="text-warning">Ingresa un CUIL válido</span>
              )} 
            </div>
            <div className="items-baseline lg:pl-8 lg:flex sm:mr-4 mt-2 lg:mt-0">
              <FormSelect
                id="tabulator-html-filter-field"
                value={filter.estado}
                // onChange={(e) => {
                //   setCuilInput({ ...cuilInput, error: false, reset: false });
                //   setFilter({
                //     ...filter,
                //     cuil: "",
                //     field: "estado",
                //     estado: e.target.value,
                //   });
                // }}
                className="w-full 2xl:w-full sm:w-auto"
              >
                <option value="">Filtrar por estado</option>
                <option value="1">Notificado</option>
                <option value="0">No notificado</option>
              </FormSelect>
            </div>
          </form> 
          <div className="flex flex-col sm:flex-row sm:items-end xl:items-start">
            <NotificationModal />
          </div>*/}
        </div>
        {/* BEGIN: HTML Table Data */}

        {nroEmision ? (
          <ProcuracionDetailTable
            url={
              "/WebApiShared/Det_notificacion_estado_proc_auto/listarDetalle?nro_emision="
            }
            detail={true}
            nroEmision={nroEmision}
            setNroEmision={setNumeroEmision}
          />
        ) : (
          <ProcuracionTable
            url={
              "/WebApiShared/Notificacion_estado_proc_auto/listNotifProcAuto"
            }
            detail={true}
            nroEmision={nroEmision}
            setNroEmision={setNumeroEmision}
          />
        )}
      </div>
    </>
  );
}

export default Procuracion;
