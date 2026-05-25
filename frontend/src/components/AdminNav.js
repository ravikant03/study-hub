import Link from "next/link";

const adminLinks = [
  ["Dashboard", "/admin/dashboard"],
  ["Users", "/admin/users"],
  ["Categories", "/admin/categories"],
  ["Courses", "/admin/courses"],
  ["Instructors", "/admin/instructors"],
  ["Enrollments", "/admin/enrollments"],
  ["Content", "/admin/course-content"],
  ["Payments", "/admin/payments"]
];

export function AdminNav() {
  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="container-page flex gap-2 overflow-x-auto py-3">
        {adminLinks.map(([label, href]) => (
          <Link key={href} href={href} className="shrink-0 rounded-lg px-3 py-2 text-sm font-bold text-slate-700 hover:bg-teal-50 hover:text-teal-800">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
