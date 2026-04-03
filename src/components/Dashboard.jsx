import DosenCard from "./DosenCard.jsx";
export default function Dashboard({
  user,
  filtered,
  search,
  setSearch,
  lastUpdated,
  loading,
  onRefresh,
  onLogout,
}) {
  return (
    <div className="bg-white rounded-3xl shadow-xl p-8">
      {/* User Info */}
      <div className="flex items-center justify-between mb-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          {user?.thumbnail ? (
            <img
              src={user.thumbnail}
              alt={user.name}
              className="w-12 h-12 rounded-2xl object-cover border"
            />
          ) : (
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-600">
              {user?.name?.slice(0, 2).toUpperCase() || "???"}
            </div>
          )}

          <div>
            <p className="font-semibold text-lg">{user?.name}</p>
            <p className="text-sm text-gray-500">
              {user?.external_id} • {user?.prodi?.name}{" "}
              {user?.fakultas?.name && `• ${user.fakultas.name}`}
            </p>
            <p className="text-xs text-emerald-600 font-medium">
              ✓ Sedang Login
            </p>
          </div>
        </div>

        <button
          onClick={onLogout}
          className="text-red-600 hover:underline text-sm"
        >
          Logout
        </button>
      </div>

      {/* Header Dashboard */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold">
            Dosen Pembimbing Tersedia {filtered.length}
          </h2>
          <p className="text-sm text-gray-500">
            Terakhir diperbarui:{" "}
            {lastUpdated ? lastUpdated.toLocaleTimeString("id-ID") : "-"}
          </p>
        </div>

        <button
          onClick={() => onRefresh()}
          disabled={loading}
          className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-medium transition-all disabled:bg-gray-400"
        >
          {loading ? "⟳ Memuat..." : "🔄 Refresh"}
        </button>
      </div>

      {/* Search */}
      <div className="mb-8">
        <input
          className="w-full px-5 py-4 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-lg"
          placeholder="🔍 Cari nama dosen..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((d) => (
            <DosenCard key={d.id} dosen={d} />
          ))}
        </div>
      ) : (
        <p className="text-center py-20 text-gray-500">
          {search
            ? "Tidak ada dosen yang sesuai"
            : "Tekan Refresh untuk memuat data"}
        </p>
      )}
    </div>
  );
}
