
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X } from "lucide-react";
import { students as initialStudents } from "../data/students";

export default function Students() {
  const [students, setStudents] = useState(initialStudents);
  const [search, setSearch] = useState("");
  const [selectedProdi, setSelectedProdi] = useState("Semua");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = {
    nim: "",
    name: "",
    email: "",
    prodi: "Informatika",
    status: "Aktif",
  };

  const [formData, setFormData] = useState(emptyForm);

  const filteredStudents = students.filter((student) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      student.name.toLowerCase().includes(keyword) ||
      student.nim.toLowerCase().includes(keyword) ||
      student.email.toLowerCase().includes(keyword);

    const matchesProdi =
      selectedProdi === "Semua" || student.prodi === selectedProdi;

    return matchesSearch && matchesProdi;
  });

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (student) => {
    setEditingId(student.id);
    setFormData({
      nim: student.nim,
      name: student.name,
      email: student.email,
      prodi: student.prodi,
      status: student.status,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const nimExists = students.some(
      (student) =>
        student.nim === formData.nim.trim() &&
        student.id !== editingId
    );

    const emailExists = students.some(
      (student) =>
        student.email.toLowerCase() === formData.email.trim().toLowerCase() &&
        student.id !== editingId
    );

    if (nimExists) {
      setError("NIM sudah terdaftar.");
      return;
    }

    if (emailExists) {
      setError("Email sudah digunakan.");
      return;
    }

    const cleanData = {
      ...formData,
      nim: formData.nim.trim(),
      name: formData.name.trim(),
      email: formData.email.trim(),
    };

    if (editingId !== null) {
      setStudents((prev) =>
        prev.map((student) =>
          student.id === editingId
            ? { ...student, ...cleanData }
            : student
        )
      );
    } else {
      setStudents((prev) => [
        ...prev,
        { id: Date.now(), ...cleanData },
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus data mahasiswa ini?"
    );

    if (confirmed) {
      setStudents((prev) => prev.filter((student) => student.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Data Mahasiswa
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola data mahasiswa pada program studi Anda.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Tambah Mahasiswa
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-slate-800">
              {editingId !== null ? "Edit Mahasiswa" : "Tambah Mahasiswa"}
            </h2>

            <button
              onClick={() => setShowForm(false)}
              className="text-slate-400 hover:text-slate-700"
            >
              <X size={20} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-1.5">
                  NIM
                </label>
                <input
                  required
                  value={formData.nim}
                  onChange={(e) =>
                    setFormData({ ...formData, nim: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan NIM"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Nama Mahasiswa
                </label>
                <input
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="Masukkan nama"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Email
                </label>
                <input
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                  placeholder="nama@unklab.ac.id"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Program Studi
                </label>
                <select
                  value={formData.prodi}
                  onChange={(e) =>
                    setFormData({ ...formData, prodi: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Informatika</option>
                  <option>Sistem Informasi</option>
                  <option>Teknologi Informasi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option>Aktif</option>
                  <option>Tidak Aktif</option>
                </select>
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600 hover:bg-slate-50"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                {editingId !== null ? "Simpan Perubahan" : "Simpan Mahasiswa"}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col md:flex-row gap-3 justify-between mb-5">
          <div className="relative w-full md:max-w-sm">
            <Search
              size={18}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari nama, NIM, atau email..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <select
            value={selectedProdi}
            onChange={(e) => setSelectedProdi(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm outline-none"
          >
            <option>Semua</option>
            <option>Informatika</option>
            <option>Sistem Informasi</option>
            <option>Teknologi Informasi</option>
          </select>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Total mahasiswa: <strong>{students.length}</strong>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 px-3 font-medium">Mahasiswa</th>
                <th className="py-3 px-3 font-medium">NIM</th>
                <th className="py-3 px-3 font-medium">Program Studi</th>
                <th className="py-3 px-3 font-medium">Status</th>
                <th className="py-3 px-3 font-medium text-center">Aksi</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.map((student) => (
                <tr
                  key={student.id}
                  className="border-b border-slate-100 hover:bg-slate-50"
                >
                  <td className="py-3 px-3">
                    <p className="font-medium text-slate-800">
                      {student.name}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">
                      {student.email}
                    </p>
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {student.nim}
                  </td>
                  <td className="py-3 px-3 text-slate-600">
                    {student.prodi}
                  </td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-1 rounded-full text-xs bg-green-50 text-green-700">
                      {student.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => openEditForm(student)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(student.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredStudents.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    Data mahasiswa tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
