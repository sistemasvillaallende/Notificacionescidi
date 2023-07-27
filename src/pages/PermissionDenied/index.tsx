import Button from "../../base-components/Button"

const PermissionDenied = () => {
  return (
    <div className="vw-95 flex flex-col justify-center">
      <h2 className="font-bold text-warning text-center text-xl py-5">
        No tienes permisos para acceder a este contenido
      </h2>
      <Button
        as="a"
        href="/"
        variant="primary"
        className="w-fit m-auto text-white text-lg rounded-md px-5 py-2 shadow-md bg-secondary"
      >
        Volver
      </Button>
    </div>
  )
}

export default PermissionDenied
