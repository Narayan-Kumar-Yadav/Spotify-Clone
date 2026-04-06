"use client";

import Image from "next/image";

import { Button } from "@/components/ui/Button";
import { useAuth } from "@/features/auth/AuthProvider";

function ProfileAvatar({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  if (imageUrl) {
    return (
      <Image
        alt={name}
        className="size-16 rounded-full object-cover"
        height={64}
        src={imageUrl}
        width={64}
      />
    );
  }

  return (
    <div className="bg-accent/20 text-textPrimary flex size-16 items-center justify-center rounded-full text-xl font-semibold">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

export default function ProfilePage() {
  const { user, signOutUser } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = user.displayName || "Spotify Listener";
  const email = user.isGuest ? "Guest User" : user.email || "Signed in with Google";

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div className="space-y-2">
        <p className="text-caption">Account</p>
        <h1 className="text-display">Your Profile</h1>
        <p className="text-textSecondary max-w-2xl text-sm leading-6 sm:text-base">
          Manage your Spotify Clone account details and sign-out preferences.
        </p>
      </div>

      <section className="bg-surface/90 rounded-xl p-6 ring-1 ring-white/8 backdrop-blur-sm sm:p-8">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <ProfileAvatar imageUrl={user.photoURL ?? null} name={displayName} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-title truncate">{displayName}</p>
                {user.isGuest ? (
                  <span className="text-[11px] font-semibold text-yellow-400">Guest Mode</span>
                ) : null}
              </div>
              <p className="text-textSecondary truncate text-sm">{email}</p>
            </div>
          </div>

          <Button className="w-full justify-center sm:w-auto" onClick={signOutUser} variant="ghost">
            Logout
          </Button>
        </div>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl bg-background/40 p-4 ring-1 ring-white/6">
            <p className="text-caption">Display Name</p>
            <p className="text-textPrimary mt-2 text-sm font-semibold sm:text-base">
              {displayName}
            </p>
          </div>

          <div className="rounded-xl bg-background/40 p-4 ring-1 ring-white/6">
            <p className="text-caption">Email</p>
            <p className="text-textPrimary mt-2 text-sm font-semibold sm:text-base">{email}</p>
          </div>

          <div className="rounded-xl bg-background/40 p-4 ring-1 ring-white/6">
            <p className="text-caption">Provider</p>
            <p className="text-textPrimary mt-2 text-sm font-semibold sm:text-base">
              {user.isGuest ? "Guest Mode" : "Google Sign-In"}
            </p>
          </div>

          <div className="rounded-xl bg-background/40 p-4 ring-1 ring-white/6">
            <p className="text-caption">Status</p>
            <p className="text-accent mt-2 text-sm font-semibold sm:text-base">
              {user.isGuest ? "Guest Session" : "Signed In"}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
