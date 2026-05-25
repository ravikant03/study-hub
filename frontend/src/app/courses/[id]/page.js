"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { BookOpen, Clock, IndianRupee, UserRound } from "lucide-react";
import { fetchCourse } from "@/lib/api";
import { fallbackCourses } from "@/lib/mockData";

export default function CourseDetailsPage() {
  const { id } = useParams();
  const [course, setCourse] = useState(fallbackCourses[0]);

  useEffect(() => {
    fetchCourse(id).then(setCourse);
  }, [id]);

  const image = course.thumbnail?.url || "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=900&auto=format&fit=crop";
  const instructor = course.instructor?.user?.name || "StudyHub Instructor";

  return (
    <>
      <section className="bg-white">
        <div className="container-page grid gap-8 py-8 lg:grid-cols-[1fr_380px]">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-teal-700">{course.category?.name || "Course"}</p>
            <h1 className="mt-2 text-3xl font-black text-slate-950 sm:text-5xl">{course.title}</h1>
            <p className="mt-4 max-w-3xl text-lg leading-8 text-slate-600">{course.description}</p>
            <div className="mt-6 grid gap-3 text-sm font-semibold text-slate-700 sm:grid-cols-3">
              <span className="flex items-center gap-2"><UserRound className="h-4 w-4 text-teal-700" /> {instructor}</span>
              <span className="flex items-center gap-2"><Clock className="h-4 w-4 text-teal-700" /> {Math.round((course.durationMinutes || 60) / 60)} hours</span>
              <span className="flex items-center gap-2"><BookOpen className="h-4 w-4 text-teal-700" /> {course.level}</span>
            </div>
          </div>
          <aside className="card overflow-hidden">
            <div className="relative aspect-[16/10]">
              <Image src={image} alt={course.title} fill className="object-cover" sizes="380px" />
            </div>
            <div className="grid gap-4 p-5">
              <p className="flex items-center text-3xl font-black text-slate-950"><IndianRupee className="h-6 w-6" />{course.price || 0}</p>
              <Link href={`/payments/${course._id}`} className="btn-primary">Enroll and Pay</Link>
              <Link href={`/courses/${course._id}/content`} className="btn-secondary">View Content</Link>
            </div>
          </aside>
        </div>
      </section>

      <section className="container-page py-8">
        <h2 className="text-2xl font-black text-slate-950">Syllabus</h2>
        <div className="mt-5 grid gap-4">
          {(course.syllabus || []).map((item, index) => (
            <div key={`${item.title}-${index}`} className="card p-5">
              <p className="text-sm font-black text-teal-700">Module {index + 1}</p>
              <h3 className="mt-1 text-lg font-black text-slate-950">{item.title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}
