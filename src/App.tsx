import { useState } from "react";


type Page = "login" | "register";


function App() {
  const [page, setPage] = useState<Page>("login");
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <main>
        <p>Cargando sesión...</p>
      </main>
    )
  }

  if (user) {
    return (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    );
  }

  return (
    <main className="auth-layout">
      <section className="auth-card">
        <div className="auth-header">
          <h1>Task Manager</h1>
          <p>Organizá tus pendientes de forma simple y segura.</p>
        </div>
        {page === "login" ? <LoginPage /> : <RegisterPage />}

        {page === "login" ? (
          <button
            className="link-button"
            type="button"
            onClick={() => setPage("register")}>Crear cuenta</button>
        ) : (
          <button
            className="link-button"
            type="button"
            onClick={() => setPage("login")}>Ya tengo cuenta</button>
        )}
      </section>
    </main>
  )
}