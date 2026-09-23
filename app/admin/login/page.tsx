"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, ArrowRight, ShieldCheck, Home } from "lucide-react";

export default function AdminLoginPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin PIN for Mr. Son & developer
    if (password === "nsbuilding2026" || password === "admin123") {
      if (typeof window !== "undefined") {
        localStorage.setItem("ns_admin_auth", "true");
      }
      router.push("/admin");
    } else {
      setError("Mật khẩu không đúng. Vui lòng thử lại!");
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col justify-center items-center px-4 py-12">
      <div className="w-full max-w-md bg-slate-800/90 border border-slate-700 rounded-3xl p-8 sm:p-10 shadow-2xl backdrop-blur-xl">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 bg-primary text-bronze rounded-2xl flex items-center justify-center font-black text-2xl border border-bronze/40 mb-4 shadow-lg">
            NS
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Hệ Thống Quản Trị CMS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            NS Building NZ &bull; Cập nhật dự án &amp; bài viết
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3.5 bg-red-500/10 border border-red-500/30 rounded-xl text-xs text-red-400 text-center font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-bronze" />
              <span>Mật khẩu quản trị (Admin PIN)</span>
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Nhập mật khẩu..."
              className="w-full px-4 py-3.5 bg-slate-900/80 border border-slate-700 rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:border-bronze transition-colors"
            />
            <span className="block text-[11px] text-slate-500 mt-1.5">
              Mật khẩu mặc định: <code className="text-bronze font-mono">nsbuilding2026</code>
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-4 rounded-xl bg-bronze hover:bg-bronze-dark text-white font-bold text-sm uppercase tracking-wider shadow-lg transition-all flex items-center justify-center gap-2"
          >
            <span>Đăng Nhập Quản Trị</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
          <Link
            href="/en"
            className="hover:text-white transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5 text-bronze" />
            <span>Về Trang Chủ</span>
          </Link>
          <span className="flex items-center gap-1 text-[11px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            Bảo mật SSL 256-bit
          </span>
        </div>
      </div>
    </div>
  );
}
