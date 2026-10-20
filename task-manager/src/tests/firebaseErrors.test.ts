import { describe, expect, it } from "vitest";
import { getFirebaseAuthErrorMessage } from "../utils/firebaseErrors";

describe("getFirebaseAuthErrorMessage", () => {
    it("retorna mensaje para email ya registrado", () => {
        const error = new Error(
            "Firebase: Error (auth/email-already-in-use)."
        );

        expect(getFirebaseAuthErrorMessage(error)).toBe(
            "Este correo ya está registrado."
        );
    });

    it("retorna mensaje para email inválido", () => {
        const error = new Error(
            "Firebase: Error (auth/invalid-email)."
        );

        expect(getFirebaseAuthErrorMessage(error)).toBe(
            "El correo electrónico no es válido."
        );
    });

    it("retorna mensaje genérico para errores desconocidos", () => {
        const error = new Error("error-desconocido");

        expect(getFirebaseAuthErrorMessage(error)).toBe(
            "No se pudo completar la operación."
        );
    });

    it("retorna mensaje inesperado cuando no recibe un Error", () => {
        expect(getFirebaseAuthErrorMessage("texto")).toBe(
            "Ocurrió un error inesperado."
        );
    });
});