"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAuth } from "@/context/AuthContext";

const publicRoutes = [
  "/",
  "/login",
  "/register",
  "/forgot-password",
  "/reset-password",
  "/verify-otp"
];

const isPublicRoute = (pathname) => {
  if (publicRoutes.includes(pathname)) return true;
  return publicRoutes.some((route) => route !== "/" && pathname.startsWith(`${route}/`));
};

const isInstructorWorkspaceRoute = (pathname) => {
  return pathname === "/instructor" || pathname.startsWith("/instructor/");
};

export function RouteGuard({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, loading, isAdmin, isInstructor } = useAuth();

  useEffect(() => {
    if (loading) return;

    if (!user && !isPublicRoute(pathname)) {
      router.replace(`/login?next=${encodeURIComponent(pathname)}`);
      return;
    }

    if (pathname.startsWith("/admin") && !isAdmin) {
      router.replace("/");
      return;
    }

    if (isInstructorWorkspaceRoute(pathname) && !isInstructor && !isAdmin) {
      router.replace("/");
    }
  }, [pathname, router, user, loading, isAdmin, isInstructor]);

  if (loading && !isPublicRoute(pathname)) {
    return (
      <div className="container-page py-12">
        <div className="card p-6 text-center text-sm font-bold text-slate-600">Checking your session...</div>
      </div>
    );
  }

  if (!user && !isPublicRoute(pathname)) {
    return null;
  }

  if (pathname.startsWith("/admin") && !isAdmin) {
    return null;
  }

  if (isInstructorWorkspaceRoute(pathname) && !isInstructor && !isAdmin) {
    return null;
  }

  return children;
}
