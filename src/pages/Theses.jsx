
import { useState } from "react";
import { Search, Plus, Pencil, Trash2, X, BookOpen } from "lucide-react";
import { theses as initialTheses } from "../data/theses";

export default function Theses() {
  const [thesesList, setThesesList] = useState(initialTheses);
  const [search, setSearch] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("Semua");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [selectedThesis, setSelectedThesis] = useState(null);
  const [error, setError] = useState("");

  const emptyForm = {
    studentNim: "",
    studentName: "",
    prodi: "Informatika",
    title: "",
    abstract: "",
    keywords: "",
    status: "Proposal",
  };

  const [formData, setFormData] = useState(emptyForm);

  const statuses = [
    "Proposal",
    "Research in Progress",
    "Thesis Completion",
    "Ready for Defense",
    "Completed",
  ];

  const filteredTheses = thesesList.filter((thesis) => {
    const keyword = search.toLowerCase();

    const matchesSearch =
      thesis.studentName.toLowerCase().includes(keyword) ||
      thesis.studentNim.toLowerCase().includes(keyword) ||
      thesis.title.toLowerCase().includes(keyword);

    const matchesStatus =
      selectedStatus === "Semua" || thesis.status === selectedStatus;

    return matchesSearch && matchesStatus;
  });

  const openAddForm = () => {
    setEditingId(null);
    setFormData(emptyForm);
    setError("");
    setShowForm(true);
  };

  const openEditForm = (thesis) => {
    setEditingId(thesis.id);
    setFormData({
      studentNim: thesis.studentNim,
      studentName: thesis.studentName,
      prodi: thesis.prodi,
      title: thesis.title,
      abstract: thesis.abstract,
      keywords: thesis.keywords.join(", "),
      status: thesis.status,
    });
    setError("");
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const cleanData = {
      ...formData,
      studentNim: formData.studentNim.trim(),
      studentName: formData.studentName.trim(),
      title: formData.title.trim(),
      abstract: formData.abstract.trim(),
      keywords: formData.keywords
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };

    if (
      !cleanData.studentNim ||
      !cleanData.studentName ||
      !cleanData.title ||
      !cleanData.abstract ||
      cleanData.keywords.length === 0
    ) {
      setError("Semua data wajib diisi, termasuk minimal satu kata kunci.");
      return;
    }

    if (editingId !== null) {
      setThesesList((prev) =>
        prev.map((thesis) =>
          thesis.id === editingId
            ? { ...thesis, ...cleanData }
            : thesis
        )
      );
    } else {
      setThesesList((prev) => [
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
    if (window.confirm("Yakin ingin menghapus data skripsi ini?")) {
      setThesesList((prev) => prev.filter((thesis) => thesis.id !== id));
    }
  };

  const statusColor = (status) => {
    if (status === "Ready for Defense") return "bg-green-50 text-green-700";
    if (status === "Completed") return "bg-blue-50 text-blue-700";
    if (status === "Research in Progress") return "bg-amber-50 text-amber-700";
    return "bg-slate-100 text-slate-600";
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">
            Data Skripsi
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Kelola informasi dan perkembangan skripsi mahasiswa.
          </p>
        </div>

        <button
          onClick={openAddForm}
          className="flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2.5 rounded-lg text-sm font-medium"
        >
          <Plus size={18} />
          Tambah Skripsi
        </button>
      </div>

      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-semibold text-lg text-slate-800">
              {editingId !== null ? "Edit Data Skripsi" : "Tambah Data Skripsi"}
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
                <label className="block text-sm font-medium mb-1.5">NIM</label>
                <input
                  required
                  value={formData.studentNim}
                  onChange={(e) => setFormData({ ...formData, studentNim: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                  placeholder="NIM mahasiswa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Nama Mahasiswa</label>
                <input
                  required
                  value={formData.studentName}
                  onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                  placeholder="Nama mahasiswa"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Program Studi</label>
                <select
                  value={formData.prodi}
                  onChange={(e) => setFormData({ ...formData, prodi: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                >
                  <option>Informatika</option>
                  <option>Sistem Informasi</option>
                  <option>Teknologi Informasi</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1.5">Status Skripsi</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                >
                  {statuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Judul Skripsi</label>
                <input
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                  placeholder="Masukkan judul skripsi"
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Abstrak</label>
                <textarea
                  required
                  rows={5}
                  value={formData.abstract}
                  onChange={(e) => setFormData({ ...formData, abstract: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                  placeholder="Masukkan abstrak skripsi..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium mb-1.5">Kata Kunci</label>
                <input
                  required
                  value={formData.keywords}
                  onChange={(e) => setFormData({ ...formData, keywords: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2.5"
                  placeholder="Machine Learning, Data Mining, Prediksi"
                />
                <p className="text-xs text-slate-400 mt-1">
                  Pisahkan kata kunci menggunakan koma.
                </p>
              </div>
            </div>

            {error && <p className="text-sm text-red-600">{error}</p>}

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
                className="px-4 py-2 rounded-lg bg-indigo-600 text-white"
              >
                Simpan Skripsi
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="bg-white border border-slate-200 rounded-xl p-5">
        <div className="flex flex-col md:flex-row gap-3 justify-between mb-5">
          <div className="relative w-full md:max-w-sm">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari mahasiswa atau judul skripsi..."
              className="w-full pl-10 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm"
            />
          </div>

          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2.5 text-sm"
          >
            <option>Semua</option>
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </div>

        <p className="text-sm text-slate-500 mb-4">
          Total skripsi: <strong>{thesesList.length}</strong>
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500">
                <th className="py-3 px-3">Mahasiswa</th>
                <th className="py-3 px-3">Judul Skripsi</th>
                <th className="py-3 px-3">Program Studi</th>
                <th className="py-3 px-3">Status</th>
                <th className="py-3 px-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredTheses.map((thesis) => (
                <tr key={thesis.id} className="border-b border-slate-100">
                  <td className="py-3 px-3">
                    <p className="font-medium text-slate-800">{thesis.studentName}</p>
                    <p className="text-xs text-slate-500">{thesis.studentNim}</p>
                  </td>
                  <td className="py-3 px-3 max-w-xs">
                    <p className="text-slate-700">{thesis.title}</p>
                  </td>
                  <td className="py-3 px-3 text-slate-600">{thesis.prodi}</td>
                  <td className="py-3 px-3">
                    <span className={`px-2.5 py-1 rounded-full text-xs ${statusColor(thesis.status)}`}>
                      {thesis.status}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <div className="flex justify-center gap-1">
                      <button
                        onClick={() => setSelectedThesis(thesis)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg"
                        title="Detail"
                      >
                        <BookOpen size={16} />
                      </button>
                      <button
                        onClick={() => openEditForm(thesis)}
                        className="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg"
                        title="Edit"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(thesis.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg"
                        title="Hapus"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filteredTheses.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-slate-400">
                    Data skripsi tidak ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedThesis && (
        <div className="bg-white border border-indigo-200 rounded-xl p-6 space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="font-semibold text-lg text-slate-800">Detail Skripsi</h2>
            <button onClick={() => setSelectedThesis(null)} className="text-slate-400">
              <X size={20} />
            </button>
          </div>
          <h3 className="font-semibold text-indigo-700">{selectedThesis.title}</h3>
          <p className="text-sm text-slate-600">
            {selectedThesis.studentName} · {selectedThesis.studentNim}
          </p>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">ABSTRAK</p>
            <p className="text-sm text-slate-700">{selectedThesis.abstract}</p>
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 mb-1">KATA KUNCI</p>
            <div className="flex flex-wrap gap-2">
              {selectedThesis.keywords.map((keyword, index) => (
                <span key={index} className="px-2.5 py-1 rounded-full bg-indigo-50 text-indigo-700 text-xs">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
