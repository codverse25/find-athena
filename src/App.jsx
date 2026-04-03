import { useState, useMemo, useEffect } from "react";
import LoginForm from "./components/LoginScreen.jsx";
import Dashboard from "./components/Dashboard.jsx";

const BASE = "/api";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(
    localStorage.getItem("athena_token") || "",
  );
  const [dosen, setDosen] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [lastUpdated, setLastUpdated] = useState(null);

  // Cek apakah sudah login saat halaman dimuat
  useEffect(() => {
    const savedToken = localStorage.getItem("athena_token");
    const savedUser = localStorage.getItem("athena_user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
      setIsLoggedIn(true);
      fetchDosen(savedToken);
    }
  }, []);

  const handleLogin = async (username, password) => {
    if (!username || !password) {
      setError("Username dan password wajib diisi");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const json = await res.json();

      if (!res.ok) throw new Error(json.message || "Login gagal");

      const newToken = json.token;
      const userData = json.user;

      if (!newToken || !userData) throw new Error("Data login tidak lengkap");

      localStorage.setItem("athena_token", newToken);
      localStorage.setItem("athena_user", JSON.stringify(userData));

      setToken(newToken);
      setUser(userData);
      setIsLoggedIn(true);
      setError("");

      fetchDosen(newToken);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchDosen = async (currentToken = token) => {
    if (!currentToken) return;

    setLoading(true);
    setError("");

    try {
      const res = await fetch(
        `${BASE}/lecturers/recommended?mata_kuliah_id=1&prodi=52`,
        {
          headers: { Authorization: `Bearer ${currentToken}` },
        },
      );

      if (!res.ok) throw new Error("Token tidak valid atau expired");

      const json = await res.json();
      const data = Array.isArray(json) ? json : json.data || [];

      setDosen(data);
      setLastUpdated(new Date());
    } catch (e) {
      setError(e.message);
      if (
        e.message.toLowerCase().includes("token") ||
        e.message.includes("401")
      ) {
        handleLogout();
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("athena_token");
    localStorage.removeItem("athena_user");
    setToken("");
    setUser(null);
    setIsLoggedIn(false);
    setDosen([]);
    setSearch("");
  };

  const filtered = useMemo(() => {
    return dosen.filter((d) =>
      d.name?.toLowerCase().includes(search.toLowerCase()),
    );
  }, [dosen, search]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold text-gray-800">
            🎓 Athena Dosen Finder
          </h1>
          <p className="text-gray-600 mt-2">
            Rekomendasi Dosen Pembimbing • Informatika
          </p>
        </div>

        {!isLoggedIn ? (
          <LoginForm onLogin={handleLogin} loading={loading} error={error} />
        ) : (
          <Dashboard
            user={user}
            dosen={dosen}
            filtered={filtered}
            search={search}
            setSearch={setSearch}
            lastUpdated={lastUpdated}
            loading={loading}
            onRefresh={fetchDosen}
            onLogout={handleLogout}
          />
        )}
      </div>
    </div>
  );
}
