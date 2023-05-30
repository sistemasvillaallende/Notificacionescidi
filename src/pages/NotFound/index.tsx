import { Link } from 'react-router-dom'

const NotFound = () => {
  return (
    <div className="flex flex-col items-center">
            <div className="text-indigo-500 font-bold text-7xl">
                404
            </div>

            <div className="font-bold text-3xl xl:text-7xl lg:text-6xl md:text-5xl mt-10">
                Esta página no existe
            </div>

            <div className="text-gray-400 font-medium text-sm md:text-xl lg:text-2xl mt-8">
                La oficina que has seleccionado no existe.
            </div>

            <Link  className='text-secondary' to='/seleccionar-oficina/' >Volver</Link>
    </div>
  )
}

export default NotFound