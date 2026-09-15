import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Role, User } from "./types";

const SESSION_KEY = "quire.session.v1";
const ADMIN_USER = "faraj";
const ADMIN_PASS = "faraj";

interface AuthValue {
  user: User | null;
  login: (username: string, password: string) => { ok: boolean; error?: string; role?: Role };
  loginAsReader: (name: string) => void;
  logout: () => void;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as User) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    try {
      if (user) localStorage.setItem(SESSION_KEY, JSON.stringify(user));
      else localStorage.removeItem(SESSION_KEY);
    } catch {
      /* ignore */
    }
  }, [user]);

  const login = useCallback((username: string, password: string) => {
    const u = username.trim();
    const p = password.trim();
    if (!u || !p) return { ok: false, error: "Enter a username and password." };
    if (u.toLowerCase() === ADMIN_USER && p === ADMIN_PASS) {
      setUser({ username: ADMIN_USER, role: "admin" });
      return { ok: true, role: "admin" as Role };
    }
    // Any other credentials sign in as a reader (read-only).
    setUser({ username: u, role: "reader" });
    return { ok: true, role: "reader" as Role };
  }, []);

  const loginAsReader = useCallback((name: string) => {
    setUser({ username: name.trim() || "Reader", role: "reader" });
  }, []);

  const logout = useCallback(() => setUser(null), []);

  const value = useMemo<AuthValue>(
    () => ({ user, login, loginAsReader, logout, isAdmin: user?.role === "admin" }),
    [user, login, loginAsReader, logout],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
