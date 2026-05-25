"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminResourcePage } from "@/components/AdminResourcePage";
import { InstructorNav } from "@/components/InstructorNav";
import { fetchList } from "@/lib/api";
import { fallbackContent, fallbackCourses } from "@/lib/mockData";

export default function InstructorCourseContentPage() {
  const [courses, setCourses] = useState(fallbackCourses);

  useEffect(() => {
    fetchList("/courses/mine", fallbackCourses).then(setCourses);
  }, []);

  const courseOptions = useMemo(
    () => courses.map((course) => ({ value: course._id, label: course.title })),
    [courses]
  );

  return (
    <AdminResourcePage
      eyebrow="Instructor"
      nav={<InstructorNav />}
      title="Course Content"
      description="Add videos, PDFs, images, assignments, and lessons to your own courses."
      endpoint="/course-content"
      fallback={fallbackContent}
      fields={[
        {
          name: "course",
          label: "Course",
          type: "select",
          required: true,
          placeholderOption: "Select your course",
          options: courseOptions
        },
        { name: "title", label: "Title", required: true },
        {
          name: "type",
          label: "Type",
          type: "select",
          initial: "video",
          required: true,
          options: [
            { value: "video", label: "Video" },
            { value: "pdf", label: "PDF" },
            { value: "image", label: "Image" },
            { value: "text", label: "Text" },
            { value: "quiz", label: "Quiz" },
            { value: "assignment", label: "Assignment" }
          ]
        },
        { name: "description", label: "Description", type: "textarea" },
        { name: "body", label: "Text Body", type: "textarea" },
        {
          name: "media",
          label: "Video, PDF, or Image",
          type: "file",
          accept: "video/mp4,video/webm,video/quicktime,application/pdf,image/png,image/jpeg,image/webp"
        }
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "type", label: "Type" },
        { key: "course", label: "Course", render: (item) => item.course?.title || item.course || "-" },
        { key: "media", label: "Media", render: (item) => (item.media?.url ? "Uploaded" : "-") }
      ]}
    />
  );
}
