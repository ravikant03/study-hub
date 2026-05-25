"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminResourcePage } from "@/components/AdminResourcePage";
import { fetchList } from "@/lib/api";
import { fallbackCourses, fallbackEnrollments, fallbackUsers } from "@/lib/mockData";

export default function AdminEnrollmentsPage() {
  const [courses, setCourses] = useState(fallbackCourses);
  const [users, setUsers] = useState(fallbackUsers);

  useEffect(() => {
    fetchList("/courses?status=all", fallbackCourses).then(setCourses);
    fetchList("/users", fallbackUsers).then(setUsers);
  }, []);

  const courseOptions = useMemo(
    () => courses.map((course) => ({ value: course._id, label: course.title })),
    [courses]
  );
  const userOptions = useMemo(
    () =>
      users.map((user) => ({
        value: user._id,
        label: `${user.name} (${user.email})`
      })),
    [users]
  );

  return (
    <AdminResourcePage
      title="Enrollment Management"
      description="Review and manage course enrollment records and statuses."
      endpoint="/enrollments"
      fallback={fallbackEnrollments}
      fields={[
        {
          name: "userId",
          label: "Student",
          type: "select",
          required: true,
          placeholderOption: "Select student",
          options: userOptions,
          sourceKey: "user",
          help: "Choose which user should be enrolled."
        },
        {
          name: "courseId",
          label: "Course",
          type: "select",
          required: true,
          placeholderOption: "Select course",
          options: courseOptions,
          sourceKey: "course",
          help: "Choose the course by title. The form sends the course _id automatically."
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          initial: "active",
          options: [
            { value: "pending", label: "Pending" },
            { value: "active", label: "Active" },
            { value: "completed", label: "Completed" },
            { value: "cancelled", label: "Cancelled" },
            { value: "refunded", label: "Refunded" }
          ]
        },
        {
          name: "progressPercent",
          label: "Progress Percent",
          inputType: "number",
          initial: "0"
        }
      ]}
      columns={[
        { key: "user", label: "Student", render: (item) => item.user?.name || item.user || "-" },
        { key: "course", label: "Course", render: (item) => item.course?.title || item.course || "-" },
        { key: "status", label: "Status" },
        { key: "progressPercent", label: "Progress", render: (item) => `${item.progressPercent || 0}%` }
      ]}
    />
  );
}
