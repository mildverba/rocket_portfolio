"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Rocket, ShieldCheck, AlertCircle, Loader2 } from "lucide-react";

export default function LoginPage() {
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
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        // Successful login
        router.push("/");
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Invalid password. Please try again.");
      }
    } catch (err) {
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black overflow-hidden relative">
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[130px] animate-pulse delay-700" />
      </div>

      <div className="w-full max-w-md relative z-10 transition-all duration-700 ease-out animate-in fade-in zoom-in-95">
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 to-blue-500 p-[2px] mb-6 shadow-[0_0_40px_-5px_rgba(147,51,234,0.3)] group">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center transition-transform duration-500 group-hover:scale-105">
              <Rocket className="text-white w-10 h-10 -rotate-45" />
            </div>
          </div>
          <h1 className="text-4xl font-extrabold text-white tracking-tighter mb-2">Rocket <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-blue-400">Portfolio</span></h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">Private Intelligence Gate</p>
        </div>

        <div className="bg-slate-900/40 backdrop-blur-3xl border border-slate-800/50 rounded-[2.5rem] p-10 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Form Header */}
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-purple-500/10 p-2.5 rounded-xl">
              <ShieldCheck className="w-6 h-6 text-purple-400" />
            </div>
            <div>
              <h2 className="text-lg font-black text-white tracking-tight">Authenticated View</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest leading-none">Enter your secret key</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="block w-full pl-12 pr-4 py-4 bg-slate-950/50 border border-slate-800 text-white placeholder:text-slate-600 text-sm rounded-2xl outline-none focus:border-purple-500/50 focus:ring-4 focus:ring-purple-500/10 transition-all duration-300"
                  placeholder="Secret Access Password"
                />
              </div>
              
              {error && (
                <div className="flex items-center gap-2 text-rose-500 text-[11px] font-black uppercase tracking-wider pl-1 py-1 animate-in slide-in-from-top-1">
                  <AlertCircle size={14} />
                  <span>{error}</span>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-black rounded-2xl shadow-xl shadow-purple-500/20 hover:shadow-purple-500/40 hover:scale-[1.02] active:scale-95 transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed uppercase tracking-widest text-xs"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  Unlock Access
                  <Rocket className="w-4 h-4 text-white/70 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform -rotate-45" />
                </>
              )}
            </button>
          </form>

          <div className="mt-10 pt-8 border-t border-slate-800/50 text-center">
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.1em]">
              Authorized Use Only &bull; Secure Protocol 
            </p>
          </div>
        </div>
        
        <p className="text-center mt-10 text-slate-600 text-[10px] font-bold uppercase tracking-widest px-10">
          This portfolio is protected by high-level encryption to ensure financial privacy. Session duration: 5 Days.
        </p>
      </div>
    </div>
  );
}
