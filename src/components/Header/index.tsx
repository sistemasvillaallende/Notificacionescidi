import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Lucide from "../../base-components/Lucide";
import { Menu, Popover } from "../../base-components/Headless";
import fakerData from "../../utils/faker";
import _ from "lodash";
import clsx from "clsx";
import logo from "../../assets/images/logo.svg";
import  logoNoTexto from "../../assets/icons/logo-notexto.svg"
import mail from "../../assets/icons/mail.svg";
import { useAuthContext } from "../../context/AuthProvider";
import { capitalizeFirstLetter } from "../../utils/helper";
import placeholderProfile from "../../assets/images/placeholders/placeholderProfile.jpg"

function Main(props: { layout?: "side-menu" | "simple-menu" | "top-menu" }) {
  const [searchDropdown, setSearchDropdown] = useState(false);
  const showSearchDropdown = () => {
    setSearchDropdown(true);
  };
  const hideSearchDropdown = () => {
    setSearchDropdown(false);
  };
  const path:string = location.hash && location.hash.split('/').at(-1) as string
  const {  handleLogout, user, setUser  } = useAuthContext();
  const navigate = useNavigate()

  const headerTitle ={
    '':'Inicio',
    notificaciones:'Notificaciones',
    resoluciones: 'Resoluciones',
    multas:'Multas',
    autos:'Autos',
  }

  useEffect(() => {
    const isLoggedIn = localStorage.getItem("isLoggedIn");
    if (isLoggedIn) {
      const parsedUser = JSON.parse(isLoggedIn);
      if (parsedUser) {
        setUser(parsedUser);
      }
    }
  }, []);

  return (
    <>
      <div
      style={{background:'linear-gradient(180deg, #D9D9D9, rgba(230, 238, 240, 0) 125%)'}}
        className={clsx([
          "hidden md:block h-[70px] md:h-[125px] lg:h-[191px] z-[51] border-b border-white/[0.08] mt-12 md:mt-0 -mx-3 sm:-mx-8 md:-mx-0 px-3 md:border-b-0 relative md:sticky md:inset-x-0 md:top-0 sm:px-8 md:px-10",
          props.layout == "top-menu" && "dark:md:from-darkmode-800",
        ])}
      >
        <div className="flex justify-between items-center h-full">
          {/* BEGIN: Logo */}
          <Link
            to="/"
            className={clsx([
              "-intro-x hidden md:flex w-[20%]",
              props.layout == "side-menu" && "w-[20%]",
              props.layout == "simple-menu" && "xl:w-auto",
              props.layout == "top-menu" && "w-auto",
            ])}
          >
            <img
              alt="logo Villa Allende"
              className="w-100"
              src={innerWidth>1024?logo : logoNoTexto}
            />
          </Link>
          {/* END: Logo */}
          {/* BEGIN: Title */}
          <div className="absolute right-0 flex items-center gap-16">
            <h1 className="text-primary lg:text-5xl md:text-3xl font-semibold drop-shadow-[1px_1px_2px_#00000025]">
              {headerTitle[path as keyof typeof headerTitle]}
            </h1>
          {/* END: Title */}

          {/* BEGIN: Notifications */}
          <div className="flex justify-around items-center md:w-[290px] md:h-[69px] lg:w-[352px] lg:h-[80px] bg-primary rounded-l-[20px]">
      
          <Popover className="mx-5 h-[41px] intro-x sm:mr-6 flex items-center">
            <Popover.Button
              className="
              relative text-white/70 outline-none block
              before:content-[''] before:w-[8px] before:h-[8px] before:rounded-full before:absolute before:top-[-2px] before:right-0 before:bg-danger
            "
            >
              <img
              alt="Notificaciones"
              className="w-100 md:h-[26px] lg:h-[33px]"
              src={mail}
            />
            </Popover.Button>
            <Popover.Panel className="w-[280px] sm:w-[350px] p-5 mt-2">
              <div className="mb-5 font-medium">Notificaciones</div>
              {_.take(fakerData, 5).map((faker, fakerKey) => (
                <div
                  key={fakerKey}
                  className={clsx([
                    "cursor-pointer relative flex items-center",
                    { "mt-5": fakerKey },
                  ])}
                >
                  <div className="relative flex-none w-12 h-12 mr-1 image-fit">
                    <img
                      alt="Imagen de perfil"
                      className="rounded-full"
                      src={faker.images[0]}
                    />
                    <div className="absolute bottom-0 right-0 w-3 h-3 border-2 border-white rounded-full bg-success dark:border-darkmode-600"></div>
                  </div>
                  <div className="ml-2 overflow-hidden">
                    <div className="flex items-center">
                      <a href="" className="mr-5 font-medium truncate text-ligth">
                      {user ? `${user.nombre} ${user.apellido}` : `cargando...`}
                      </a>
                      <div className="ml-auto text-xs text-slate-400 whitespace-nowrap">
                        {faker.times[0]}
                      </div>
                    </div>
                    <div className="w-full truncate text-slate-500 mt-0.5">
                      {faker.news[0].shortContent}
                    </div>
                  </div>
                </div>
              ))}
            </Popover.Panel>
          </Popover>
          {/* END: Notifications */}

          {/* BEGIN: Account Menu */}
          <Menu>
            <Menu.Button className="flex align-center w-100 h-100 intro-x">
              <img
              className="block w-12 h-12 lg:w-14 lg:h-14 image-fit object-cover  shadow-lg zoom-in rounded-full"
                alt="Perfil de Usuario"
                src={user?.img? user.img : placeholderProfile}
              />
              <h3 className="text-white text-center self-center mr-5 ml-3 text-xl font-bold">
                {user ? `${user.nombre} ${user.apellido}` : `cargando...`}</h3>
            </Menu.Button>
            <Menu.Items className="w-56 mt-px relative bg-primary/80 before:block before:absolute before:bg-black before:inset-0 before:rounded-md before:z-[-1] text-white">
              <Menu.Header className="font-normal">
                <div className="font-medium">{user && `${user.nombre} ${user.apellido}`}</div>
                <div className="text-xs text-white/70 mt-0.5 dark:text-slate-500">
                  {user && capitalizeFirstLetter(user.rol)}
                </div>
              </Menu.Header>
              { user && user.oficina?.length > 0 && 
              <Menu.Item 
                className="hover:bg-white/5"
                onClick={()=>navigate('/seleccionar-oficina/')}
              >
                <Lucide icon="LogOut" className="w-4 h-4 mr-2" /> Cambiar de oficina
              </Menu.Item>}
              <Menu.Divider className="bg-white/[0.08]" />
              <Menu.Item 
                className="hover:bg-white/5"
                onClick={handleLogout}
              >
                <Lucide icon="ToggleRight" className="w-4 h-4 mr-2" /> Cerrar Sesión
              </Menu.Item>
            </Menu.Items>
          </Menu>
          </div>
          </div>
          {/* END: Account Menu */}
        </div>
      </div>
    </>
  );
}

export default Main;
