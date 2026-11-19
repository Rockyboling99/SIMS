
import {
  CalendarDays,
  Clock,
  BookOpen,
  ArrowRight,
  GraduationCap,
} from "lucide-react"

function Dashboard() {
  return (
    <div className="space-y-8">

      {/* PAGE HEADER */}
      <div>
        <p className="text-sm font-medium text-indigo-600">
          Overview
        </p>
        <h1 className="mt-1 text-2xl font-bold text-slate-900">
          Dashboard
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Selamat datang di Sistem Informasi Manajemen Skripsi.
        </p>
      </div>

      {/* WELCOME CARD */}
      <div className="relative overflow-hidden rounded-2xl bg-indigo-600 p-7 text-white">
        <div className="absolute -right-10 -top-16 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -right-4 -top-8 h-48 w-48 rounded-full border border-white/10" />

        <div className="relative z-10 max-w-xl">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-white/15">
            <GraduationCap size={27} />
          </div>

          <h2 className="text-2xl font-bold">
            Selamat Datang di SIMS!
          </h2>

          <p className="mt-3 text-sm leading-7 text-indigo-100">
            Kelola data skripsi, pantau aktivitas konsultasi,
            dan atur jadwal defense mahasiswa melalui satu
            platform yang terintegrasi.
          </p>
        </div>
      </div>

      {/* CONTENT GRID */}
      <div className="grid gap-6 xl:grid-cols-2">

        {/* UPCOMING DEFENSE */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Jadwal Defense Mendatang
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Jadwal ujian skripsi mahasiswa.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <CalendarDays size={20} />
            </div>
          </div>

          <div className="mt-6 rounded-xl border border-dashed border-slate-200 p-8 text-center">
            <CalendarDays
              size={30}
              className="mx-auto text-slate-300"
            />

            <p className="mt-3 text-sm font-medium text-slate-600">
              Belum ada jadwal defense.
            </p>

            <p className="mt-1 text-xs text-slate-400">
              Jadwal yang sudah diterbitkan akan muncul di sini.
            </p>
          </div>
        </section>

        {/* RECENT ACTIVITIES */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-900">
                Aktivitas Terbaru
              </h3>
              <p className="mt-1 text-sm text-slate-500">
                Informasi aktivitas akademik.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Clock size={20} />
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                <BookOpen size={19} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Data skripsi
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Aktivitas pengelolaan data skripsi akan ditampilkan di sini.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-50 text-purple-600">
                <GraduationCap size={19} />
              </div>

              <div>
                <p className="text-sm font-medium text-slate-800">
                  Data mahasiswa
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Aktivitas pengelolaan mahasiswa akan ditampilkan di sini.
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>

    </div>
  )
}

export default Dashboard
