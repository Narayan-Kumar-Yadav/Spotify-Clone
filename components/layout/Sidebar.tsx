"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { HomeIcon, LibraryIcon, SearchIcon, StackIcon, UserIcon } from "@/components/shared/icons";
import { Button } from "@/components/ui/Button";
import { SidebarItem } from "@/components/ui/SidebarItem";
import { useAuth } from "@/features/auth/AuthProvider";
import { useAdminAccess } from "@/features/auth/useAdminAccess";
import { cn } from "@/lib/utils/cn";

const baseNavigationItems = [
  {
    href: "/home",
    icon: <HomeIcon className="size-5" />,
    label: "Home",
  },
  {
    href: "/search",
    icon: <SearchIcon className="size-5" />,
    label: "Search",
  },
  {
    href: "/library",
    icon: <LibraryIcon className="size-5" />,
    label: "Your Library",
  },
  {
    href: "/profile",
    icon: <UserIcon className="size-5" />,
    label: "Profile",
  },
];

function UserAvatar({ imageUrl, name }: { imageUrl: string | null; name: string }) {
  if (imageUrl) {
    return (
      <Image
        alt={name}
        className="size-12 rounded-xl object-cover"
        height={48}
        src={imageUrl}
        width={48}
      />
    );
  }

  return (
    <div className="bg-accent/20 text-textPrimary flex size-12 items-center justify-center rounded-xl text-sm font-semibold">
      {name.slice(0, 1).toUpperCase()}
    </div>
  );
}

function UserPanel({ active }: { active: boolean }) {
  const { signOutUser, user } = useAuth();

  if (!user) {
    return null;
  }

  const displayName = user.displayName || "Spotify Listener";
  const email = user.isGuest ? "Guest User" : user.email || "Signed in with Google";

  return (
    <div
      className={cn(
        "bg-surface/90 rounded-xl p-5 ring-1 ring-white/6 backdrop-blur-sm",
        active && "bg-elevated ring-accent/40 shadow-glow",
      )}
    >
      <Link
        className="focus-visible:ring-accent/70 -m-2 block rounded-xl p-2 outline-none transition hover:bg-white/5 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        href="/profile"
      >
        <div className="flex items-center gap-3">
          <UserAvatar imageUrl={user.photoURL ?? null} name={displayName} />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="text-textPrimary truncate text-sm font-semibold">{displayName}</p>
              {user.isGuest ? (
                <span className="text-[11px] font-semibold text-yellow-400">Guest</span>
              ) : null}
            </div>
            <p className="text-textSecondary truncate text-sm">{email}</p>
          </div>
        </div>

        <p className="text-textSecondary mt-3 text-xs font-medium tracking-[0.18em] uppercase">
          View Profile
        </p>
      </Link>

      <Button className="mt-5 w-full justify-center py-2.5" onClick={signOutUser} variant="ghost">
        Log out
      </Button>
    </div>
  );
}

export function Sidebar() {
  const pathname = usePathname();
  const { isAdmin } = useAdminAccess();
  const isProfileRoute = pathname === "/profile";
  const navigationItems = isAdmin
    ? [
        ...baseNavigationItems,
        {
          href: "/admin",
          icon: <StackIcon className="size-5" />,
          label: "Admin",
        },
      ]
    : baseNavigationItems;

  return (
    <>
      <aside className="lg:bg-background/96 hidden lg:fixed lg:inset-y-0 lg:left-0 lg:z-30 lg:flex lg:w-72 lg:flex-col lg:border-r lg:border-white/6 lg:px-5 lg:py-6 lg:backdrop-blur-xl">
        <div className="px-2">
          {/* Spotify logo mark + wordmark */}
          <a href="/home" className="flex items-center gap-2.5 group" aria-label="Spotify Clone — Home">
            {/* Green circle logo */}
            <svg
              viewBox="0 0 496 512"
              className="size-8 shrink-0"
              fill="#1DB954"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 6.8-13.1 9-19.9 4.7-54.3-33.8-122.8-41.5-203.3-22.7-7.8 1.8-15.6-3-17.4-10.8-1.8-7.8 3-15.6 10.8-17.4 88.1-20.1 163.7-11.4 224.7 26.4 6.7 4.3 9 13.1 4.7 19.8zm26.9-60.7c-5.3 8.6-16.6 11.3-25.2 5.9-62.1-38.6-156.7-49.8-230.1-27.3-9.6 2.9-19.7-2.4-22.7-12-2.9-9.6 2.4-19.7 12-22.7 83.4-25.3 187-13.1 258.2 31.8 8.6 5.4 11.3 16.6 5.8 25.3zm2.3-63.3c-74.5-44.3-197.6-48.4-268.7-26.8-11.4 3.4-23.4-2.9-26.8-14.4-3.4-11.4 2.9-23.4 14.4-26.8 81.8-24.8 217.5-20 302.8 31.1 10.2 6.1 13.6 19.3 7.5 29.5-6.1 10.2-19.3 13.6-29.5 7.5z"/>
            </svg>
            <span className="text-textPrimary text-base font-bold tracking-tight group-hover:text-white transition-colors duration-150">
              Spotify Clone
            </span>
          </a>
        </div>

        <nav className="mt-6 space-y-2">
          {navigationItems.map((item) => (
            <SidebarItem
              key={item.label}
              active={item.href !== "#" && pathname === item.href}
              href={item.href}
              icon={item.icon}
              label={item.label}
            />
          ))}
        </nav>

        <div className="mt-auto space-y-4">
          <UserPanel active={isProfileRoute} />
        </div>
      </aside>

      <div className="bg-surface/95 fixed inset-x-0 bottom-0 z-50 flex items-center justify-around border-t border-white/6 px-4 py-3 backdrop-blur-xl lg:hidden">
        {navigationItems.map((item) => {
          const isActive = item.href !== "#" && pathname === item.href;
          return (
            <a
              key={item.label}
              className={`flex flex-col items-center gap-1 p-2 ${isActive ? "text-textPrimary" : "text-textSecondary hover:text-textPrimary"}`}
              href={item.href}
            >
              {item.icon}
              <span className="text-[10px] font-medium">{item.label}</span>
            </a>
          );
        })}
      </div>
    </>
  );
}
