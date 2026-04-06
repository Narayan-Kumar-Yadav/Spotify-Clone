"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthProvider";

export default function LoginPage() {
  const router = useRouter();
  const { isLoading, signInAsGuest, signInWithGoogle, user } = useAuth();

  const [errorMessage, setErrorMessage] = useState("");
  const [guestName, setGuestName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace("/home");
    }
  }, [isLoading, router, user]);

  async function handleSignIn() {
    setErrorMessage("");
    setIsSubmitting(true);

    try {
      await signInWithGoogle();
      router.replace("/home");
    } catch {
      setErrorMessage("Google sign-in was cancelled or could not be completed.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function handleGuestSignIn() {
    const trimmedName = guestName.trim();

    if (!trimmedName) {
      setErrorMessage("Enter your name to continue as a guest.");
      return;
    }

    setErrorMessage("");
    signInAsGuest(trimmedName);
    router.replace("/home");
  }

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-12">
      <section className="bg-surface/90 shadow-panel w-full max-w-md rounded-xl p-8 ring-1 ring-white/6 backdrop-blur-sm sm:p-10">
        <p className="text-caption text-accent">Spotify Clone</p>
        <h1 className="text-heading mt-4">Welcome back</h1>
        <p className="text-textSecondary mt-3 text-sm leading-6">
          Sign in with your Google account to access your player, library, and discovery surfaces.
        </p>

        <div className="mt-8">
          <Button
            className="w-full justify-center"
            disabled={isLoading || isSubmitting}
            onClick={handleSignIn}
          >
            Continue with Google
          </Button>
        </div>

        <div className="mt-5 space-y-3">
          <input
            className="bg-surface border-white/10 text-textPrimary placeholder:text-textSecondary focus:ring-accent/40 w-full rounded-xl border px-4 py-3 outline-none ring-0 focus:border-transparent focus:ring-2"
            onChange={(event) => {
              setGuestName(event.target.value);
            }}
            placeholder="Enter your name"
            type="text"
            value={guestName}
          />
          <button
            className="text-background w-full rounded-full bg-white py-3 text-sm font-semibold transition hover:brightness-95"
            onClick={handleGuestSignIn}
            type="button"
          >
            Continue as Guest
          </button>
        </div>

        {errorMessage ? <p className="text-textSecondary mt-4 text-sm">{errorMessage}</p> : null}
      </section>
    </main>
  );
}
