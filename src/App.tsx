import { Navigate, Route, Routes } from "react-router-dom";
import type { ReactNode } from "react";
import { AuthProvider, useAuth } from "./lib/auth";
import { BooksProvider } from "./lib/books";
import Shell from "./components/Shell";
import Login from "./pages/Login";
import Library from "./pages/Library";
import Anatomy from "./pages/Anatomy";
import Dashboard from "./pages/Dashboard";
import Editor from "./pages/Editor";
import Reader from "./pages/Reader";
import PrintView from "./pages/PrintView";

function RequireAuth({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function ShellPage({ children }: { children: ReactNode }) {
  return (
    <Shell>
      {children}
    </Shell>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BooksProvider>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
              <RequireAuth>
                <ShellPage><Library /></ShellPage>
              </RequireAuth>
            }
          />
          <Route
            path="/anatomy"
            element={
              <RequireAuth>
                <ShellPage><Anatomy /></ShellPage>
              </RequireAuth>
            }
          />
          <Route
            path="/dashboard"
            element={
              <RequireAuth>
                <ShellPage><Dashboard /></ShellPage>
              </RequireAuth>
            }
          />
          <Route
            path="/book/:id"
            element={
              <RequireAuth>
                <Editor />
              </RequireAuth>
            }
          />
          <Route
            path="/read/:id"
            element={
              <RequireAuth>
                <Reader />
              </RequireAuth>
            }
          />
          <Route
            path="/print/:id"
            element={
              <RequireAuth>
                <PrintView />
              </RequireAuth>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BooksProvider>
    </AuthProvider>
  );
}
