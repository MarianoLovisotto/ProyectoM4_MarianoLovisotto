import { useState } from "react";
import { loginUser } from ".."
import { getFirebaseAuthErrorMessage } from

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
            setErrorMessage(getFirebaseAuthErrorMessage)
        } finally {
            setIsSubmitting(false)
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
                    onChange={(event => setPassword(event.target.value))}
                />

                {errorMessage && <p>{errorMessage}</p>}

                <button className="btn-primary" type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Ingresando..." : "Entrar"}
                </button>

            </form>
        </section>
    )
}