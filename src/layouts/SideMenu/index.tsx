import { Transition } from "react-transition-group"
import { useState, useEffect, Dispatch, SetStateAction } from "react"
import { Outlet, useLocation, useNavigate, useParams } from "react-router-dom"
import { selectSideMenu } from "../../stores/sideMenuSlice"
import { useAppSelector } from "../../stores/hooks"
import { FormattedMenu, linkTo, nestedMenu, enter, leave } from "./side-menu"
import Lucide from "../../base-components/Lucide"
import clsx from "clsx"
import MobileMenu from "../../components/MobileMenu"
import SideMenuTooltip from "../../components/SideMenuTooltip"
import { updateSideMenu } from "../../stores/sideMenuSlice"
import { useDispatch } from "react-redux"
import { officesIds } from "../../utils/officesIds"
import { useAuthContext } from "../../context/AuthProvider"
import { capitalizeFirstLetter } from "../../utils/helper"
import NotFound from "../../pages/NotFound"
import { getSecureItem } from "../../modules/secureStorage"

function Main() {
  const location = useLocation()
  const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu | "divider">>([])
  const [errorPage, setErrorPage] = useState(false)
  const sideMenuStore = useAppSelector(selectSideMenu)
  const sideMenu = () => nestedMenu(sideMenuStore, location)
  const dispatch = useDispatch()
  const { office } = useParams()
  const { user } = useAuthContext()
  const userInfo = user ? user : getSecureItem("isLoggedIn")
  const userOffice = userInfo?.nombre_oficina

  const Officeicon = officesIds[userOffice?.toUpperCase() as keyof typeof officesIds]?.icon

  const icon = Officeicon ?? "Bell"
  const submenuNoti = [
    {
      icon: icon,
      pathname: `/${userOffice?.split(" ").join("%20").toLowerCase()}/notificaciones/`,
      title: capitalizeFirstLetter(userOffice),
    },
  ]

  const subMenuCar = [
    {
      icon: "MailSearch",
      pathname: `/oficina%20automotor/procuracion`,
      title: "Cambio masivo de procuración",
    },
    {
      icon: "ArrowUp",
      pathname: `/oficina%20automotor/procuracion?id=nuevasemisiones`,
      title: "Nuevas emisiones",
    },
  ]

  const submenuProcu = [
    {
      icon: "Car",
      title: "Oficina Automotor",
      subMenu: subMenuCar,
    },
    {
      icon: "Factory",
      pathname: `/comercio%20e%20industria/procuracion/`,
      title: "Comercio e industria",
    },
    {
      icon: "Building",
      pathname: `/inmuebles/procuracion/`,
      title: "Inmuebles",
    },
  ]

  const updatedMenu: any = [
    {
      icon: "Bell",
      title: "Notificaciones",
      activeDropdown: true,
      subMenu: submenuNoti,
    },
    {
      icon: "FileWarning",
      title: "Procuración Administrativa",
      activeDropdown: true,
      subMenu: submenuProcu,
    },
  ]

  useEffect(() => {
    dispatch(updateSideMenu(updatedMenu))
    if (!officesIds[office?.toUpperCase() as keyof typeof officesIds]) {
      setErrorPage(true)
    } else setErrorPage(false)
  }, [office])

  useEffect(() => {
    setFormattedMenu(sideMenu())
  }, [sideMenuStore, location.pathname])
  return (
    <div className="py-5 md:py-0 bg-white box-border">
      <MobileMenu />
      <div className="flex overflow-hidden px-2 sm:px-5 mt-[120px] md:mt-5 bg-white">
        {/* BEGIN: Side Menu */}
        <nav className="w-[105px] xl:w-[260px] px-5 pb-16 rounded-md overflow-x-hidden z-50 pt-4 hidden md:block bg-light">
          <ul>
            {/* BEGIN: First Child */}
            {formattedMenu.map((menu, menuKey) =>
              menu == "divider" ? (
                <Divider
                  type="li"
                  className={clsx([
                    "my-6",

                    // Animation
                    `opacity-0 animate-[0.4s_ease-in-out_0.1s_intro-divider] animate-fill-mode-forwards animate-delay-${
                      (menuKey + 1) * 10
                    }`,
                  ])}
                  key={menuKey}
                ></Divider>
              ) : (
                <li key={menuKey}>
                  <Menu
                    className={clsx({
                      // Animation
                      [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                        (menuKey + 1) * 10
                      }`]: !menu.active,
                    })}
                    menu={menu}
                    formattedMenuState={[formattedMenu, setFormattedMenu]}
                    level="first"
                  ></Menu>
                  {/* BEGIN: Second Child */}
                  {menu.subMenu && (
                    <Transition
                      in={menu.activeDropdown}
                      onEnter={enter}
                      onExit={leave}
                      timeout={300}
                    >
                      <ul
                        className={clsx([
                          "bg-white/[0.04] rounded-xl relative dark:bg-transparent",
                          "before:content-[''] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30",
                          { block: menu.activeDropdown },
                          { hidden: !menu.activeDropdown },
                        ])}
                      >
                        {menu.subMenu.map((subMenu, subMenuKey) => (
                          <li key={subMenuKey}>
                            <Menu
                              className={clsx({
                                // Animation
                                [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${10}`]:
                                  !subMenu.active,
                              })}
                              menu={subMenu}
                              formattedMenuState={[formattedMenu, setFormattedMenu]}
                              level="second"
                            ></Menu>
                            {/* BEGIN: Third Child */}
                            {subMenu.subMenu && (
                              <Transition
                                in={subMenu.activeDropdown}
                                onEnter={enter}
                                onExit={leave}
                                timeout={300}
                              >
                                <ul
                                  className={clsx([
                                    "bg-white/[0.04] rounded-xl relative dark:bg-transparent",
                                    "before:content-[''] before:block before:inset-0 before:bg-white/30 before:rounded-xl before:absolute before:z-[-1] before:dark:bg-darkmode-900/30",
                                    { block: subMenu.activeDropdown },
                                    { hidden: !subMenu.activeDropdown },
                                  ])}
                                >
                                  {subMenu.subMenu.map((lastSubMenu, lastSubMenuKey) => (
                                    <li key={lastSubMenuKey}>
                                      <Menu
                                        className={clsx({
                                          // Animation
                                          [`opacity-0 translate-x-[50px] animate-[0.4s_ease-in-out_0.1s_intro-menu] animate-fill-mode-forwards animate-delay-${
                                            (lastSubMenuKey + 1) * 10
                                          }`]: !lastSubMenu.active,
                                        })}
                                        menu={lastSubMenu}
                                        formattedMenuState={[formattedMenu, setFormattedMenu]}
                                        level="third"
                                      ></Menu>
                                    </li>
                                  ))}
                                </ul>
                              </Transition>
                            )}
                            {/* END: Third Child */}
                          </li>
                        ))}
                      </ul>
                    </Transition>
                  )}
                  {/* END: Second Child */}
                </li>
              )
            )}
            {/* END: First Child */}
          </ul>
        </nav>
        {/* END: Side Menu */}
        {/* BEGIN: Content */}
        <div
          className={clsx([
            "max-w-full md:max-w-none md:rounded-none px-4 md:px-[22px] min-w-0 min-h-screen bg-white flex-1 pb-10 mt-5 md:mt-0 relative dark:bg-darkmode-700",
            "before:content-[''] before:w-full before:h-px before:block",
          ])}
        >
          {errorPage ? <NotFound /> : <Outlet />}
        </div>
        {/* END: Content */}
      </div>
    </div>
  )
}

function Menu(props: {
  className?: string
  menu: FormattedMenu
  formattedMenuState: [
    (FormattedMenu | "divider")[],
    Dispatch<SetStateAction<(FormattedMenu | "divider")[]>>
  ]
  level: "first" | "second" | "third"
}) {
  const navigate = useNavigate()
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState

  return (
    <SideMenuTooltip
      as="a"
      content={props.menu.title}
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[50px] flex items-center pl-5 text-slate-600 mb-1 relative rounded-xl dark:text-slate-300",
        {
          "text-slate-600 dark:text-slate-400": !props.menu.active && props.level != "first",
          "bg-slate-100 dark:bg-transparent": props.menu.active && props.level == "first",
          "before:content-[''] before:block before:inset-0 before:rounded-xl before:absolute before:border-b-[3px] before:border-solid before:border-black/[0.08] before:dark:border-black/[0.08] before:dark:bg-darkmode-700":
            props.menu.active && props.level == "first",
          "after:content-[''] after:w-[20px] after:h-[80px] after:mr-[-27px] after:bg-menu-active after:bg-no-repeat after:bg-cover after:absolute after:top-0 after:bottom-0 after:right-0 after:my-auto after:dark:bg-menu-active-dark":
            props.menu.active && props.level == "first",
          "hover:bg-slate-100 hover:dark:bg-transparent hover:before:content-[''] hover:before:block hover:before:inset-0 hover:before:rounded-xl hover:before:absolute hover:before:z-[-1] hover:before:border-b-[3px] hover:before:border-solid hover:before:border-black/[0.08] hover:before:dark:bg-darkmode-700":
            !props.menu.active && !props.menu.activeDropdown && props.level == "first",

          // Animation
          "after:-mr-[47px] after:opacity-0 after:animate-[0.4s_ease-in-out_0.1s_active-side-menu-chevron] after:animate-fill-mode-forwards":
            props.menu.active && props.level == "first",
        },
        props.className,
      ])}
      onClick={(event: React.MouseEvent) => {
        event.preventDefault()
        linkTo(props.menu, navigate)
        setFormattedMenu([...formattedMenu])
      }}
    >
      <div
        className={clsx({
          "text-primary z-10 dark:text-slate-300": props.menu.active && props.level == "first",
          "text-slate-700 dark:text-slate-300": props.menu.active && props.level != "first",
          "dark:text-slate-400": !props.menu.active,
        })}
      >
        <Lucide icon={props?.menu?.icon} />
      </div>
      <div
        className={clsx([
          "w-full mx-3 hidden xl:flex items-center",
          {
            "text-primary font-medium z-10 dark:text-slate-300":
              props.menu.active && props.level == "first",
            "text-slate-700 font-medium dark:text-slate-300":
              props.menu.active && props.level != "first",
            "dark:text-slate-400": !props.menu.active,
          },
        ])}
      >
        {props.menu.title}
        {props.menu.subMenu && (
          <div
            className={clsx([
              "transition ease-in duration-100 ml-auto mr-5 hidden xl:block",
              { "transform rotate-180": props.menu.activeDropdown },
            ])}
          >
            <Lucide className="w-4 h-4" icon="ChevronDown" />
          </div>
        )}
      </div>
    </SideMenuTooltip>
  )
}

function Divider<C extends React.ElementType>(
  props: { as?: C } & React.ComponentPropsWithoutRef<C>
) {
  const { className, ...computedProps } = props
  const Component = props.as || "div"

  return (
    <Component
      {...computedProps}
      className={clsx([
        props.className,
        "w-full h-px bg-black/[0.06] z-10 relative dark:bg-white/[0.07]",
      ])}
    ></Component>
  )
}

export default Main
