"use client";

import { useEffect, useState } from "react";
import { InstructorCard } from "@/components/InstructorCard";
import { PageHeader } from "@/components/PageHeader";
import { fetchList } from "@/lib/api";
import { fallbackInstructors } from "@/lib/mockData";

export default function InstructorsPage() {
  const [instructors, setInstructors] = useState(fallbackInstructors);

  useEffect(() => {
    fetchList("/instructors", fallbackInstructors).then(setInstructors);
  }, []);

  return (
    <>
      <PageHeader title="Instructors" description="Explore instructor profiles, expertise, and courses taught by each educator." />
      <section className="container-page grid gap-5 py-8 md:grid-cols-2 lg:grid-cols-3">
        {instructors.map((instructor) => (
          <InstructorCard key={instructor._id} instructor={instructor} />
        ))}
      </section>
    </>
  );
}
