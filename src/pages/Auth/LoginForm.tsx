import React from "react"
import { FormCheck, FormInput, FormLabel } from "../../base-components/Form"
import Button from "../../base-components/Button"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuthContext } from "../../context/AuthProvider"

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
    const {user, password} = data
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
          type="text"
          placeholder="Contraseña"
          {...register("password")}
        />
        {errors.password?.message as string}
      </div>

      <FormCheck className="mt-5">
        <FormCheck.Input id="vertical-form-3" type="checkbox" value="" />
        <FormCheck.Label htmlFor="vertical-form-3">Recuerdame</FormCheck.Label>
      </FormCheck>

      <Button variant="secondary" className="mt-5">
        Login
      </Button>
    </form>
  )
}

export default LoginForm
