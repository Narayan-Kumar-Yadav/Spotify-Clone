import type { ReactNode } from "react";

import { MainContent } from "@/components/layout/MainContent";
import { Sidebar } from "@/components/layout/Sidebar";
import { ProtectedRoute } from "@/features/auth/ProtectedRoute";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <ProtectedRoute>
      <div className="bg-background text-textPrimary flex h-screen">
        <Sidebar />
        <MainContent>{children}</MainContent>
      </div>
    </ProtectedRoute>
  );
}
