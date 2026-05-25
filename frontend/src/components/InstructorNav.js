import Link from "next/link";

export function InstructorNav() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="container-page flex gap-2 overflow-x-auto py-3">
        <Link href="/instructor/my-courses" className="shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800">
          My Courses
        </Link>
        <Link href="/instructor/course-content" className="shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800">
          Course Content
        </Link>
      </div>
    </nav>
  );
}
