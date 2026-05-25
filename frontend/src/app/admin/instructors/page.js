"use client";

import { useEffect, useMemo, useState } from "react";
import { AdminResourcePage } from "@/components/AdminResourcePage";
import { fetchList } from "@/lib/api";
import { fallbackInstructors, fallbackUsers } from "@/lib/mockData";

export default function AdminInstructorsPage() {
  const [users, setUsers] = useState(fallbackUsers);

  useEffect(() => {
    fetchList("/users", fallbackUsers).then(setUsers);
  }, []);

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
      title="Instructor Management"
      description="Create and update instructor profiles linked to user accounts."
      endpoint="/instructors"
      fallback={fallbackInstructors}
      fields={[
        {
          name: "user",
          label: "User",
          type: "select",
          required: true,
          placeholderOption: "Select user",
          options: userOptions,
          help: "Choose the user account that should become an instructor."
        },
        { name: "bio", label: "Bio", type: "textarea", required: true },
        { name: "expertise", label: "Expertise" },
        { name: "qualifications", label: "Qualifications" }
      ]}
      columns={[
        { key: "user", label: "Instructor", render: (item) => item.user?.name || item.user || "-" },
        { key: "bio", label: "Bio" },
        { key: "expertise", label: "Expertise", render: (item) => (item.expertise || []).join(", ") || "-" }
      ]}
    />
  );
}
