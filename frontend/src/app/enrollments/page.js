"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { fetchList } from "@/lib/api";
import { fallbackEnrollments } from "@/lib/mockData";

export default function EnrollmentHistoryPage() {
  const [enrollments, setEnrollments] = useState(fallbackEnrollments);

  useEffect(() => {
    fetchList("/enrollments/me", fallbackEnrollments).then(setEnrollments);
  }, []);

  return (
    <>
      <PageHeader title="Enrollment History" description="Track active, completed, and pending course enrollments." />
      <section className="container-page grid gap-4 py-8">
        {enrollments.map((enrollment) => (
          <article key={enrollment._id} className="card grid gap-4 p-5 md:grid-cols-[1fr_auto] md:items-center">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-teal-700">{enrollment.status}</p>
              <h2 className="text-xl font-black text-slate-950">{enrollment.course?.title}</h2>
              <p className="mt-2 text-sm text-slate-600">Progress: {enrollment.progressPercent || 0}%</p>
              <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-200">
                <div className="h-full bg-teal-700" style={{ width: `${enrollment.progressPercent || 0}%` }} />
              </div>
            </div>
            <Link href={`/courses/${enrollment.course?._id}/content`} className="btn-primary">Continue</Link>
          </article>
        ))}
      </section>
    </>
  );
}
