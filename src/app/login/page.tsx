"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, User, Rocket, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid credentials. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-hidden relative">
      
      {/* Background Orbs */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-[10%] left-[10%] w-[400px] h-[400px] bg-purple-600/15 rounded-full blur-[100px] animate-pulse" />
        <div className="absolute bottom-[10%] right-[10%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-700">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-500 p-[2px] mb-6 shadow-[0_0_50px_-5px_rgba(147,51,234,0.3)]">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center">
              <Rocket className="text-white w-10 h-10 -rotate-45" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter mb-2">Rocket <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Portfolio</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Private Intelligence Gate</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2.5rem] p-8 md:p-10 shadow-2xl overflow-hidden">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-500/10 p-2.5 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Access Required</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Enter your credentials</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-5">
            {/* Username Field */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 text-sm rounded-2xl outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                  placeholder="Username"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 text-sm rounded-2xl outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                  placeholder="Password"
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-rose-500 text-[11px] font-black uppercase tracking-wider pl-1 py-1">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.01] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Verify Access
                  <Rocket className="w-4 h-4 text-white/70 -rotate-45" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">
              Authorized Use Only &bull; Session: 5 Days
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
