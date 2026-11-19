
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, MessageSquare } from "lucide-react";
import { consultations as initialConsultations } from "../data/consultations";

export default function Consultations({ user }) {
  const [records, setRecords] = useState(initialConsultations);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = {
    studentNim: "",
    studentName: "",
    prodi: user?.prodi || "Informatika",
    date: new Date().toISOString().slice(0, 10),
    topic: "",
    notes: "",
    revision: "",
  };

  const [formData, setFormData] = useState(emptyForm);

  const role = user?.role;

  const visibleRecords = records.filter((record) => {
    if (role === "mahasiswa") {
      return record.studentNim === user?.nim;
    }

    if (role === "dosen") {
      return record.lecturerEmail === user?.email;
    }

    if (role === "admin") {
      return record.prodi === user?.prodi;
    }

    return false;
  });

  const filteredRecords = visibleRecords.filter((record) => {
    const keyword = search.toLowerCase();

    return (
      record.studentName.toLowerCase().includes(keyword) ||
      record.studentNim.toLowerCase().includes(keyword) ||
      record.topic.toLowerCase().includes(keyword)
    );
  });

  const canManage = role === "dosen";

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (record) => {
    setEditingId(record.id);
    setFormData({
      studentNim: record.studentNim,
      studentName: record.studentName,
      prodi: record.prodi,
      date: record.date,
      topic: record.topic,
      notes: record.notes,
      revision: record.revision,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.studentNim.trim() || !formData.studentName.trim()) {
      setError("NIM dan nama mahasiswa wajib diisi.");
      return;
    }

    const cleanData = {
      ...formData,
      studentNim: formData.studentNim.trim(),
      studentName: formData.studentName.trim(),
      topic: formData.topic.trim(),
      notes: formData.notes.trim(),
      revision: formData.revision.trim(),
    };

    if (editingId !== null) {
      setRecords((prev) =>
        prev.map((record) =>
          record.id === editingId
            ? { ...record, ...cleanData }
            : record
        )
      );
    } else {
      setRecords((prev) => [
        {
          id: Date.now(),
          ...cleanData,
          lecturerEmail: user.email,
          lecturerName: user.name,
        },
        ...prev,
      ]);
    }

    setShowForm(false);
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
  };

  const handleDelete = (id) => {
    const confirmed = window.confirm(
      "Yakin ingin menghapus catatan konsultasi ini?"
    );

    if (confirmed) {
      setRecords((prev) => prev.filter((record) => record.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Riwayat Konsultasi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola dan lihat catatan konsultasi skripsi mahasiswa.
          </p>
        </div>

        {canManage && (
          <button
            onClick={openAddForm}
            className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
          >
            <Plus size={18} />
            Tambah Konsultasi
          </button>
        )}
      </div>

      {showForm && canManage && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-slate-800">
              {editingId !== null ? "Edit Konsultasi" : "Tambah Konsultasi"}
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
                  NIM Mahasiswa
                </label>
                <input
                  required
                  value={formData.studentNim}
                  onChange={(e) =>
                    setFormData({ ...formData, studentNim: e.target.value })
                  }
                  placeholder="Contoh: 23021001"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Nama Mahasiswa
                </label>
                <input
                  required
                  value={formData.studentName}
                  onChange={(e) =>
                    setFormData({ ...formData, studentName: e.target.value })
                  }
                  placeholder="Nama mahasiswa"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
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
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none"
                >
                  <option>Informatika</option>
                  <option>Sistem Informasi</option>
                  <option>Teknologi Informasi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">
                  Tanggal Konsultasi
                </label>
                <input
                  required
                  type="date"
                  value={formData.date}
                  onChange={(e) =>
                    setFormData({ ...formData, date: e.target.value })
                  }
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">
                  Topik Konsultasi
                </label>
                <input
                  required
                  value={formData.topic}
                  onChange={(e) =>
                    setFormData({ ...formData, topic: e.target.value })
                  }
                  placeholder="Contoh: Metodologi Penelitian"
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">
                  Catatan Konsultasi
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.notes}
                  onChange={(e) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                  placeholder="Tuliskan pembahasan konsultasi..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">
                  Arahan / Revisi
                </label>
                <textarea
                  required
                  rows={3}
                  value={formData.revision}
                  onChange={(e) =>
                    setFormData({ ...formData, revision: e.target.value })
                  }
                  placeholder="Tuliskan arahan atau revisi untuk mahasiswa..."
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5 outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {error && (
              <p className="text-sm text-red-600">{error}</p>
            )}

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowForm(false)}
                className="px-4 py-2 rounded-lg border border-slate-300 text-slate-600"
              >
                Batal
              </button>

              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                Simpan Konsultasi
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="relative w-full md:max-w-sm mb-5">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari mahasiswa atau topik..."
            className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Total catatan: <strong>{filteredRecords.length}</strong>
        </p>

        {filteredRecords.length === 0 ? (
          <div className="text-center py-12">
            <MessageSquare size={32} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-500 font-medium">
              Belum ada riwayat konsultasi.
            </p>
            <p className="text-sm text-slate-400 mt-1">
              Catatan konsultasi akan muncul di halaman ini.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredRecords.map((record) => (
              <div
                key={record.id}
                className="border border-slate-200 rounded-xl p-4"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between gap-3">
                  <div>
                    <h3 className="font-semibold text-slate-800">
                      {record.topic}
                    </h3>
                    <p className="text-sm text-slate-500 mt-1">
                      {record.studentName} · {record.studentNim}
                    </p>
                    <p className="text-xs text-slate-400 mt-1">
                      {record.prodi} · {record.date}
                    </p>
                    <p className="text-xs text-slate-500 mt-2">
                      Dosen: {record.lecturerName}
                    </p>
                  </div>

                  {canManage && record.lecturerEmail === user.email && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => openEditForm(record)}
                        className="p-2 h-fit text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(record.id)}
                        className="p-2 h-fit text-red-500 hover:bg-red-50 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                  <div className="bg-slate-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-slate-500 mb-1">
                      CATATAN KONSULTASI
                    </p>
                    <p className="text-sm text-slate-700">
                      {record.notes}
                    </p>
                  </div>

                  <div className="bg-indigo-50 rounded-lg p-3">
                    <p className="text-xs font-semibold text-indigo-600 mb-1">
                      ARAHAN / REVISI
                    </p>
                    <p className="text-sm text-slate-700">
                      {record.revision}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
