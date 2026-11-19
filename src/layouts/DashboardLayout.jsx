
import { NavLink, Outlet, useNavigate } from "react-router-dom"
import {
  GraduationCap,
  LayoutDashboard,
  Users,
  BookOpen,
  CalendarDays,
  UserRound,
  History,
  Bell,
  LogOut,
  Menu,
} from "lucide-react"

const menus = {
  admin: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Data Mahasiswa", path: "/mahasiswa", icon: Users },
    { label: "Data Skripsi & Konsultasi", path: "/skripsi", icon: BookOpen },
    { label: "Penjadwalan Defense", path: "/defense", icon: CalendarDays },
    { label: "Data Dosen & Keahlian", path: "/dosen", icon: UserRound },
  ],
  dosen: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Riwayat Konsultasi", path: "/konsultasi", icon: History },
    { label: "Jadwal Defense", path: "/jadwal", icon: CalendarDays },
  ],
  mahasiswa: [
    { label: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
    { label: "Skripsi Saya", path: "/skripsi-saya", icon: BookOpen },
    { label: "Riwayat Konsultasi", path: "/konsultasi", icon: History },
    { label: "Jadwal Defense", path: "/jadwal", icon: CalendarDays },
  ],
}

function DashboardLayout({ user, onLogout }) {
  const navigate = useNavigate()
  const roleMenus = menus[user?.role] || []

  const handleLogout = () => {
    onLogout()
    navigate("/", { replace: true })
  }

  return (
    <div className="min-h-screen bg-slate-50 md:flex">

      {/* SIDEBAR */}
      <aside className="hidden w-72 shrink-0 flex-col border-r border-slate-200 bg-white md:flex">
        <div className="flex h-20 items-center gap-3 border-b border-slate-100 px-7">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <GraduationCap size={25} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">SIMS</h1>
            <p className="text-xs text-slate-500">Academic Management</p>
          </div>
        </div>

        <div className="px-5 py-6">
          <p className="mb-4 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Main Menu
          </p>

          <nav className="space-y-1">
            {roleMenus.map((item) => {
              const Icon = item.icon

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/dashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                      isActive
                        ? "bg-indigo-50 text-indigo-700"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-900"
                    }`
                  }
                >
                  <Icon size={19} />
                  {item.label}
                </NavLink>
              )
            })}
          </nav>
        </div>

        <div className="mt-auto border-t border-slate-100 p-5">
          <div className="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
              {user?.name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-slate-800">
                {user?.name}
              </p>
              <p className="text-xs capitalize text-slate-500">
                {user?.role}
              </p>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="mt-3 flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <div className="min-w-0 flex-1">

        {/* TOP NAVBAR */}
        <header className="sticky top-0 z-20 flex h-20 items-center justify-between border-b border-slate-200 bg-white px-5 sm:px-8">
          <div>
            <p className="text-sm text-slate-500">
              Fakultas Ilmu Komputer
            </p>
            <h2 className="text-lg font-semibold text-slate-900">
              Sistem Informasi Manajemen Skripsi
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <button
              type="button"
              className="relative rounded-xl p-2.5 text-slate-500 transition hover:bg-slate-100"
              aria-label="Notifikasi"
            >
              <Bell size={20} />
            </button>

            <div className="hidden h-9 w-px bg-slate-200 sm:block" />

            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 font-semibold text-indigo-700">
                {user?.name?.charAt(0) || "U"}
              </div>
              <span className="hidden text-sm font-medium text-slate-700 sm:block">
                {user?.name}
              </span>
            </div>
          </div>
        </header>

        {/* PAGE CONTENT */}
        <main className="p-5 sm:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default DashboardLayout
