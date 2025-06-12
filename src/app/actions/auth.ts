
"use server";

import { auth } from "@/lib/firebase";
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup, 
  signOut as firebaseSignOut,
  sendPasswordResetEmail as firebaseSendPasswordResetEmail,
  updateProfile // To set display name after sign up
} from "firebase/auth";

export async function signInWithEmail(credentials: { email: string, password: string }) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, credentials.email, credentials.password);
    return { success: true, message: "Signed in successfully", userId: userCredential.user.uid };
  } catch (error: any) {
    console.error("Firebase sign-in error:", error);
    return { success: false, message: error.message || "Invalid credentials" };
  }
}

export async function signUpWithEmail(credentials: { fullName: string, email: string, password: string }) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, credentials.email, credentials.password);
    // Set the user's display name
    if (auth.currentUser) {
      await updateProfile(auth.currentUser, {
        displayName: credentials.fullName,
      });
    }
    // You might want to send a verification email here in a real app
    // await sendEmailVerification(userCredential.user);
    return { success: true, message: "Account created successfully. You are now signed in.", userId: userCredential.user.uid };
  } catch (error: any) {
    console.error("Firebase sign-up error:", error);
    return { success: false, message: error.message || "Failed to create account." };
  }
}

export async function signInWithGoogle() {
  const provider = new GoogleAuthProvider();
  try {
    const result = await signInWithPopup(auth, provider);
    // const credential = GoogleAuthProvider.credentialFromResult(result);
    // const token = credential?.accessToken; // If you need the token
    const user = result.user;
    return { success: true, message: "Signed in with Google successfully", userId: user.uid, email: user.email, name: user.displayName };
  } catch (error: any) {
    console.error("Firebase Google sign-in error:", error);
    // Handle specific errors like popup closed by user, etc.
    // const errorCode = error.code;
    // const errorMessage = error.message;
    // const email = error.customData?.email;
    // const credential = GoogleAuthProvider.credentialFromError(error);
    return { success: false, message: error.message || "Google Sign-In failed." };
  }
}

export async function signOut() {
  try {
    await firebaseSignOut(auth);
    return { success: true, message: "Signed out successfully" };
  } catch (error: any) {
    console.error("Firebase sign-out error:", error);
    return { success: false, message: error.message || "Sign out failed." };
  }
}

export async function sendPasswordResetEmail(email: string) {
  try {
    await firebaseSendPasswordResetEmail(auth, email);
    return { success: true, message: "Password reset email sent. Please check your inbox." };
  } catch (error: any) {
    console.error("Firebase password reset error:", error);
    return { success: false, message: error.message || "Failed to send password reset email." };
  }
}
