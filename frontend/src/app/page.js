"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, BookOpen, CreditCard, ShieldCheck } from "lucide-react";
import { CategoryCard } from "@/components/CategoryCard";
import { CourseCard } from "@/components/CourseCard";
import { fetchList } from "@/lib/api";
import { fallbackCategories, fallbackCourses } from "@/lib/mockData";

export default function HomePage() {
  const [courses, setCourses] = useState(fallbackCourses);
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    fetchList("/courses", fallbackCourses).then(setCourses);
    fetchList("/categories", fallbackCategories).then(setCategories);
  }, []);

  return (
    <>
      <section className="bg-white">
        <div className="container-page grid min-h-[520px] gap-8 py-10 md:grid-cols-[1.1fr_0.9fr] md:items-center">
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-teal-700">StudyHub learning platform</p>
            <h1 className="mt-3 max-w-3xl text-4xl font-black leading-tight text-slate-950 sm:text-5xl">
              Learn practical skills from instructors who build for the real world.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Browse categories, enroll in courses, unlock content, and manage payments from one responsive learning dashboard.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Link href="/courses" className="btn-primary">
                Explore Courses <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/instructors" className="btn-secondary">
                Meet Instructors
              </Link>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2">
            {[
              ["Structured content", BookOpen],
              ["Secure payments", CreditCard],
              ["Role-based access", ShieldCheck]
            ].map(([label, Icon]) => (
              <div key={label} className="card p-5">
                <Icon className="h-7 w-7 text-teal-700" />
                <p className="mt-4 text-lg font-black text-slate-950">{label}</p>
                <p className="mt-2 text-sm leading-6 text-slate-600">Connected to the StudyHub backend API and ready for real data.</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container-page py-10">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Featured courses</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Start with a high-impact path</h2>
          </div>
          <Link href="/courses" className="font-bold text-teal-700">
            View all
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {courses.slice(0, 3).map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>

      <section className="container-page py-6">
        <div className="mb-5 flex items-end justify-between gap-4">
          <div>
            <p className="text-sm font-bold uppercase tracking-wide text-teal-700">Categories</p>
            <h2 className="mt-1 text-2xl font-black text-slate-950">Choose your learning lane</h2>
          </div>
          <Link href="/categories" className="font-bold text-teal-700">
            Browse
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {categories.slice(0, 3).map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
