import type { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { LoginPage } from "../pages/LoginPage";

interface ProtectedRouteProps {
    children: ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <main>
                <p>Cargando sesión...</p>
            </main>
        );
    }

    if (!user) {
        return <LoginPage />;
    }

    return <>{children}</>;
}