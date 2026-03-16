"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { isAuthenticated } from "@/lib/auth";
import { useAuth } from "@/hooks/useAuth";
import { hasPermission } from "@/lib/permissions";

{
  /* <AuthGuard requiredPermissions={["employees:read"]}>...</AuthGuard> */
}
type Props = {
  children: React.ReactNode;
  requiredPermissions?: string[];
};

export default function AuthGuard({ children, requiredPermissions }: Props) {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const auth = useAuth();
  const permissions = auth?.permissions ?? [];
  const loading = auth?.loading ?? true;

  useEffect(() => {
    if (loading) return; // Wait for auth to finish loading
    if (!isAuthenticated()) {
      router.push("/auth/login");
      return;
    }
    // Permission check
    if (requiredPermissions && requiredPermissions.length > 0) {
      const hasAny = requiredPermissions.some((perm) =>
        hasPermission(permissions, perm),
      );
      if (!hasAny) {
        router.push("/dashboard"); // Redirect to dashboard or error page
        return;
      }
    }
    setIsAuth(true);
  }, [router, permissions, requiredPermissions, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  if (!isAuth) {
    return null;
  }
  return <>{children}</>;
}
