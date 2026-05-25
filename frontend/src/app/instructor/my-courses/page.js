"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminResourcePage } from "@/components/AdminResourcePage";
import { InstructorNav } from "@/components/InstructorNav";
import { fetchList } from "@/lib/api";
import { fallbackCategories, fallbackCourses } from "@/lib/mockData";

export default function InstructorMyCoursesPage() {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    fetchList("/categories", fallbackCategories).then(setCategories);
  }, []);

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: category._id, label: category.name })),
    [categories]
  );

  return (
    <AdminResourcePage
      eyebrow="Instructor"
      nav={<InstructorNav />}
      title="My Courses"
      description="Create courses and manage the courses that belong to your instructor account."
      endpoint="/courses/mine"
      writeEndpoint="/courses"
      fallback={fallbackCourses}
      fields={[
        { name: "title", label: "Title", required: true },
        { name: "description", label: "Description", type: "textarea", required: true },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          placeholderOption: "Select category",
          options: categoryOptions
        },
        { name: "price", label: "Price", inputType: "number", required: true },
        {
          name: "level",
          label: "Level",
          type: "select",
          initial: "beginner",
          options: [
            { value: "beginner", label: "Beginner" },
            { value: "intermediate", label: "Intermediate" },
            { value: "advanced", label: "Advanced" }
          ]
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          initial: "published",
          options: [
            { value: "published", label: "Published" },
            { value: "draft", label: "Draft" }
          ]
        },
        { name: "thumbnail", label: "Course Thumbnail", type: "file", accept: "image/png,image/jpeg,image/webp" },
        { name: "previewVideo", label: "Preview Video", type: "file", accept: "video/mp4,video/webm,video/quicktime" }
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category", render: (item) => item.category?.name || item.category || "-" },
        { key: "price", label: "Price", render: (item) => `Rs. ${item.price || 0}` },
        { key: "previewVideo", label: "Video", render: (item) => (item.previewVideo?.url ? "Uploaded" : "-") },
        { key: "status", label: "Status", render: (item) => item.status || "draft" }
      ]}
    />
  );
}
