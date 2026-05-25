"use client";

import { useEffect, useState } from "react";
import { CategoryCard } from "@/components/CategoryCard";
import { PageHeader } from "@/components/PageHeader";
import { fetchList } from "@/lib/api";
import { fallbackCategories } from "@/lib/mockData";

export default function CategoriesPage() {
  const [categories, setCategories] = useState(fallbackCategories);

  useEffect(() => {
    fetchList("/categories", fallbackCategories).then(setCategories);
  }, []);

  return (
    <>
      <PageHeader title="Categories" description="Find courses by subject area and move directly into the learning path that fits your goal." />
      <section className="container-page py-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <CategoryCard key={category._id} category={category} />
          ))}
        </div>
      </section>
    </>
  );
}
