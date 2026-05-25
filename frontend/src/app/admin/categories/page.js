"use client";

import { AdminResourcePage } from "@/components/AdminResourcePage";
import { fallbackCategories } from "@/lib/mockData";

export default function AdminCategoriesPage() {
  return (
    <AdminResourcePage
      title="Category Management"
      description="Create and manage course categories shown across the platform."
      endpoint="/categories"
      fallback={fallbackCategories}
      fields={[
        { name: "name", label: "Name", required: true },
        { name: "description", label: "Description", type: "textarea" },
        {
          name: "image",
          label: "Category Thumbnail",
          type: "file",
          accept: "image/png,image/jpeg,image/webp",
          help: "Uploads to Cloudinary through the backend."
        }
      ]}
      columns={[
        { key: "name", label: "Name" },
        { key: "slug", label: "Slug" },
        { key: "description", label: "Description", flex: 1.5 },
        { key: "image", label: "Thumbnail", render: (item) => (item.image?.url ? "Uploaded" : "-") }
      ]}
    />
  );
}
