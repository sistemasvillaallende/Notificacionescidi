import React from "react"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuthContext } from "../../context/AuthProvider"
import "../../assets/css/style.css";
import { FormInput, FormLabel } from "../../base-components/Form"
import Button from "../../base-components/Button"

const schema = yup.object({
  user: yup
    .string()
    .typeError("Ingresa tu nombre de usuario")
    .required("Este campo es obligatorio"),
  password: yup
    .string()
    .typeError("Escribe una contraseña válida")
    .required("Este campo es obligatorio"),
})

const LoginForm = () => {
  const urlCIDI = `${import.meta.env.VITE_URL_URL_CIDI}`

  const office = window?.localStorage?.getItem("selectedOffice") ?? ""
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    mode: "onChange",
  })
  const { handleLogin } = useAuthContext();

  const onSubmit = (data: any) => {
    const { user, password } = data
    handleLogin(user, password)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div>
        <FormLabel htmlFor="vertical-form-1">Usuario</FormLabel>
        <FormInput
          id="vertical-form-1"
          type="text"
          placeholder="Nombre de usuario"
          {...register("user")}
        />
        {errors.user?.message as string}
      </div>

      <div className="mt-3">
        <FormLabel htmlFor="vertical-form-2">Contraseña</FormLabel>
        <FormInput
          id="vertical-form-2"
          type="password"
          placeholder="Contraseña"
          {...register("password")}
        />
        {errors.password?.message as string}
      </div>

      <Button variant="secondary" className="mt-5">
        Login
      </Button>
      <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
        <h2><a href={urlCIDI}>login con CIDI</a></h2>
      </div>
    </form>
  )
}

export default LoginForm
