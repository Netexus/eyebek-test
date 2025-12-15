"use client"
import Link from "next/link";
import { useRouter } from "next/navigation";
import { LayoutDashboard, Users, ClipboardCheck, LogOut } from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();

  const logOut = () => {
    // Clear auth data
    if (typeof window !== 'undefined') {
      localStorage.removeItem('eyebek_token');
      localStorage.removeItem('eyebek_company');
    }
    // Redirect to login
    router.push('/login');
  }

  return (
    <div className="h-full flex">
      <aside className="w-64 bg-white border-r border-gray-200 p-4 h-screen flex flex-col">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">EyeBek</h1>
        <hr className="border-gray-300 mb-4" />

        <nav className="flex flex-col justify-between flex-1 gap-3">
          <div className="flex flex-col gap-3">
            <Link
              href="/dashboard_company"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
            >
              <LayoutDashboard size={20} />
              Dashboard
            </Link>

            <Link
              href="/dashboard_company/users"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
            >
              <Users size={20} />
              Usuarios
            </Link>

            <Link
              href="/dashboard_company/attendance"
              className="flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 hover:text-gray-900 transition-colors font-medium"
            >
              <ClipboardCheck size={20} />
              Asistencia
            </Link>
          </div>

          <button
            onClick={logOut}
            className="flex items-center justify-center gap-2 p-3 rounded-lg bg-black text-white hover:bg-gray-800 transition-colors font-medium"
          >
            <LogOut size={20} />
            Cerrar sesión
          </button>
        </nav>
      </aside>

      <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
    </div>
  );
}
