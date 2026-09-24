import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut,
    signInWithPopup,
    GoogleAuthProvider,
} from "firebase/auth";

import { auth } from "../../services/firebase";

export const registerUser = async (email: string, password: string) => {
    const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
    );

    return userCredential.user;
};

export const loginUser = async (email: string, password: string) => {
    const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
    );

    return userCredential.user;
};

export const logoutUser = async () => {
    await signOut(auth);
};

export const signInWithGoogle = async () => {
    const provider = new GoogleAuthProvider();

    const userCredential = await signInWithPopup(
        auth,
        provider
    );

    return userCredential.user;
};