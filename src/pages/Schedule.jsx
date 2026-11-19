
import { useEffect, useState } from "react";
import { getSchedules } from "../services/dbService";
import { lecturers } from "../data/lecturers";
import {
  CalendarDays,
  Clock,
  MapPin,
  GraduationCap,
  BookOpen,
  AlertCircle,
} from "lucide-react";

export default function Schedule({ user }) {
  const [schedules, setSchedules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadSchedules() {
      try {
        const data = await getSchedules();

        const publishedSchedules = data.filter(
          (schedule) => schedule.published === true
        );

        let filteredSchedules = [];

        if (user.role === "mahasiswa") {
          filteredSchedules = publishedSchedules.filter(
            (schedule) => schedule.studentNim === user.nim
          );
        } else if (user.role === "dosen") {
          const lecturer = lecturers.find(
            (item) => item.email.toLowerCase() === user.email.toLowerCase()
          );

          filteredSchedules = publishedSchedules.filter(
            (schedule) =>
              lecturer &&
              (schedule.examiner1 === lecturer.name ||
                schedule.examiner2 === lecturer.name)
          );
        }

        setSchedules(filteredSchedules);
      } catch (err) {
        setError(err.message || "Gagal mengambil jadwal defense.");
      } finally {
        setLoading(false);
      }
    }

    loadSchedules();
  }, [user]);

  function formatDate(dateString) {
    return new Date(`${dateString}T00:00:00`).toLocaleDateString(
      "id-ID",
      {
        day: "numeric",
        month: "long",
        year: "numeric",
      }
    );
  }

  if (loading) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center">
        <p className="text-sm text-slate-500">
          Memuat jadwal defense...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Jadwal Defense
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Informasi jadwal sidang skripsi yang telah dipublikasikan.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          <AlertCircle size={18} className="mr-2 inline" />
          {error}
        </div>
      )}

      {!error && schedules.length === 0 && (
        <div className="rounded-xl border border-slate-200 bg-white px-6 py-12 text-center">
          <CalendarDays
            size={42}
            className="mx-auto text-slate-300"
          />
          <h2 className="mt-4 font-semibold text-slate-800">
            Belum Ada Jadwal Defense
          </h2>
          <p className="mt-2 text-sm text-slate-500">
            Jadwal defense yang telah dipublikasikan akan muncul di halaman ini.
          </p>
        </div>
      )}

      {schedules.length > 0 && (
        <div className="space-y-4">
          {schedules.map((schedule) => (
            <div
              key={schedule.id}
              className="rounded-xl border border-slate-200 bg-white p-6"
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-700">
                  Dipublikasikan
                </span>

                <span className="text-xs text-slate-400">
                  {schedule.prodi}
                </span>
              </div>

              <div className="mt-4">
                <p className="text-sm text-slate-500">
                  {user.role === "mahasiswa"
                    ? "Jadwal Defense Saya"
                    : "Jadwal sebagai Dosen Penguji"}
                </p>

                <h2 className="mt-1 text-lg font-bold text-slate-900">
                  {schedule.studentName}
                </h2>

                <div className="mt-3 flex items-start gap-2">
                  <BookOpen
                    size={18}
                    className="mt-0.5 shrink-0 text-indigo-600"
                  />
                  <p className="text-sm text-slate-700">
                    {schedule.thesisTitle}
                  </p>
                </div>
              </div>

              <div className="mt-5 grid gap-4 border-t border-slate-100 pt-5 sm:grid-cols-2">
                <div className="flex items-center gap-3">
                  <CalendarDays
                    size={19}
                    className="text-indigo-600"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Tanggal</p>
                    <p className="text-sm font-medium text-slate-800">
                      {formatDate(schedule.date)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock
                    size={19}
                    className="text-indigo-600"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Waktu</p>
                    <p className="text-sm font-medium text-slate-800">
                      {schedule.time} WITA
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 sm:col-span-2">
                  <MapPin
                    size={19}
                    className="text-indigo-600"
                  />
                  <div>
                    <p className="text-xs text-slate-500">Lokasi</p>
                    <p className="text-sm font-medium text-slate-800">
                      {schedule.location}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <p className="mb-3 text-sm font-semibold text-slate-800">
                  Dosen Penguji
                </p>

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <GraduationCap
                      size={17}
                      className="text-indigo-600"
                    />
                    Penguji 1: {schedule.examiner1}
                  </div>

                  <div className="flex items-center gap-2 text-sm text-slate-700">
                    <GraduationCap
                      size={17}
                      className="text-indigo-600"
                    />
                    Penguji 2: {schedule.examiner2}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
