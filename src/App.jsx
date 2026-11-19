
import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { users } from "./data/users";

import DashboardLayout from "./layouts/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import Students from "./pages/Students";
import Consultations from "./pages/Consultations";
import Lecturers from "./pages/Lecturers";
import Theses from "./pages/Theses";
import Defense from "./pages/Defense";
import Schedule from "./pages/Schedule";

import {
  GraduationCap,
  BookOpen,
  Mail,
  LockKeyhole,
  Eye,
  EyeOff,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const roles = [
  { id: "admin", label: "Admin / Kaprodi" },
  { id: "dosen", label: "Dosen" },
  { id: "mahasiswa", label: "Mahasiswa" },
];

function Login({ onLogin }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();

    const user = users.find(
      (item) =>
        item.email.toLowerCase() === email.trim().toLowerCase() &&
        item.password === password &&
        item.role === selectedRole
    );

    if (!user) {
      setError("Email, password, atau jenis akun tidak sesuai.");
      return;
    }

    setError("");
    onLogin(user);
  };

  return (
    <main className="min-h-screen bg-[#F6F7FB] p-3 sm:p-5 lg:p-8">
      <div className="mx-auto grid min-h-[calc(100vh-24px)] max-w-[1440px] overflow-hidden rounded-[28px] bg-white shadow-2xl shadow-slate-200/60 lg:min-h-[calc(100vh-64px)] lg:grid-cols-[0.95fr_1.05fr]">
        <section className="relative hidden flex-col justify-between overflow-hidden bg-[#3730A3] p-10 text-white lg:flex xl:p-14">
          <div className="absolute -right-32 top-20 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -right-20 top-32 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-indigo-400/20 blur-3xl" />

          <div className="relative z-10 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur">
              <GraduationCap size={27} />
            </div>
            <div>
              <h1 className="text-2xl font-bold tracking-wide">SIMS</h1>
              <p className="text-xs text-indigo-200">
                Academic Management System
              </p>
            </div>
          </div>

          <div className="relative z-10 my-12 max-w-lg">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-medium text-indigo-100">
              <Sparkles size={14} />
              Smart Thesis Management
            </div>

            <h2 className="text-4xl font-bold leading-[1.2] xl:text-5xl">
              Your Academic Journey,
              <span className="mt-2 block text-indigo-200">
                Organized.
              </span>
            </h2>

            <p className="mt-6 max-w-md text-base leading-8 text-indigo-100/80">
              Satu platform untuk mengelola perjalanan skripsi,
              konsultasi akademik, dan penjadwalan defense
              dengan lebih terstruktur.
            </p>

            <div className="mt-10 flex items-center gap-4 rounded-2xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/15">
                <BookOpen size={23} />
              </div>
              <div>
                <p className="font-semibold">One Integrated Platform</p>
                <p className="mt-1 text-sm text-indigo-200">
                  For students, lecturers, and administrators.
                </p>
              </div>
            </div>
          </div>

          <p className="relative z-10 text-xs text-indigo-200/70">
            © 2026 SIMS · Fakultas Ilmu Komputer
          </p>
        </section>

        <section className="flex items-center justify-center px-5 py-10 sm:px-10 lg:px-12 xl:px-20">
          <div className="w-full max-w-[480px]">
            <div className="mb-10 flex items-center gap-3 lg:hidden">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
                <GraduationCap size={25} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-900">SIMS</h1>
                <p className="text-xs text-slate-500">
                  Sistem Informasi Manajemen Skripsi
                </p>
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-sm font-semibold tracking-wide text-indigo-600">
                WELCOME BACK
              </p>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
                Sign in to SIMS
              </h2>
            </div>

            <form onSubmit={handleLogin}>
              <div className="mb-7">
                <label className="mb-3 block text-sm font-semibold text-slate-800">
                  Masuk sebagai
                </label>

                <div className="relative">
                  <select
                    value={selectedRole}
                    onChange={(e) => {
                      setSelectedRole(e.target.value);
                      setError("");
                    }}
                    required
                    className="w-full appearance-none rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 pr-11 text-sm text-slate-800 outline-none transition focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  >
                    <option value="">Login as</option>
                    {roles.map((role) => (
                      <option key={role.id} value={role.id}>
                        {role.label}
                      </option>
                    ))}
                  </select>

                  <span className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-slate-400">
                    ▼
                  </span>
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="email@unklab.ac.id"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                </div>
              </div>

              <div className="mb-5">
                <label className="mb-2 block text-sm font-semibold text-slate-800">
                  Password
                </label>
                <div className="relative">
                  <LockKeyhole
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Password"
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-12 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-50"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600"
                    aria-label="Tampilkan atau sembunyikan password"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {error && (
                <div className="mb-5 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                className="group mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 py-3.5 text-sm font-semibold text-white shadow-lg shadow-indigo-200 transition hover:-translate-y-0.5 hover:bg-indigo-700 hover:shadow-indigo-300"
              >
                Sign In
                <ArrowRight
                  size={18}
                  className="transition group-hover:translate-x-1"
                />
              </button>
            </form>

            <div className="mt-8 border-t border-slate-100 pt-6 text-center">
              <p className="text-xs leading-6 text-slate-400">
                Sistem Informasi Manajemen Skripsi
                <br />
                Fakultas Ilmu Komputer · Universitas Klabat
              </p>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}


function App() {
  const [loggedUser, setLoggedUser] = useState(null);

  return (
    <BrowserRouter>
      {loggedUser ? (
        <Routes>
          <Route
            element={
              <DashboardLayout
                user={loggedUser}
                onLogout={() => setLoggedUser(null)}
              />
            }
          >
            <Route path="/dashboard" element={<Dashboard />} />

            <Route
              path="/mahasiswa"
              element={
                loggedUser.role === "admin" ? (
                  <Students />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route
              path="/konsultasi"
              element={<Consultations user={loggedUser} />}
            />

            <Route
              path="/dosen"
              element={
                loggedUser.role === "admin" ? (
                  <Lecturers />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route
              path="/skripsi"
              element={
                loggedUser.role === "admin" ? (
                  <Theses />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route
              path="/defense"
              element={
                loggedUser.role === "admin" ? (
                  <Defense />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route
              path="/jadwal"
              element={
                ["mahasiswa", "dosen"].includes(loggedUser.role) ? (
                  <Schedule user={loggedUser} />
                ) : (
                  <Navigate to="/dashboard" replace />
                )
              }
            />

            <Route
              path="*"
              element={<Navigate to="/dashboard" replace />}
            />
          </Route>
        </Routes>
      ) : (
        <Login onLogin={setLoggedUser} />
      )}
    </BrowserRouter>
  );
}

export default App;

