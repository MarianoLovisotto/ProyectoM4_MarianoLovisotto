export const getFirebaseAuthErrorMessage = (error: unknown) => {
    if (!(error instanceof Error)) {
        return "Ocurrió un error inesperado.";
    }

    if (error.message.includes("auth/email-already-in-use")) {
        return "Este correo ya está registrado.";
    }

    if (error.message.includes("auth/invalid-email")) {
        return "El correo electrónico no es válido.";
    }

    if (error.message.includes("auth/weak-password")) {
        return "La contraseña debe tener al menos 6 caracteres.";
    }

    if (error.message.includes("auth/invalid-credential")) {
        return "Correo o contraseña incorrectos.";
    }

    if (error.message.includes("auth/too-many-requests")) {
        return "Demasiados intentos. Intentá nuevamente más tarde.";
    }

    return "No se pudo completar la operación.";
};