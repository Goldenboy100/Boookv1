import { Link, NavLink, useNavigate } from "react-router-dom";
import type { ReactNode } from "react";
import { useAuth } from "../lib/auth";
import { BookOpen, Library, LayoutDashboard, LogOut, Feather, ScrollText } from "lucide-react";

export default function Shell({ children }: { children: ReactNode }) {
  const { user, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const doLogout = () => {
    logout();
    navigate("/login");
  };

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 rounded-md px-3 py-2 text-sm transition-colors ${
      isActive ? "bg-ink-800 text-brass-300" : "text-ink-300 hover:bg-ink-850 hover:text-ink-100"
    }`;

  return (
    <div className="relative min-h-full">
      <header className="no-print sticky top-0 z-40 border-b border-ink-700 bg-ink-900/85 backdrop-blur">
        <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-5 py-3">
          <Link to="/" className="flex items-center gap-3">
            <span className="grid h-9 w-9 place-items-center rounded-lg border border-brass-600 bg-gradient-to-b from-brass-400 to-brass-700 text-ink-950">
              <BookOpen size={18} strokeWidth={2.2} />
            </span>
            <span className="leading-tight">
              <span className="display block text-[15px] font-semibold tracking-tight text-paper-100">Quire</span>
              <span className="label block text-[9px]">Book Studio</span>
            </span>
          </Link>

          <nav className="ml-4 flex items-center gap-1">
            <NavLink to="/" end className={linkClass}>
              <Library size={15} /> Library
            </NavLink>
            <NavLink to="/anatomy" className={linkClass}>
              <ScrollText size={15} /> <span className="hidden md:inline">Anatomy of a book</span>
            </NavLink>
            {isAdmin && (
              <NavLink to="/dashboard" className={linkClass}>
                <LayoutDashboard size={15} /> Dashboard
              </NavLink>
            )}
          </nav>

          <div className="ml-auto flex items-center gap-3">
            {user ? (
              <>
                <span className="hidden items-center gap-2 sm:flex">
                  <span className="grid h-8 w-8 place-items-center rounded-full border border-ink-600 bg-ink-800 text-brass-300">
                    <Feather size={15} />
                  </span>
                  <span className="leading-tight">
                    <span className="block text-[13px] font-medium text-ink-100">{user.username}</span>
                    <span className="label block text-[9px]">{isAdmin ? "Admin" : "Reader"}</span>
                  </span>
                </span>
                <button className="btn btn-ghost" onClick={doLogout} title="Sign out">
                  <LogOut size={15} /> <span className="hidden sm:inline">Sign out</span>
                </button>
              </>
            ) : (
              <Link to="/login" className="btn btn-primary">Sign in</Link>
            )}
          </div>
        </div>
      </header>
      <main className="relative z-10">{children}</main>
    </div>
  );
}
