import { useState } from "react";
import {
    loginUser,
    signInWithGoogle,
} from "../features/auth/auth.service";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseErrors";

export function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setErrorMessage("");
        setIsSubmitting(true);

        try {
            await loginUser(email, password);
        } catch (error) {
            setErrorMessage(getFirebaseAuthErrorMessage(error));
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleGoogleLogin = async () => {
        setErrorMessage("");

        try {
            await signInWithGoogle();
        } catch (error) {
            setErrorMessage(getFirebaseAuthErrorMessage(error));
        }
    };

    return (
        <section className="auth-form-section">
            <h1>Iniciar sesión</h1>

            <form onSubmit={handleSubmit}>
                <input
                    className="input"
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(event) => setEmail(event.target.value)}
                    required
                />

                <input
                    className="input"
                    type="password"
                    placeholder="Contraseña"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                    required
                />

                {errorMessage && <p>{errorMessage}</p>}

                <button className="btn-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Ingresando..." : "Entrar"}
                </button>

                <div className="auth-divider">
                    <span>o</span>
                </div>

                <button
                    className="btn-secondary"
                    type="button"
                    onClick={handleGoogleLogin}
                >
                    Continuar con Google
                </button>
            </form>
        </section>
    );
}