import { Preview } from "../../base-components/PreviewComponent";
import { Dialog } from "../../base-components/Headless";
import Button from "../../base-components/Button";
import React, { useState } from "react";
import { FormInput, FormLabel, FormTextarea } from "../../base-components/Form";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { validateCuil } from "../../utils/cuilValidator";
import { ClassicEditor } from "../../base-components/Ckeditor";
import { comunicacionesCidi } from "../../utils/axiosConfig";

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

function NotificationModal() {
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

  const [bodyValue, setBodyValue] = useState("");
  const [notification, setNotification] = useState({
    send: false,
    message: "",
    error: false,
  });
  const [bodyError, setBodyError] = useState({
    error: false,
    message: "",
  });

  const handleBlurEditor = (data: any) => {
    setBodyValue(data.current);
  };
  const handleChangeEditor = (data: any) => {
    setBodyValue(data?.current);
    if (data.current?.length == 0 && bodyError.error === false) {
      setBodyError({
        ...bodyError,
        error: true,
        message: "Este campo es obligatorio",
      });
    } else if (
      data.current &&
      bodyError.error === true &&
      data.current.length <= 3000
    ) {
      setBodyError({ ...bodyError, error: false, message: "" });
    }
    if (data.current?.length > 3000 && bodyError.error === false) {
      setBodyError({
        error: true,
        message: "El mensaje no debe tener más de 3000 caracteres",
      });
    }
  };

  const onSubmit = async (data: any) => {
    if (bodyValue && bodyError.error === false) {
      const { cuil, subject } = data;

      const body = {
        cuit: cuil,
        subject: subject,
        body: bodyValue,
      };
      try {
        const response = await comunicacionesCidi.post(
          "/enviarNotificacionGeneral",
          body
        );
        response?.data &&
          setNotification({
            ...notification,
            send: true,
            message: response.data.mensaje,
            error: false,
          });
        reset();
      } catch (err: any) {
        console.log(err);
        setNotification({
          ...notification,
          send: true,
          message: err?.response?.message,
          error: true,
        });
      }
    } else {
      setBodyError({
        ...bodyError,
        error: true,
        message: "Este campo es obligatorio",
      });
    }
  };

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
          Nueva Notificación
        </Button>
        {/* END: Super Large Modal Toggle */}
      </div>

      {/* BEGIN: Super Large Modal Content */}
      <Dialog
        size="xl"
        open={superlargeModalSizePreview}
        onClose={() => {
          setSuperlargeModalSizePreview(false);
          setNotification({
            ...notification,
            send: false,
            message: "",
            error: false,
          });
          reset();
        }}
      >
        <Dialog.Panel className="p-10 text-center max-h-[95vh] overflow-y-auto">
          <h2 className="font-bold  text-2xl">Crea una nueva notificación</h2>
          {notification.send ? (
            <>
              <h3
                className={
                  notification.error
                    ? "text-warning my-9 text-xl"
                    : "text-success my-9 text-xl"
                }
              >
                {notification.message ||
                  "No se ha recibido respuesta. Verifica los datos ingresados"}
              </h3>
              <button
                className="mx-5 mt-5 text-white text-lg rounded-md px-5 py-2 shadow-md bg-secondary cursor-pointer"
                onClick={() =>
                  setNotification({ ...notification, send: false, message: "" })
                }
              >
                Enviar otra Notificación
              </button>
            </>
          ) : (
            <form onSubmit={handleSubmit(onSubmit)}>
              <div>
                <FormLabel
                  className="flex justify-start text-left text-base font-normal mt-5 mb-0 text-left"
                  htmlFor="regular-form-1"
                >
                  CUIL/CUIT
                </FormLabel>
                <FormInput
                  id="regular-form-1"
                  type="number"
                  placeholder="Ingresa el número de CUIL/CUIT sin guiones"
                  {...register("cuil")}
                />
                <p className="text-warning text-right">
                  {errors.cuil?.message as string}
                </p>
              </div>

              <div className="mb-5">
                <FormLabel
                  className="flex justify-start text-left text-base font-normal mt-5 mb-0 text-left"
                  htmlFor="subject"
                >
                  Asunto
                </FormLabel>
                <FormTextarea
                  id="subject"
                  placeholder="Escribe el asunto de la notificación"
                  {...register("subject")}
                />
                <p className="text-warning text-right">
                  {errors.subject?.message as string}
                </p>
              </div>

              <div>
                <FormLabel className="flex justify-start text-left text-base font-normal mt-5 mb-0 text-left">
                  Texto de la Notificación
                </FormLabel>
                <ClassicEditor
                  onBlur={handleBlurEditor}
                  onChange={handleChangeEditor}
                  className="max-h-80"
                />
                <div className="my-2 flex justify-between">
                  <span>Cantidad de caracteres: {bodyValue?.length}</span>
                  <span className="text-warning">
                    Caracteres restante: {3000 - bodyValue?.length}
                  </span>
                </div>
                {bodyError.error && (
                  <p className="text-warning text-right">
                    {bodyError.message as string}
                  </p>
                )}
              </div>

              <input
                className="mr-2 ml-5 mt-5 text-white text-lg rounded-md px-5 py-2 shadow-md bg-secondary cursor-pointer"
                type="submit"
              />
            </form>
          )}
        </Dialog.Panel>
      </Dialog>
      {/* END: Super Large Modal Content */}
    </Preview>
  );
}

export default NotificationModal;
