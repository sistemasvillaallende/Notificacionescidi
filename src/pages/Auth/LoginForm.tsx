import React from "react"
import * as yup from "yup"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import { useAuthContext } from "../../context/AuthProvider"
import "../../assets/css/style.css";
import { FormInput, FormLabel } from "../../base-components/Form"
import Button from "../../base-components/Button"
import logo from  "../../assets/images/logocidi.png"

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
  const urlCIDI = "https://vecino.villaallende.gov.ar/LogInCidi.aspx?url=https%3A%2F%2Fvecino.villaallende.gov.ar%2Fnotificacionescidi%2F%23%2FCIDI"

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
      <div className="mt-5 text-center intro-x xl:mt-8 xl:text-left">
        <h2 style={{ textAlign: 'center' }}><a href={urlCIDI} style={{display: 'ruby', width: '100%'}}>
          <img src={logo} alt="logo" style={{ height: '90px'}}/></a></h2>
      </div>
    </form>
  )
}

export default LoginForm
