import { useState } from "react";

export default function DosenCard({ dosen }) {
  const [expanded, setExpanded] = useState(false);

  const quota = dosen.availableQuota ?? 0;
  const totalMaxQuota = dosen.maxQuota ?? 0;
  const currentLoad = dosen.currentLoad ?? 0;

  const progressPercent =
    totalMaxQuota > 0
      ? Math.min(Math.round((currentLoad / totalMaxQuota) * 100), 100)
      : 0;

  return (
    <div className="dosen-card bg-white rounded-3xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 border border-gray-100">
      {/* Header dengan Foto */}
      <div className="relative h-52 bg-linear-to-br from-blue-600 to-indigo-700 flex items-end p-6">
        {dosen.thumbnail ? (
          <img
            src={dosen.thumbnail}
            alt={dosen.name}
            className="w-28 h-28 rounded-2xl object-cover border-4 border-white shadow-md absolute -bottom-12 left-6"
          />
        ) : (
          <div className="w-28 h-28 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl font-bold text-white border-4 border-white absolute -bottom-12 left-6">
            {dosen.name?.slice(0, 2).toUpperCase()}
          </div>
        )}

        <div className="ml-40 mb-2 text-white">
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-bold leading-tight pr-2">
              {dosen.name}
            </h3>
          </div>
          <p className="text-blue-100">{dosen.jabatan_fungsional || "Dosen"}</p>
        </div>
      </div>

      <div className="pt-16 pb-6 px-6 space-y-6">
        {/* SINTA Score */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="text-4xl">⭐</div>
            <div>
              <div className="text-3xl font-bold text-gray-800">
                {dosen.sinta_score}
              </div>
              <div className="text-sm text-gray-500 -mt-1">SINTA Score</div>
            </div>
          </div>

          {dosen.sinta_id && (
            <a
              href={`https://sinta.kemdiktisaintek.go.id/authors/profile/${dosen.sinta_id}`}
              target="_blank"
              className="text-xs px-4 py-2 bg-emerald-100 hover:bg-emerald-200 text-emerald-700 rounded-xl transition-colors"
            >
              Lihat Profil SINTA →
            </a>
          )}
        </div>

        {/* Bidang Keahlian */}
        {dosen.expertise && dosen.expertise.length > 0 && (
          <div>
            <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
              Bidang Keahlian
            </p>
            <div className="flex flex-wrap gap-2">
              {dosen.expertise.map((exp, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 bg-gray-100 hover:bg-gray-200 transition-colors rounded-2xl text-sm flex items-center gap-1.5"
                >
                  {exp.name}
                  <span className="text-xs text-gray-400">({exp.score}%)</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tombol Show More */}
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 text-blue-600 hover:text-blue-700 font-medium flex items-center justify-center gap-2 border border-dashed border-blue-200 hover:border-blue-300 rounded-2xl transition-all"
        >
          {expanded ? "▲ Sembunyikan Detail" : "▼ Tampilkan Selengkapnya"}
        </button>

        {/* Bagian yang muncul saat Expanded */}
        {expanded && (
          <div className="space-y-6 pt-4 border-t border-gray-100">
            {/* Kuota Keseluruhan */}
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-semibold">Kuota Pembimbing</span>
                <span className="font-bold text-emerald-600">
                  {quota} / {totalMaxQuota}
                </span>
              </div>
              <div className="h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-linear-to-r from-emerald-500 to-teal-500 transition-all"
                  style={{ width: `${100 - progressPercent}%` }}
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Sudah terpakai: <b>{currentLoad}</b> mahasiswa
              </p>
            </div>

            {/* Detail Kuota per Mata Kuliah */}
            {dosen.quotas && dosen.quotas.length > 0 && (
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-500 mb-3">
                  Detail Kuota per Mata Kuliah
                </p>
                <div className="space-y-4">
                  {dosen.quotas.map((q) => {
                    const loadPercent =
                      q.max_quota > 0
                        ? Math.round((q.current_load / q.max_quota) * 100)
                        : 0;

                    return (
                      <div key={q.id} className="bg-gray-50 rounded-2xl p-4">
                        <div className="flex justify-between mb-2 text-sm">
                          <div className="font-medium">
                            {q.mata_kuliah.nama}
                          </div>
                          <div className="text-gray-500">
                            {q.current_load} / {q.max_quota}
                          </div>
                        </div>
                        <div className="h-2 bg-gray-200 rounded-full">
                          <div
                            className="h-full bg-indigo-600 rounded-full transition-all"
                            style={{ width: `${loadPercent}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Google Scholar */}
            {dosen.google_scholar_id && (
              <a
                href={`https://scholar.google.com/citations?user=${dosen.google_scholar_id}`}
                target="_blank"
                className="inline-flex items-center gap-2 text-sm text-blue-600 hover:text-blue-700"
              >
                🔗 Lihat Google Scholar
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
