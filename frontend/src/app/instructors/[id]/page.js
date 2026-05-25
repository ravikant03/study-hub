"use client";

import Image from "next/image";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { fetchInstructor } from "@/lib/api";
import { fallbackInstructors } from "@/lib/mockData";

export default function InstructorDetailsPage() {
  const { id } = useParams();
  const [instructor, setInstructor] = useState(fallbackInstructors[0]);

  useEffect(() => {
    fetchInstructor(id).then(setInstructor);
  }, [id]);

  const user = instructor.user || {};
  const image = user.avatar?.url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop";

  return (
    <>
      <section className="bg-white">
        <div className="container-page flex flex-col gap-6 py-8 md:flex-row md:items-center">
          <div className="relative h-28 w-28 overflow-hidden rounded-lg bg-slate-200">
            <Image src={image} alt={user.name || "Instructor"} fill className="object-cover" sizes="112px" />
          </div>
          <div>
            <p className="text-sm font-black uppercase tracking-wide text-teal-700">Instructor</p>
            <h1 className="text-3xl font-black text-slate-950 sm:text-4xl">{user.name}</h1>
            <p className="mt-3 max-w-3xl text-base leading-7 text-slate-600">{instructor.bio}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {(instructor.expertise || []).map((skill) => (
                <span key={skill} className="rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
                  {skill}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container-page py-8">
        <h2 className="mb-5 text-2xl font-black text-slate-950">Courses by {user.name}</h2>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {(instructor.courses || []).map((course) => (
            <CourseCard key={course._id} course={{ ...course, instructor }} />
          ))}
        </div>
      </section>
    </>
  );
}
