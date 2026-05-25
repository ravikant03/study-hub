import Image from "next/image";
import Link from "next/link";
import { Clock, IndianRupee, Layers } from "lucide-react";

export function CourseCard({ course }) {
  const image = course.thumbnail?.url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop";
  const instructorName = course.instructor?.user?.name || course.instructor?.name || "StudyHub Instructor";

  return (
    <article className="card overflow-hidden">
      <div className="relative aspect-[16/9] bg-slate-200">
        <Image src={image} alt={course.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="grid gap-4 p-5">
        <div>
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700">{course.category?.name || "Course"}</p>
          <h2 className="mt-1 line-clamp-2 text-lg font-black text-slate-950">{course.title}</h2>
          <p className="mt-2 line-clamp-3 text-sm leading-6 text-slate-600">{course.description}</p>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Layers className="h-4 w-4 text-teal-700" />
            {course.level || "beginner"}
          </span>
          <span className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-teal-700" />
            {Math.max(1, Math.round((course.durationMinutes || 60) / 60))} hours
          </span>
          <span className="font-semibold text-slate-800">{instructorName}</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <span className="flex items-center font-black text-slate-950">
            <IndianRupee className="h-4 w-4" />
            {course.price || 0}
          </span>
          <Link href={`/courses/${course._id || course.slug}`} className="btn-primary py-2">
            Details
          </Link>
        </div>
      </div>
    </article>
  );
}
