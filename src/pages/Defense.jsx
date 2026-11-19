
import { useEffect, useState } from "react";
import { theses } from "../data/theses";
import { lecturers } from "../data/lecturers";
import { analyzeThesis } from "../services/aiService";
import { matchLecturers } from "../services/lecturerMatcher";
import {
  createSchedule,
  getSchedules,
  publishSchedule,
} from "../services/dbService";

export default function Defense() {
  const candidates = theses.filter(
    (thesis) => thesis.status === "Ready for Defense"
  );

  const [selectedThesisId, setSelectedThesisId] = useState(
    candidates[0]?.id || ""
  );
  const [analysis, setAnalysis] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [publishingId, setPublishingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [examiner1, setExaminer1] = useState("");
  const [examiner2, setExaminer2] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [location, setLocation] = useState("");
  const [schedules, setSchedules] = useState([]);

  const selectedThesis = theses.find(
    (thesis) => String(thesis.id) === String(selectedThesisId)
  );

  useEffect(() => {
    async function loadSchedules() {
      try {
        const data = await getSchedules();
        setSchedules(data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadSchedules();
  }, []);

  async function handleAnalyze() {
    if (!selectedThesis) {
      setError("Pilih mahasiswa terlebih dahulu.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setAnalysis(null);
    setRecommendations([]);
    setExaminer1("");
    setExaminer2("");

    try {
      const result = await analyzeThesis(selectedThesis);
      const matched = matchLecturers(result, lecturers);

      setAnalysis(result);
      setRecommendations(matched);

      if (matched.length === 0) {
        setError(
          "Belum ditemukan dosen yang cocok. Periksa data keahlian dosen."
        );
      }
    } catch (err) {
      setError(err.message || "Gagal menganalisis skripsi dengan AI.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSaveSchedule(event) {
    event.preventDefault();

    if (!selectedThesis || !examiner1 || !examiner2) {
      setError("Pilih dua dosen penguji terlebih dahulu.");
      return;
    }

    if (examiner1 === examiner2) {
      setError("Dosen penguji pertama dan kedua harus berbeda.");
      return;
    }

    if (!date || !time || !location.trim()) {
      setError("Lengkapi tanggal, waktu, dan lokasi defense.");
      return;
    }

    setSaving(true);
    setError("");
    setSuccess("");

    const schedule = {
      studentNim: selectedThesis.studentNim,
      studentName: selectedThesis.studentName,
      prodi: selectedThesis.prodi,
      thesisTitle: selectedThesis.title,
      examiner1,
      examiner2,
      date,
      time,
      location: location.trim(),
      status: "Terjadwal",
      published: false,
    };

    try {
      const savedSchedule = await createSchedule(schedule);

      setSchedules((previous) => [...previous, savedSchedule]);
      setSuccess("Jadwal berhasil disimpan. Publikasikan agar dapat dilihat mahasiswa dan dosen.");

      setExaminer1("");
      setExaminer2("");
      setDate("");
      setTime("");
      setLocation("");
    } catch (err) {
      setError(err.message || "Gagal menyimpan jadwal.");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish(id) {
    setPublishingId(id);
    setError("");
    setSuccess("");

    try {
      const updatedSchedule = await publishSchedule(id);

      setSchedules((previous) =>
        previous.map((schedule) =>
          schedule.id === id ? updatedSchedule : schedule
        )
      );

      setSuccess("Jadwal berhasil dipublikasikan.");
    } catch (err) {
      setError(err.message || "Gagal memublikasikan jadwal.");
    } finally {
      setPublishingId(null);
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">
          Penjadwalan Defense
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Analisis topik skripsi dan rekomendasi dosen penguji menggunakan AI.
        </p>
      </div>

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          1. Pilih Mahasiswa
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Daftar ini hanya menampilkan kandidat dengan status Ready for Defense.
        </p>

        <div className="mt-4 flex flex-col gap-3 sm:flex-row">
          <select
            value={selectedThesisId}
            onChange={(event) => {
              setSelectedThesisId(event.target.value);
              setAnalysis(null);
              setRecommendations([]);
              setError("");
              setSuccess("");
            }}
            className="min-h-11 flex-1 rounded-lg border border-slate-300 px-3 text-sm outline-none focus:border-indigo-500"
          >
            <option value="">Pilih mahasiswa</option>
            {candidates.map((thesis) => (
              <option key={thesis.id} value={thesis.id}>
                {thesis.studentName} — {thesis.studentNim}
              </option>
            ))}
          </select>

          <button
            onClick={handleAnalyze}
            disabled={!selectedThesis || loading}
            className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Menganalisis..." : "Analisis dengan AI"}
          </button>
        </div>

        {selectedThesis && (
          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
              Judul Skripsi
            </p>
            <p className="mt-1 font-semibold text-slate-800">
              {selectedThesis.title}
            </p>
            <p className="mt-3 text-sm text-slate-600">
              {selectedThesis.abstract}
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedThesis.keywords.map((keyword) => (
                <span
                  key={keyword}
                  className="rounded-full bg-indigo-100 px-3 py-1 text-xs text-indigo-700"
                >
                  {keyword}
                </span>
              ))}
            </div>
          </div>
        )}

        {candidates.length === 0 && (
          <p className="mt-4 text-sm text-amber-700">
            Belum ada mahasiswa dengan status Ready for Defense.
          </p>
        )}
      </section>

      {analysis && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            2. Hasil Analisis Gemini
          </h2>

          <div className="mt-4 grid gap-5 md:grid-cols-2">
            <div>
              <p className="text-sm font-medium text-slate-500">
                Kategori Penelitian
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.categories?.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-indigo-50 px-3 py-1.5 text-sm text-indigo-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <p className="text-sm font-medium text-slate-500">
                Keahlian Relevan
              </p>
              <div className="mt-2 flex flex-wrap gap-2">
                {analysis.relevantExpertise?.map((item) => (
                  <span
                    key={item}
                    className="rounded-full bg-emerald-50 px-3 py-1.5 text-sm text-emerald-700"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-5 rounded-lg bg-slate-50 p-4">
            <p className="text-sm font-medium text-slate-700">
              Alasan Klasifikasi
            </p>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {analysis.reasoning}
            </p>
          </div>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            3. Rekomendasi Dosen Penguji
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Peringkat dihitung berdasarkan kecocokan keahlian dan topik penelitian.
          </p>

          <div className="mt-4 space-y-3">
            {recommendations.map((lecturer, index) => (
              <div
                key={lecturer.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-900">
                      {index + 1}. {lecturer.name}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {lecturer.prodi} · NIDN {lecturer.nidn}
                    </p>
                  </div>
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-sm font-semibold text-indigo-700">
                    Skor: {lecturer.score}
                  </span>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-500">
                    Keahlian yang cocok
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {lecturer.matchedExpertise.length
                      ? lecturer.matchedExpertise.join(", ")
                      : "Tidak ada kecocokan keahlian langsung"}
                  </p>
                </div>

                <div className="mt-3">
                  <p className="text-xs font-medium text-slate-500">
                    Penelitian yang cocok
                  </p>
                  <p className="mt-1 text-sm text-slate-700">
                    {lecturer.matchedResearch.length
                      ? lecturer.matchedResearch.join(", ")
                      : "Tidak ada kecocokan kata pada judul penelitian"}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <p className="mt-4 text-xs leading-5 text-slate-500">
            Skor merupakan hasil pencocokan berbasis aturan, bukan persentase
            kelayakan. Admin tetap harus memeriksa ketersediaan dan persyaratan
            dosen sebelum menetapkan penguji.
          </p>
        </section>
      )}

      {recommendations.length > 0 && (
        <section className="rounded-xl border border-slate-200 bg-white p-6">
          <h2 className="text-lg font-semibold text-slate-900">
            4. Atur Jadwal Defense
          </h2>

          <form onSubmit={handleSaveSchedule} className="mt-4 space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Dosen Penguji 1
                </label>
                <select
                  value={examiner1}
                  onChange={(event) => setExaminer1(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
                  required
                >
                  <option value="">Pilih dosen</option>
                  {recommendations.map((lecturer) => (
                    <option key={lecturer.id} value={lecturer.name}>
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Dosen Penguji 2
                </label>
                <select
                  value={examiner2}
                  onChange={(event) => setExaminer2(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
                  required
                >
                  <option value="">Pilih dosen</option>
                  {recommendations.map((lecturer) => (
                    <option
                      key={lecturer.id}
                      value={lecturer.name}
                      disabled={lecturer.name === examiner1}
                    >
                      {lecturer.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Tanggal
                </label>
                <input
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
                  required
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Waktu
                </label>
                <input
                  type="time"
                  value={time}
                  onChange={(event) => setTime(event.target.value)}
                  className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Lokasi
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(event) => setLocation(event.target.value)}
                  placeholder="Contoh: Ruang Sidang FIK"
                  className="min-h-11 w-full rounded-lg border border-slate-300 px-3 text-sm"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={saving}
              className="rounded-lg bg-indigo-600 px-5 py-3 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
            >
              {saving ? "Menyimpan..." : "Simpan Jadwal"}
            </button>
          </form>
        </section>
      )}

      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-700">
          {success}
        </div>
      )}

      <section className="rounded-xl border border-slate-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-slate-900">
          5. Jadwal Tersimpan
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Data diambil langsung dari JSON Server.
        </p>

        {schedules.length === 0 ? (
          <p className="mt-4 text-sm text-slate-500">
            Belum ada jadwal tersimpan.
          </p>
        ) : (
          <div className="mt-4 space-y-3">
            {schedules.map((schedule) => (
              <div
                key={schedule.id}
                className="rounded-lg border border-slate-200 p-4"
              >
                <p className="font-semibold text-slate-900">
                  {schedule.studentName}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {schedule.thesisTitle}
                </p>
                <p className="mt-2 text-sm text-slate-600">
                  Penguji: {schedule.examiner1} dan {schedule.examiner2}
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {schedule.date} · {schedule.time} · {schedule.location}
                </p>

{!schedule.published ? (
  <div>
    <span className="mt-2 inline-block rounded-full bg-amber-50 px-3 py-1 text-xs text-amber-700">
      {schedule.status}
    </span>

    <button
      type="button"
      onClick={() => handlePublish(schedule.id)}
      disabled={publishingId === schedule.id}
      className="mt-3 block rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-50"
    >
      {publishingId === schedule.id
        ? "Memublikasikan..."
        : "Publikasikan Jadwal"}
    </button>
  </div>
) : (
  <span className="mt-2 inline-block rounded-full bg-emerald-50 px-3 py-1 text-xs text-emerald-700">
    Jadwal sudah dipublikasikan
  </span>
)}


              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
