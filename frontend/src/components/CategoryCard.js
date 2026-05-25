import Image from "next/image";
import Link from "next/link";

export function CategoryCard({ category }) {
  const image = category.image?.url || "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=900&auto=format&fit=crop";

  return (
    <Link href={`/courses?category=${category._id}`} className="card group overflow-hidden">
      <div className="relative aspect-[16/10] bg-slate-200">
        <Image src={image} alt={category.name} fill className="object-cover transition group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="p-5">
        <h2 className="text-lg font-black text-slate-950">{category.name}</h2>
        <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-600">{category.description}</p>
      </div>
    </Link>
  );
}
