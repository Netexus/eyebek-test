"use client"
import Link from "next/link";
import GenericButton from '@/components/GenericButton/GenericButton';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {

  const logOut= () => {
    //Function for logout
  }


  return (
    <div className="h-full flex">
      <aside className="w-64 text-black p-4  h-screen flex flex-col">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <hr className="text-gray-300" />
        <nav className="flex flex-col justify-between flex-1 gap-5 mt-5">
          <div className="flex flex-col gap-5">
            <Link href={"/reports"} className="transition-all duration-300 font-semibold shadow-lg hover:shadow-xl bg-black text-white hover:bg-gray-900 hover:scale-105 p-3 rounded-md text-lg ">Reportes</Link>
            <Link href={"/reports"} className="transition-all duration-300 font-semibold shadow-lg hover:shadow-xl bg-black text-white hover:bg-gray-900 hover:scale-105 p-3 rounded-md text-lg ">Empresas</Link>
          </div>
          <div className="flex justify-center">
            <GenericButton textButton="Cerrar sesion" onClick={logOut} variant="black" size="none" type="button" className="w-[200px]" />
          </div>
        </nav>
      </aside>

      {/* Contenido */}
      <main className="flex-1 overflow-auto bg-gray-100">{children}</main>
    </div>
  );
}
