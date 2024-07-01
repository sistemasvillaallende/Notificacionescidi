import { Link, useNavigate, useParams } from "react-router-dom"
import { useEffect, useRef, createRef, useState } from "react"
import { createIcons, icons } from "lucide"
import { TabulatorFull as Tabulator } from "tabulator-tables"

import { officesIds } from "../../utils/officesIds.js"
import { baseWebApi } from "../../utils/axiosConfig"
import Button from "../../base-components/Button"
import { FormInput, FormSelect } from "../../base-components/Form"
import NotificationModal from "../../components/NotificationModal"
import { capitalizeAll, capitalizeFirstLetter } from "../../utils/helper"
import { validateCuil } from "../../utils/cuilValidator"
import { getSecureItem } from "../../modules/secureStorage.js"

interface Response {
  id_notificacion?: number
  nombre?: string
  fecha_notif?: string
  Id_Oficina?: number
  Id_usuario?: number
  Modo_Notificacion?: string
  cidi_nivel?: number
  estado_notif?: string
  cuil?: string
  subject_notif?: string
  body_notif?: string
  id_oficina?: number
  desc_tipo_notif?: number | null
  estado?: string
  usuario?: string
  oficina?: string
}

function Main() {
  const { office } = useParams()
  const tableRef = createRef<HTMLDivElement>()
  const tabulator = useRef<Tabulator>()
  const [filter, setFilter] = useState({
    field: "",
    type: "=",
    cuil: "",
    estado: "",
  })
  const [cuilInput, setCuilInput] = useState({
    error: false,
    reset: false,
  })
  const [errorMessage, setErrorMessage] = useState("")
  const [isLoading, setIsloading] = useState(true)
  const navigate = useNavigate()
  const officeId = office ? officesIds[office?.toUpperCase() as keyof typeof officesIds]?.id : ""
  const isLoggedIn = localStorage.getItem("isLoggedIn")
  const user = isLoggedIn ? getSecureItem("isLoggedIn") : null
  const [userWithAccess, setUserWithAccess] = useState(false)

  const validateUser = async () => {
    const response = await baseWebApi.get(
      `/Login/ValidaPermisoConOficina?user=${user?.userName}&proceso=ND_NOTIF_GRAL`
    )
    setUserWithAccess(response?.data)
    if (!response.data) setErrorMessage("No tienes permiso para acceder a este contenido")
    else setErrorMessage("")
  }

  useEffect(() => {
    validateUser()
  }, [])

  useEffect(() => {
    office && localStorage?.setItem("selectedOffice", office)
    const officeExist = office?.toLowerCase().trim() == user?.nombre_oficina?.toLowerCase().trim()
    if (!officeExist) {
      setErrorMessage("No tienes permiso para acceder a este contenido")
    }
    // Inicia Tabulator
    if (userWithAccess) {
      initTabulator()
      reInitOnResizeWindow()
      setIsloading(false)
    }
  }, [office, userWithAccess])

  const initTabulator = () => {
    if (tableRef.current) {
      tabulator.current = new Tabulator(tableRef.current, {
        ajaxURL: `${import.meta.env.VITE_URL_WEBAPISHARED}/Notificacion_digital/ListNotifxOficina?cod_oficina=${officeId}`,
        paginationMode: "local",
        filterMode: "remote",
        // sortMode: "remote",
        printStyled: true,
        pagination: true,
        paginationSize: 10,
        paginationSizeSelector: [10, 20, 30, 40],
        layout: "fitColumns",
        responsiveLayout: "collapse",
        responsiveLayoutCollapseStartOpen: false,
        placeholder: "No se han encontrado registros",
        initialSort: [{ column: "fecha_notif", dir: "desc" }],
        columns: [
          {
            title: "",
            formatter: "responsiveCollapse",
            width: 40,
            minWidth: 40,
            hozAlign: "center",
            // resizable: false,
            headerSort: false,
          },

          // For HTML table
          {
            title: "Id",
            minWidth: 90,
            width: 90,
            responsive: 0,
            field: "id_notificacion",
            vertAlign: "middle",
            print: false,
            download: false,
            headerSort: false,
            formatter(cell) {
              const response: Response = cell.getData()
              return `<div>
                <div class="font-medium whitespace-nowrap">${response?.id_notificacion}</div>
              </div>`
            },
          },
          {
            title: "Fecha",
            width: 150,
            minWidth: 100,
            field: "fecha_notif",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
              const response: Response = cell.getData()
              return `<div class="h-4 flex items-center">
                <div class="font-normal whitespace-nowrap">${new Date(
                  response?.fecha_notif as string
                ).toLocaleDateString()}</div>
              </div>`
            },
          },
          {
            title: "Nombre",
            minWidth: 120,
            width: 150,
            field: "nombre",
            // responsive: 1,
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            formatter(cell) {
              const response: Response = cell.getData()
              const nombre = response?.nombre && capitalizeAll(response.nombre)

              return `<div class="h-4 flex items-center">
              <div class="font-normal whitespace-nowrap h-4">${nombre && nombre}</div>
            </div>`
            },
          },
          {
            title: "CUIL",
            minWidth: 100,
            width: 120,
            field: "cuil",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "Usuario",
            minWidth: 100,
            width: 150,
            field: "usuario",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "Estado",
            minWidth: 100,
            width: 150,
            field: "estado",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
              const response: Response = cell.getData()
              const estado = response?.estado?.toLocaleLowerCase()
              return `<div class="flex items-center lg:justify-start ${
                response.estado == "NOTIFICADO" ? "text-success" : "text-warning"
              }">
                <span>${estado ? estado.charAt(0)?.toUpperCase() + estado.slice(1) : ""}</span>
              </div>`
            },
          },
          {
            title: "CIDI",
            minWidth: 80,
            width: 100,
            field: "cidi_nivel",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "Estado Notificación",
            minWidth: 150,
            field: "estado_notif",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "Id Usuario",
            minWidth: 200,
            field: "id_usuario",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "Oficina",
            minWidth: 150,
            width: 220,
            field: "oficina",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            headerSort: false,
            formatter(cell) {
              const response: Response = cell.getData()
              const oficina = response?.oficina?.toLowerCase()
              return `<div class="h-4 flex items-center">
              <div class="font-normal whitespace-nowrap">${
                oficina ? capitalizeFirstLetter(oficina) : ""
              }</div>
            </div>`
            },
          },
          {
            title: "Id Oficina",
            minWidth: 200,
            field: "id_oficina",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "Tipo",
            minWidth: 50,
            width: 100,
            field: "tipo_notificacion",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "Asunto",
            minWidth: 200,
            field: "subject_notif",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
          },
          {
            title: "Notificación",
            minWidth: 200,
            field: "body_notif",
            hozAlign: "center",
            headerHozAlign: "center",
            vertAlign: "middle",
            print: false,
            download: false,
            formatter(cell) {
              const response: Response = cell.getData()

              return `<div class="h-4 flex items-center h-fit">
              <div class="font-normal whitespace-pre-wrap h-4 h-fit">${response.body_notif}</div>
            </div>`
            },
          },
        ],
      })
    }
  }

  tabulator?.current?.on("renderComplete", () => {
    createIcons({
      icons,
      attrs: {
        "stroke-width": 1.5,
      },
      nameAttr: "data-lucide",
    })
  })

  // Redraw table onresize
  const reInitOnResizeWindow = () => {
    window.addEventListener("resize", () => {
      if (tabulator.current) {
        tabulator.current.redraw()
        createIcons({
          icons,
          attrs: {
            "stroke-width": 1.5,
          },
          nameAttr: "data-lucide",
        })
      }
    })
  }

  // Filter function
  const onFilter = () => {
    const { cuil, estado, field } = filter
    const table = tabulator?.current

    if (table && field) {
      if (cuil && field === "cuil") {
        const cuilIsValid = validateCuil(cuil)

        if (cuilIsValid) {
          try {
            setFilter({ ...filter, estado: "" })
            table.setData(
              `${import.meta.env.VITE_URL_WEBAPISHARED}/Notificacion_digital/listNotifxcuil?cuil=${cuil}`
            )
            setCuilInput({ ...cuilInput, error: false, reset: true })
          } catch (err) {
            console.log(err)
          }
        } else setCuilInput({ ...cuilInput, error: true })
      } else if (estado && field === "estado") {
        try {
          table.setData(
            `${import.meta.env.VITE_URL_WEBAPISHARED}/Notificacion_digital/ListNotifxEstado?cod_estado=${estado}`
          )
        } catch (err) {
          console.log(err)
        }
      }
    }
  }

  // On reset filter
  const onResetFilter = () => {
    setFilter({
      ...filter,
      field: "",
      type: "=",
      cuil: "",
      estado: "",
    })
    setCuilInput({ ...cuilInput, reset: false })
    // onFilter();
  }

  return (
    <>
      {errorMessage ? (
        <>
          <h2 className="font-bold text-center text-lg text-primary">{errorMessage}</h2>
          <Link to="/seleccionar-oficina/">Volver</Link>
        </>
      ) : (
        <>
          <div className="p-5 intro-y box rounded-xl shadow-[0px_4px_4px_0px_#00000020]">
            <div className="flex flex-col items-center sm:items-baseline justify-between intro-y sm:flex-row">
              <form
                id="tabulator-html-filter-form"
                className="flex flex-col lg:flex-row width-screen md:width-auto sm:mr-auto"
                onSubmit={(e) => {
                  e.preventDefault()
                  onFilter()
                }}
              >
                <div>
                  <div className="flex">
                    <FormInput
                      id="tabulator-html-filter-value"
                      value={filter.cuil}
                      onChange={(e) => {
                        if (e.target.value === "") setCuilInput({ ...cuilInput, reset: false })
                        setFilter({
                          ...filter,
                          field: "cuil",
                          cuil: e.target.value,
                        })
                      }}
                      type="text"
                      className=" sm:w-40 2xl:w-full sm:mt-0"
                      placeholder="Buscar..."
                    />
                    <Button
                      id="tabulator-html-filter-go"
                      variant="primary"
                      type="button"
                      className="w-auto h-auto sm:w-16 bg-secondary border-none ml-5"
                      onClick={onFilter}
                    >
                      Ir
                    </Button>
                    {cuilInput.reset && (
                      <a
                        className="self-center underline text-secondary pl-2"
                        onClick={onResetFilter}
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
                    onChange={(e) => {
                      setCuilInput({ ...cuilInput, error: false, reset: false })
                      setFilter({
                        ...filter,
                        cuil: "",
                        field: "estado",
                        estado: e.target.value,
                      })
                    }}
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
              </div>
            </div>
            {/* BEGIN: HTML Table Data */}

            <div className="overflow-x-scroll scrollbar-hidden">
              <div id="tabulator" ref={tableRef} className="mt-5"></div>
            </div>
          </div>
        </>
      )}
    </>
  )
}

export default Main
