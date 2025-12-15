"use client";
import { useState } from "react";

export default function Home() {
  const [email, setEmail] = useState("superadmin@eyebek.com");
  const [password, setPassword] = useState("SuperAdmin123!");
  const [token, setToken] = useState<string | null>(null);
  const [company, setCompany] = useState<any>(null);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("http://localhost:5000/companies/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");
      setToken(data.token);
      setCompany(data.company);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50 text-black">
      <h1 className="text-4xl font-bold mb-8 text-blue-900">Eyebek</h1>

      {!token ? (
        <form onSubmit={handleLogin} className="flex flex-col gap-4 w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-2">Company Login</h2>
          <p className="text-sm text-gray-500 mb-4">Default: superadmin@eyebek.com / SuperAdmin123!</p>

          <input
            type="email"
            placeholder="Email"
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="border p-3 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" className="bg-blue-600 text-white font-bold p-3 rounded hover:bg-blue-700 transition">
            Login
          </button>

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
          )}
        </form>
      ) : (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl animate-fade-in-up">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-green-600">Welcome Back!</h2>
            <span className="bg-green-100 text-green-800 text-xs font-medium mr-2 px-2.5 py-0.5 rounded border border-green-400">
              Connected
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 bg-gray-50 rounded border">
              <h3 className="font-bold text-gray-700">Company Details</h3>
              <p><span className="font-semibold">Name:</span> {company?.name}</p>
              <p><span className="font-semibold">Email:</span> {company?.email}</p>
              <p><span className="font-semibold">Phone:</span> {company?.phone}</p>
              <p><span className="font-semibold">Status:</span> {company?.status === 1 ? 'Activo' : company?.status}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded border overflow-hidden">
              <h3 className="font-bold text-gray-700 mb-2">Session Token</h3>
              <p className="text-xs text-gray-500 break-all bg-gray-100 p-2 rounded h-24 overflow-y-auto">
                {token}
              </p>
            </div>
          </div>

          <button
            onClick={() => { setToken(null); setCompany(null); }}
            className="w-full bg-gray-200 text-gray-700 font-semibold p-3 rounded hover:bg-gray-300 transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
