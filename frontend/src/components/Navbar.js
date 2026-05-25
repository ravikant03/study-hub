"use client";

import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { BookOpen, GraduationCap, LayoutDashboard, LogOut, Menu, User, X } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

const links = [
  ["Courses", "/courses"],
  ["Categories", "/categories"],
  ["Instructors", "/instructors"],
  ["About", "/about"],
  ["Contact", "/contact"]
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { user, logout, isAdmin, isInstructor } = useAuth();
  const avatarUrl = user?.avatar?.url;

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-2 font-black text-slate-950">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-teal-700 text-white">
            <BookOpen className="h-5 w-5" />
          </span>
          StudyHub
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-semibold text-slate-700 md:flex">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="hover:text-teal-700">
              {label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          {isAdmin ? (
            <Link href="/admin/dashboard" className="btn-secondary py-2">
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          ) : null}
          {isInstructor ? (
            <Link href="/instructor/my-courses" className="btn-secondary py-2">
              <GraduationCap className="h-4 w-4" />
              My Courses
            </Link>
          ) : null}
          {user ? (
            <>
              <Link href="/profile" className="grid h-10 w-10 place-items-center overflow-hidden rounded-full border border-slate-200 bg-slate-100" title="Profile">
                {avatarUrl ? (
                  <Image src={avatarUrl} alt={user.name || "Profile"} width={40} height={40} className="h-full w-full object-cover" />
                ) : (
                  <User className="h-5 w-5 text-slate-600" />
                )}
              </Link>
              <button className="btn-secondary py-2" onClick={logout} type="button">
                <LogOut className="h-4 w-4" />
                Logout
              </button>
            </>
          ) : (
            <>
              <Link href="/login" className="btn-secondary py-2">
                Login
              </Link>
              <Link href="/register" className="btn-primary py-2">
                Register
              </Link>
            </>
          )}
        </div>

        <button className="btn-secondary px-3 py-2 md:hidden" onClick={() => setOpen((value) => !value)} type="button">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-page grid gap-2 py-4">
            {links.map(([label, href]) => (
              <Link key={href} href={href} className="rounded-lg px-3 py-2 font-semibold text-slate-700" onClick={() => setOpen(false)}>
                {label}
              </Link>
            ))}
            <Link href={user ? "/profile" : "/login"} className="btn-primary mt-2" onClick={() => setOpen(false)}>
              {user ? "Open Profile" : "Login"}
            </Link>
          </div>
        </div>
      ) : null}
    </header>
  );
}
