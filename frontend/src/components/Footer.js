import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-14 border-t border-slate-200 bg-white">
      <div className="container-page grid gap-6 py-8 text-sm text-slate-600 md:grid-cols-[1fr_auto] md:items-center">
        <div>
          <p className="font-black text-slate-950">StudyHub</p>
          <p className="mt-1">Courses, instructors, enrollments, content, and payments in one learning platform.</p>
        </div>
        <div className="flex flex-wrap gap-4 font-semibold">
          <Link href="/about">About</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/courses">Courses</Link>
        </div>
      </div>
    </footer>
  );
}
