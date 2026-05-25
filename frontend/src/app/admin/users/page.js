"use client";

import { AdminResourcePage } from "@/components/AdminResourcePage";

const fallbackUsers = [
  { _id: "u1", name: "Demo Student", email: "student@studyhub.local", role: "student", isActive: true },
  { _id: "u2", name: "Demo Admin", email: "admin@studyhub.local", role: "admin", isActive: true }
];

export default function AdminUsersPage() {
  return (
    <AdminResourcePage
      title="User Management"
      description="Create accounts, review user information, and manage user roles."
      endpoint="/users"
      fallback={fallbackUsers}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "email", label: "Email", required: true },
        { name: "password", label: "Password", required: true },
        {
          name: "role",
          label: "Role",
          type: "select",
          initial: "student",
          required: true,
          options: [
            { value: "student", label: "Student" },
            { value: "instructor", label: "Instructor" },
            { value: "admin", label: "Admin" }
          ]
        }
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "email", label: "Email" },
        { key: "role", label: "Role" },
        { key: "isActive", label: "Status", render: (item) => (item.isActive === false ? "Inactive" : "Active") }
      ]}
    />
  );
}
