"use client";

import { useEffect, useMemo, useState } from "react";
import { CourseCard } from "@/components/CourseCard";
import { PageHeader } from "@/components/PageHeader";
import { fetchList } from "@/lib/api";
import { fallbackCourses } from "@/lib/mockData";

export default function CoursesPage() {
  const [courses, setCourses] = useState(fallbackCourses);
  const [query, setQuery] = useState("");
  const [level, setLevel] = useState("all");

  useEffect(() => {
    fetchList("/courses", fallbackCourses).then(setCourses);
  }, []);

  const filteredCourses = useMemo(
    () =>
      courses.filter((course) => {
        const matchesQuery = `${course.title} ${course.description}`.toLowerCase().includes(query.toLowerCase());
        const matchesLevel = level === "all" || course.level === level;
        return matchesQuery && matchesLevel;
      }),
    [courses, query, level]
  );

  return (
    <>
      <PageHeader title="Courses" description="Browse all StudyHub courses, filter by level, and open detailed course pages before enrolling." />
      <section className="container-page py-8">
        <div className="mb-6 grid gap-3 md:grid-cols-[1fr_220px]">
          <input className="field" placeholder="Search courses" value={query} onChange={(event) => setQuery(event.target.value)} />
          <select className="field" value={level} onChange={(event) => setLevel(event.target.value)}>
            <option value="all">All levels</option>
            <option value="beginner">Beginner</option>
            <option value="intermediate">Intermediate</option>
            <option value="advanced">Advanced</option>
          </select>
        </div>
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {filteredCourses.map((course) => (
            <CourseCard key={course._id} course={course} />
          ))}
        </div>
      </section>
    </>
  );
}
