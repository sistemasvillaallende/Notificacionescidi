import OfficeCards from "./OfficeCard";

const index = () => {
  const isLoggedIn = localStorage.getItem("isLoggedIn") as string;
  const user = isLoggedIn ? JSON.parse(isLoggedIn) : null
  const offices = Array.isArray(user?.nombre_oficina)? user?.nombre_oficina :[user?.nombre_oficina]

  return (
    <>
    <h1 className="p-10 font-bold text-3xl">Mis oficinas</h1>
    <div className="px-10">
    <h2 className="pt-6 md:w-[30%] border-b-4 font-semibold text-xl">Notificaciones</h2>
    </div>
    <section className="px-10 gap-8 flex flex-wrap justify-between py-6">
      {offices?.map((office: string) => (
        <OfficeCards key={office} title={office.toLocaleLowerCase().includes('oficina')?office:'Oficina ' + office} office={office} type="notificaciones" />
      ))}
    </section>
    </>
  );
};

export default index;
