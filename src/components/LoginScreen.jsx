import { useState } from "react";
export default function LoginForm({ onLogin, loading, error }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin(username, password);
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-3xl shadow-xl p-8">
      <h2 className="text-2xl font-bold text-center mb-8">Login Akun Athena</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className="w-full p-4 border border-gray-200 rounded-2xl mb-4 focus:outline-none focus:border-blue-500"
          placeholder="Username / NIM"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />

        <input
          type="password"
          className="w-full p-4 border border-gray-200 rounded-2xl mb-6 focus:outline-none focus:border-blue-500"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-4 rounded-2xl text-lg transition-all"
        >
          {loading ? "Sedang Login..." : "Login"}
        </button>
      </form>

      {error && <p className="text-red-600 text-center mt-4">{error}</p>}
    </div>
  );
}
