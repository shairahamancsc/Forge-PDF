
"use server";

import { createClient } from "@/utils/supabase/server"; // Use server client for server actions
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function getCurrentUser() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  try {
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

export async function signInWithEmail(credentials: { email: string, password: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    console.error("Supabase sign-in error:", error);
    return { success: false, message: error.message || "Invalid credentials" };
  }
  return { success: true, message: "Signed in successfully" };
}

export async function signUpWithEmail(credentials: { fullName: string, email: string, password: string }) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      data: {
        full_name: credentials.fullName,
      },
      // Optional: emailRedirectTo for email confirmation
      // emailRedirectTo: `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback`,
    },
  });

  if (error) {
    console.error("Supabase sign-up error:", error);
    return { success: false, message: error.message || "Failed to create account." };
  }
  if (data.user && data.user.identities && data.user.identities.length === 0) {
     return { success: false, message: "User already exists but is unconfirmed. Please check your email to confirm your account or try resetting your password." };
  }
  // If email confirmation is required, user will not be signed in immediately.
  const message = data.session ? "Account created and signed in." : "Account created. Please check your email to confirm your account.";
  return { success: true, message };
}

export async function signInWithGoogle() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  
  const redirectTo = process.env.NEXT_PUBLIC_BASE_URL ? `${process.env.NEXT_PUBLIC_BASE_URL}/auth/callback` : '/auth/callback';

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
    },
  });

  if (error) {
    console.error("Supabase Google sign-in error:", error);
    return { success: false, message: error.message || "Google Sign-In failed." };
  }

  if (data.url) {
    // Redirect to Supabase OAuth URL
    redirect(data.url);
    // Note: redirect() throws an error to stop further execution, so this return is for type consistency if redirect doesn't happen.
    // In practice, the execution stops at redirect().
    return { success: true, message: "Redirecting to Google..."}
  }
  return { success: false, message: "Could not get Google OAuth URL." };
}

export async function signOut() {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  const { error } = await supabase.auth.signOut();

  if (error) {
    console.error("Supabase sign-out error:", error);
    return { success: false, message: error.message || "Sign out failed." };
  }
  return { success: true, message: "Signed out successfully" };
}

export async function sendPasswordResetEmail(email: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);
  // Optional: specify redirectTo for the password reset link
  // const redirectTo = `${process.env.NEXT_PUBLIC_BASE_URL}/auth/reset-password`;
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    // redirectTo,
  });

  if (error) {
    console.error("Supabase password reset error:", error);
    return { success: false, message: error.message || "Failed to send password reset email." };
  }
  return { success: true, message: "Password reset email sent. Please check your inbox." };
}

export async function updateUserFullName(userId: string, fullName: string) {
  const cookieStore = cookies();
  const supabase = createClient(cookieStore);

  const { data, error } = await supabase.auth.updateUser({
    data: { full_name: fullName }
  });

  if (error) {
    console.error("Supabase update user full name error:", error);
    return { success: false, message: error.message || "Failed to update full name." };
  }
  return { success: true, message: "Full name updated successfully.", user: data.user };
}
