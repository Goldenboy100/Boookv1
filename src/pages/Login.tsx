import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth";
import { BookOpen, ShieldCheck, Eye, ArrowRight } from "lucide-react";

export default function Login() {
  const { login, loginAsReader } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = login(username, password);
    if (!res.ok) {
      setError(res.error || "Sign-in failed.");
      return;
    }
    navigate(res.role === "admin" ? "/dashboard" : "/");
  };

  const guest = () => {
    loginAsReader("Reader");
    navigate("/");
  };

  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      {/* Left: brand panel */}
      <div className="grain relative hidden overflow-hidden border-r border-ink-700 bg-ink-950 p-12 lg:flex lg:flex-col lg:justify-between">
        <div className="absolute -left-24 -top-24 h-96 w-96 rounded-full bg-brass-700/15 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-96 w-96 rounded-full bg-vermilion/10 blur-3xl" />
        <div className="relative">
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-lg border border-brass-600 bg-gradient-to-b from-brass-400 to-brass-700 text-ink-950">
              <BookOpen size={20} strokeWidth={2.2} />
            </span>
            <span className="display text-2xl font-semibold text-paper-100">Quire</span>
          </div>
        </div>
        <div className="relative max-w-md">
          <h1 className="display text-5xl font-semibold leading-[1.05] text-paper-100">
            Set your words<br />in <em className="text-brass-400">type</em>.
          </h1>
          <p className="mt-6 text-ink-300">
            A private book studio in your browser. Write in any language, design a cover,
            tune the interior, and export a finished PDF, EPUB or Markdown manuscript.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {['Any language', 'Any cover', 'Page-level type control', 'PDF · EPUB · MD'].map((t) => (
              <span key={t} className="chip">{t}</span>
            ))}
          </div>
        </div>
        <div className="relative text-sm text-ink-500">© {new Date().getFullYear()} Quire — Book Studio</div>
      </div>

      {/* Right: form */}
      <div className="flex items-center justify-center bg-ink-900 px-6 py-16">
        <div className="w-full max-w-sm">
          <div className="lg:hidden mb-8 flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-brass-600 bg-gradient-to-b from-brass-400 to-brass-700 text-ink-950">
              <BookOpen size={18} />
            </span>
            <span className="display text-xl font-semibold text-paper-100">Quire</span>
          </div>
          <h2 className="display text-2xl font-semibold text-paper-100">Sign in</h2>
          <p className="mt-1 text-sm text-ink-400">Admins write and publish. Readers browse and read.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <div>
              <label className="label mb-1.5 block">Username</label>
              <input className="field" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="faraj" autoFocus />
            </div>
            <div>
              <label className="label mb-1.5 block">Password</label>
              <input className="field" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••" />
            </div>
            {error && <div className="rounded-md border border-vermilion/40 bg-vermilion/10 px-3 py-2 text-sm text-[#f2b8ad]">{error}</div>}
            <button className="btn btn-primary w-full justify-center" type="submit">
              Sign in <ArrowRight size={15} />
            </button>
          </form>

          <div className="mt-4 flex items-center gap-3 text-xs text-ink-500">
            <div className="h-px flex-1 bg-ink-700" /> OR <div className="h-px flex-1 bg-ink-700" />
          </div>
          <button className="btn w-full justify-center" onClick={guest}>
            <Eye size={15} /> Browse as a reader
          </button>

          <div className="mt-8 rounded-lg border border-ink-700 bg-ink-850 p-4 text-xs leading-relaxed text-ink-400">
            <div className="flex items-center gap-2 text-brass-300"><ShieldCheck size={14} /> Admin access</div>
            <p className="mt-2">
              The studio ships with one admin. Sign in as <code className="font-mono text-ink-200">faraj</code> /
              <code className="font-mono text-ink-200"> faraj</code> to create, edit, publish and delete books.
              Any other credentials open a read-only shelf.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
