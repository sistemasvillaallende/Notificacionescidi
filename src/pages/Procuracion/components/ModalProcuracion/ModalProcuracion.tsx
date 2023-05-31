import { Preview } from "../../../../base-components/PreviewComponent";
import { Dialog } from "../../../../base-components/Headless";
import Button from "../../../../base-components/Button";
import React, { useState, useEffect } from "react";
import {
  FormInput,
  FormLabel,
  FormTextarea,
} from "../../../../base-components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { validateCuil } from "../../../../utils/cuilValidator";
import { ClassicEditor } from "../../../../base-components/Ckeditor";
import { baseWebApi, comunicacionesCidi } from "../../../../utils/axiosConfig";
import { Response } from "../../ProcuracionDetailTable";
import { capitalizeFirstLetter } from "../../../../utils/helper";

const schema = yup.object({
  cuil: yup
    .number()
    .typeError("Ingresa un número de CUIT/CUIL")
    .required("Este campo es obligatorio")
    .test("validate-cuil", "Ingresa un número de CUIT/CUIL válido", (value) =>
      validateCuil(value?.toString() as string)
    ),
  subject: yup
    .string()
    .typeError("Selecciona la notificación que quieres enviar")
    .required("Este campo es obligatorio"),
});

function ModalProcuracion({ table, dataSelected }: any) {
  const [validSelectedStates, setValidSelectedStates] = useState<string[]>([])
  const [validatedData, setValidatedData] = useState<any>()
  const [errorMessage, setErrorMessage] = useState("");

  const data = table?.getData();
  const statesArray = dataSelected?.map((row: Response) =>
    capitalizeFirstLetter(row?.estado_Actualizado as string)
  );
  const statesSelected = statesArray?.filter(
    (item: string, index: number) => statesArray.indexOf(item) === index
  );
  const office = window?.localStorage?.getItem("selectedOffice") ?? "";
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  });

  const getStates = async () => {
    try {
      const response = await baseWebApi("/Estados_procuracion/ListarEstados");
      const statesWithNotification = response?.data?.filter(
        (state: { emite_notif_cidi: number }) => state?.emite_notif_cidi == 1
      );
      if (statesWithNotification) {
        setErrorMessage("");
        const validateStates = statesWithNotification?.filter(
          (el: { descripcion_estado: string }) =>
            statesSelected?.includes(
              capitalizeFirstLetter(el.descripcion_estado.trim())
            )
        );
        if (validateStates.length > 0) {
          setErrorMessage("");
          return validateStates.map((state: { descripcion_estado: string })=>capitalizeFirstLetter(state.descripcion_estado));
        } else
          setErrorMessage(
            "Los estados seleccionados no son válidos para notificar"
          );
          return null
      } else
        setErrorMessage("No has seleccionado un estado válido para notificar");
        return null
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    // getStates().then((response)=>setValidSelectedStates(response));
    getStates().then(()=>{
      setValidSelectedStates(['Paralizado'])
      setValidatedData(dataSelected?.filter(
        (row: any) => row?.cuit?.length > 1 && row.notificado_cidi == 0 && validSelectedStates?.includes(row.estado_Actualizado as string)
      ))
    }
      );
  }, [dataSelected]);


  const [superlargeModalSizePreview, setSuperlargeModalSizePreview] =
    useState(false);

  return (
    <Preview>
      <div className="text-center">
        {/* BEGIN: Super Large Modal Toggle */}
        <Button
          as="a"
          href="#"
          variant="primary"
          onClick={(event: React.MouseEvent) => {
            event.preventDefault();
            setSuperlargeModalSizePreview(true);
          }}
          className="mr-2 ml-5 mt-5 sm:mt-0 shadow-md bg-secondary"
        >
          Notificación Masiva
        </Button>
        {/* END: Super Large Modal Toggle */}
      </div>

      {/* BEGIN: Super Large Modal Content */}
      <Dialog
        size="xl"
        open={superlargeModalSizePreview}
        onClose={() => {
          setSuperlargeModalSizePreview(false);
          reset();
        }}
      >
        <Dialog.Panel className="p-10 text-center max-h-[95vh] overflow-y-auto">
          {errorMessage?.length > 0 ? (
            <h3 className="font-bold text-lg text-warning">{errorMessage}</h3>
          ) : (
            <>
              <h2 className="font-bold  text-2xl">
                Crea una nueva notificación
              </h2>
              <main className="my-6">
                <article className="text-left my-5 text-base">
                  <p>
                    <span className="font-bold">Total Procuraciones: </span>
                    {data?.length}
                  </p>
                  <p>
                    <span className="font-bold">
                      Seleccionadas válidas para notificar:{" "}
                    </span>
                    {validatedData?.length}
                  </p>
                  <p>
                    <span className="font-bold">Estados Seleccionados: </span>
                    {validSelectedStates?.join(", ")}{" "}
                  </p>
                </article>

                <button className="mr-2 ml-5 mt-5 text-white text-lg rounded-md px-5 py-2 shadow-md bg-secondary cursor-pointer">
                  Notificar
                </button>
              </main>
            </>
          )}
        </Dialog.Panel>
      </Dialog>
      {/* END: Super Large Modal Content */}
    </Preview>
  );
}

export default ModalProcuracion;
