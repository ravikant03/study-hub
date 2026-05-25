"use client";

import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { FileText, ImageIcon, ListChecks, Video } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";
import { fetchCourseContent } from "@/lib/api";
import { fallbackContent } from "@/lib/mockData";

const icons = {
  video: Video,
  pdf: FileText,
  image: ImageIcon,
  assignment: ListChecks,
  quiz: ListChecks,
  text: FileText
};

export default function CourseContentPage() {
  const { id } = useParams();
  const [content, setContent] = useState(fallbackContent);

  useEffect(() => {
    fetchCourseContent(id).then(setContent);
  }, [id]);

  return (
    <>
      <PageHeader title="Course Content" description="Follow lessons, PDFs, assignments, and preview material for the selected course." />
      <section className="container-page grid gap-4 py-8">
        {content.map((item) => {
          const Icon = icons[item.type] || FileText;
          return (
            <article key={item._id} className="card flex flex-col gap-4 p-5 sm:flex-row sm:items-center">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-teal-100 text-teal-800">
                <Icon className="h-6 w-6" />
              </div>
              <div className="flex-1">
                <p className="text-xs font-black uppercase tracking-wide text-teal-700">{item.type}</p>
                <h2 className="text-lg font-black text-slate-950">{item.title}</h2>
                <p className="mt-1 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
              {item.media?.url ? (
                <a href={item.media.url} className="btn-secondary" target="_blank" rel="noreferrer">
                  Open
                </a>
              ) : null}
            </article>
          );
        })}
      </section>
    </>
  );
}
