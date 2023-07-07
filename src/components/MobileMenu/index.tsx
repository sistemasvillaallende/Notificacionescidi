import { Transition } from "react-transition-group"
import { useState, useEffect, createRef, Dispatch, SetStateAction } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import { toRaw } from "../../utils/helper"
import { selectSideMenu } from "../../stores/sideMenuSlice"
import { useAppSelector } from "../../stores/hooks"
import { FormattedMenu, nestedMenu } from "../../layouts/SideMenu/side-menu"
import { linkTo, enter, leave } from "./mobile-menu"
import Lucide from "../../base-components/Lucide"
import clsx from "clsx"
import SimpleBar from "simplebar"
import placeholderProfile from "../../assets/images/placeholders/placeholderProfile.jpg"
import logo from "../../assets/images/logo.svg"
import { useAuthContext } from "../../context/AuthProvider"

function Main() {
  const location = useLocation()
  const [formattedMenu, setFormattedMenu] = useState<Array<FormattedMenu | "divider">>([])
  const sideMenuStore = useAppSelector(selectSideMenu)
  const mobileMenu = () => nestedMenu(toRaw(sideMenuStore), location)
  const [activeMobileMenu, setActiveMobileMenu] = useState(false)
  const scrollableRef = createRef<HTMLDivElement>()
  const { user } = useAuthContext()

  useEffect(() => {
    if (scrollableRef.current) {
      new SimpleBar(scrollableRef.current)
    }
    setFormattedMenu(mobileMenu())
  }, [sideMenuStore, location.pathname])

  return (
    <>
      {/* BEGIN: Mobile Menu */}
      <div
        style={{ background: "linear-gradient(180deg, #D9D9D9, rgba(230, 238, 240, 0) 125%)" }}
        className={clsx([
          "flex items-center w-full fixed z-[60] border-b border-white/[0.08] h-[134px] -mt-5 -mx-3 sm:-mx-8 mb-6 dark:bg-darkmode-800/90 md:hidden",
        ])}
      >
        <div className="h-[70px] w-full px-7 sm:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <div className="relative flex w-12 h-12 mr-1 image-fit">
              <img
                alt="Imagen de perfil"
                className="rounded-full"
                src={user?.img ? user.img : placeholderProfile}
              />
              <div className="flex justify-center items-center absolute -bottom-1 -right-2 w-[23px] h-[23px] rounded-full bg-[#d9d9d9] dark:border-darkmode-600">
                <Lucide
                  icon="Mail"
                  className="w-[14px] m-0 p-0 text-black"
                  onClick={() => {
                    setActiveMobileMenu(!activeMobileMenu)
                  }}
                />
              </div>
            </div>
            <h2 className="ml-3 text-xl font-medium text-black">{`Hola${
              user ? ", " + user.nombre + " " + user.apellido : ""
            }`}</h2>
          </div>
          <a href="#" onClick={(e) => e.preventDefault()}>
            <Lucide
              icon="Menu"
              className="w-8 h-8 text-black"
              onClick={() => {
                setActiveMobileMenu(!activeMobileMenu)
              }}
            />
          </a>
        </div>
        {activeMobileMenu && (
          <div
            ref={scrollableRef}
            className={clsx([
              "h-auto fixed z-20 top-[93px] right-[30px] w-[220px] -ml-[100%] bg-light transition-all duration-300 ease-in-out",
              activeMobileMenu && "ml-0",
            ])}
          >
            <a
              href="#"
              onClick={(e) => e.preventDefault()}
              className={clsx([
                "fixed top-[98px] right-[25px] mt-4 mr-4 transition-opacity duration-200 ease-in-out",
                !activeMobileMenu && "invisible opacity-0",
                activeMobileMenu && "visible opacity-100",
              ])}
            >
              <Lucide
                icon="X"
                className="w-6 h-6 text-black transform -rotate-90"
                onClick={() => {
                  setActiveMobileMenu(!activeMobileMenu)
                }}
              />
            </a>
            <Link to="/" className="flex justify-start mt-[25px] pl-[25px]">
              <img alt="logo Villa Allende" className="w-[131px]" src={logo} />
            </Link>

            <ul className="py-2">
              {/* BEGIN: First Child */}
              {formattedMenu.map((menu, menuKey) =>
                menu == "divider" ? (
                  <Divider as="li" className="my-6" key={menuKey}></Divider>
                ) : (
                  <li className="text-black" key={menuKey}>
                    <Menu
                      menu={menu}
                      formattedMenuState={[formattedMenu, setFormattedMenu]}
                      level="first"
                      setActiveMobileMenu={setActiveMobileMenu}
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
                            "bg-black/10 rounded-lg mx-4 my-1 dark:bg-darkmode-700",
                            !menu.activeDropdown && "hidden",
                            menu.activeDropdown && "block",
                          ])}
                        >
                          {menu.subMenu.map((subMenu, subMenuKey) => (
                            <li className="max-w-[1280px] w-full mx-auto" key={subMenuKey}>
                              <Menu
                                menu={subMenu}
                                formattedMenuState={[formattedMenu, setFormattedMenu]}
                                level="second"
                                setActiveMobileMenu={setActiveMobileMenu}
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
                                      "bg-black/10 rounded-lg my-1 dark:bg-darkmode-600",
                                      !subMenu.activeDropdown && "hidden",
                                      subMenu.activeDropdown && "block",
                                    ])}
                                  >
                                    {subMenu.subMenu.map((lastSubMenu, lastSubMenuKey) => (
                                      <li
                                        className="max-w-[1280px] w-full mx-auto"
                                        key={lastSubMenuKey}
                                      >
                                        <Menu
                                          menu={lastSubMenu}
                                          formattedMenuState={[formattedMenu, setFormattedMenu]}
                                          level="third"
                                          setActiveMobileMenu={setActiveMobileMenu}
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
          </div>
        )}
      </div>
      {/* END: Mobile Menu */}
    </>
  )
}

function Menu(props: {
  menu: FormattedMenu
  formattedMenuState: [
    (FormattedMenu | "divider")[],
    Dispatch<SetStateAction<(FormattedMenu | "divider")[]>>
  ]
  level: "first" | "second" | "third"
  setActiveMobileMenu: Dispatch<SetStateAction<boolean>>
}) {
  const navigate = useNavigate()
  const [formattedMenu, setFormattedMenu] = props.formattedMenuState

  return (
    <a
      href={props.menu.subMenu ? "#" : props.menu.pathname}
      className={clsx([
        "h-[50px] flex items-center text-white",
        props.level == "first" && "px-6",
        props.level != "first" && "px-4",
      ])}
      onClick={(event) => {
        event.preventDefault()
        linkTo(props.menu, navigate, props.setActiveMobileMenu)
        setFormattedMenu(toRaw(formattedMenu))
      }}
    >
      <div className="flex items-center w-full ml-3 text-primary font-bold">
        {props.menu.title}
        {props.menu.subMenu && (
          <div
            className={clsx([
              "transition ease-in duration-100 ml-auto",
              props.menu.activeDropdown && "transform rotate-180",
            ])}
          >
            <Lucide icon="ChevronDown" className="w-5 h-5" />
          </div>
        )}
      </div>
    </a>
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
      className={clsx([props.className, "w-full h-px bg-white/[0.08] relative"])}
    ></Component>
  )
}

export default Main
