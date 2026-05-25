"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminResourcePage } from "@/components/AdminResourcePage";
import { fetchList } from "@/lib/api";
import { fallbackContent, fallbackCourses } from "@/lib/mockData";

export default function AdminCourseContentPage() {
  const [courses, setCourses] = useState(fallbackCourses);

  useEffect(() => {
    fetchList("/courses?status=all", fallbackCourses).then(setCourses);
  }, []);

  const courseOptions = useMemo(
    () => courses.map((course) => ({ value: course._id, label: course.title })),
    [courses]
  );

  return (
    <AdminResourcePage
      title="Course Content Management"
      description="Add and manage lessons, PDFs, videos, assignments, quizzes, and text content."
      endpoint="/course-content"
      fallback={fallbackContent}
      fields={[
        {
          name: "course",
          label: "Course",
          type: "select",
          required: true,
          placeholderOption: "Select course",
          options: courseOptions,
          help: "This dropdown sends the course _id to the backend."
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
        { name: "body", label: "Text Body", type: "textarea", help: "Use for text lessons, quiz notes, or assignment instructions." },
        {
          name: "media",
          label: "Video, PDF, or Image",
          type: "file",
          accept: "video/mp4,video/webm,video/quicktime,application/pdf,image/png,image/jpeg,image/webp",
          help: "For videos/PDFs/images, upload the file here. The backend sends it to Cloudinary and stores the URL."
        }
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "type", label: "Type" },
        { key: "course", label: "Course", render: (item) => item.course?.title || item.course || "-" },
        { key: "media", label: "Media", render: (item) => (item.media?.url ? "Uploaded" : "-") },
        { key: "order", label: "Order", render: (item) => item.order || 0 }
      ]}
    />
  );
}
