"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminResourcePage } from "@/components/AdminResourcePage";
import { fetchList } from "@/lib/api";
import { fallbackCategories, fallbackCourses, fallbackInstructors } from "@/lib/mockData";

export default function AdminCoursesPage() {
  const [categories, setCategories] = useState(fallbackCategories);
  const [instructors, setInstructors] = useState(fallbackInstructors);

  useEffect(() => {
    fetchList("/categories", fallbackCategories).then(setCategories);
    fetchList("/instructors", fallbackInstructors).then(setInstructors);
  }, []);

  const categoryOptions = useMemo(
    () => categories.map((category) => ({ value: category._id, label: category.name })),
    [categories]
  );
  const instructorOptions = useMemo(
    () =>
      instructors.map((instructor) => ({
        value: instructor._id,
        label: instructor.user?.name || instructor.name || instructor._id
      })),
    [instructors]
  );

  return (
    <AdminResourcePage
      title="Course Management"
      description="Create and manage course records, pricing, levels, and publication data."
      endpoint="/courses?status=all"
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
          options: categoryOptions,
          help: "This dropdown uses the category _id internally."
        },
        {
          name: "instructor",
          label: "Instructor",
          type: "select",
          placeholderOption: "Select instructor",
          options: instructorOptions,
          help: "Admins select an instructor profile. Instructors can create their own courses without this field."
        },
        { name: "price", label: "Price", required: true },
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
            { value: "draft", label: "Draft" },
            { value: "archived", label: "Archived" }
          ],
          help: "Published courses appear on the public Courses page."
        },
        {
          name: "thumbnail",
          label: "Course Thumbnail",
          type: "file",
          accept: "image/png,image/jpeg,image/webp",
          help: "Uploads a course image to Cloudinary."
        },
        {
          name: "previewVideo",
          label: "Preview Video",
          type: "file",
          accept: "video/mp4,video/webm,video/quicktime",
          help: "Optional preview video uploaded to Cloudinary."
        }
      ]}
      columns={[
        { key: "title", label: "Title" },
        { key: "category", label: "Category", render: (item) => item.category?.name || item.category || "-" },
        { key: "instructor", label: "Instructor", render: (item) => item.instructor?.user?.name || item.instructor || "-" },
        { key: "price", label: "Price", render: (item) => `Rs. ${item.price || 0}` },
        { key: "previewVideo", label: "Video", render: (item) => (item.previewVideo?.url ? "Uploaded" : "-") },
        { key: "status", label: "Status", render: (item) => item.status || "draft" }
      ]}
    />
  );
}
