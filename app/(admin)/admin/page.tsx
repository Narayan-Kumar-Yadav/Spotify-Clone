"use client";

import { useState } from "react";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAdminAccess } from "@/features/auth/useAdminAccess";
import { createSong } from "@/lib/songs";

type FormState = {
  audioUrl: string;
  image: string;
  subtitle: string;
  title: string;
};

const initialFormState: FormState = {
  audioUrl: "",
  image: "",
  subtitle: "",
  title: "",
};

function AccessDenied() {
  return <div className="p-6 text-red-500">Access Denied</div>;
}

export default function AdminPage() {
  const { user } = useAuth();
  const { isAdmin, isChecking } = useAdminAccess();
  const [formState, setFormState] = useState<FormState>(initialFormState);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isChecking) {
    return (
      <div className="p-6">
        <p className="text-textSecondary text-sm">Checking admin access...</p>
      </div>
    );
  }

  if (!isAdmin) {
    return <AccessDenied />;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const userEmail = user?.email;
    if (!isAdmin || !user || user.isGuest || !userEmail) return;

    setIsSubmitting(true);
    setFeedback(null);

    try {
      await createSong({
        audioUrl: formState.audioUrl,
        createdBy: userEmail,
        image: formState.image,
        subtitle: formState.subtitle,
        title: formState.title,
      });

      setFormState(initialFormState);
      setFeedback("Song uploaded successfully.");
    } catch (error) {
      setFeedback(error instanceof Error ? error.message : "Unable to upload song.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <p className="text-caption">Admin</p>
        <h1 className="text-display">Upload Songs</h1>
        <p className="text-textSecondary max-w-2xl text-sm leading-6 sm:text-base">
          Add new songs to the shared catalog with a direct audio URL and optional cover art.
        </p>
      </div>

      <section className="bg-surface/90 rounded-xl p-6 ring-1 ring-white/8 backdrop-blur-sm sm:p-8">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid gap-5 sm:grid-cols-2">
            <label className="space-y-2">
              <span className="text-caption">Song Title</span>
              <input
                className="bg-elevated text-textPrimary w-full rounded-xl px-4 py-3 text-sm font-medium outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
                onChange={(event) => {
                  setFormState((current) => ({ ...current, title: event.target.value }));
                }}
                placeholder="Blinding Lights"
                value={formState.title}
              />
            </label>

            <label className="space-y-2">
              <span className="text-caption">Artist Name</span>
              <input
                className="bg-elevated text-textPrimary w-full rounded-xl px-4 py-3 text-sm font-medium outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
                onChange={(event) => {
                  setFormState((current) => ({ ...current, subtitle: event.target.value }));
                }}
                placeholder="The Weeknd"
                value={formState.subtitle}
              />
            </label>
          </div>

          <label className="space-y-2">
            <span className="text-caption">Audio URL</span>
            <input
              className="bg-elevated text-textPrimary w-full rounded-xl px-4 py-3 text-sm font-medium outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
              onChange={(event) => {
                setFormState((current) => ({ ...current, audioUrl: event.target.value }));
              }}
              placeholder="https://example.com/song.mp3"
              value={formState.audioUrl}
            />
          </label>

          <label className="space-y-2">
            <span className="text-caption">Image URL</span>
            <input
              className="bg-elevated text-textPrimary w-full rounded-xl px-4 py-3 text-sm font-medium outline-none ring-1 ring-white/10 focus:ring-2 focus:ring-white/20"
              onChange={(event) => {
                setFormState((current) => ({ ...current, image: event.target.value }));
              }}
              placeholder="https://example.com/cover.jpg"
              value={formState.image}
            />
          </label>

          {feedback && (
            <div className="rounded-xl bg-background/50 px-4 py-3 ring-1 ring-white/8">
              <p className="text-sm font-medium text-textSecondary">{feedback}</p>
            </div>
          )}

          <div className="flex justify-end">
            <Button className="min-w-36 justify-center" disabled={isSubmitting} type="submit">
              {isSubmitting ? "Saving..." : "Save Song"}
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}
