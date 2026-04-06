import Link from "next/link";
import type { ReactNode } from "react";

import { cn } from "@/lib/utils/cn";

type SidebarItemProps = {
  active?: boolean;
  href?: string;
  icon: ReactNode;
  label: string;
};

export function SidebarItem({ active = false, href = "#", icon, label }: SidebarItemProps) {
  return (
    <Link
      className={cn(
        "text-textSecondary hover:text-textPrimary hover:bg-elevated flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold",
        active && "bg-elevated text-textPrimary shadow-[inset_0_0_0_1px_rgba(255,255,255,0.06)]",
      )}
      href={href}
    >
      <span
        className={cn(
          "text-textPrimary flex size-10 items-center justify-center rounded-xl bg-white/5",
          active && "bg-white/10",
        )}
      >
        {icon}
      </span>
      <span>{label}</span>
    </Link>
  );
}
