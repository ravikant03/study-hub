import Image from "next/image";
import Link from "next/link";

export function InstructorCard({ instructor }) {
  const user = instructor.user || instructor;
  const image = user.avatar?.url || "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=500&auto=format&fit=crop";

  return (
    <article className="card p-5">
      <div className="flex gap-4">
        <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-lg bg-slate-200">
          <Image src={image} alt={user.name || "Instructor"} fill className="object-cover" sizes="64px" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-950">{user.name}</h2>
          <p className="mt-1 line-clamp-3 text-sm leading-6 text-slate-600">{instructor.bio}</p>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {(instructor.expertise || []).slice(0, 3).map((skill) => (
          <span key={skill} className="rounded-md bg-amber-100 px-2 py-1 text-xs font-bold text-amber-900">
            {skill}
          </span>
        ))}
      </div>
      <Link href={`/instructors/${instructor._id}`} className="btn-secondary mt-5 w-full">
        View Profile
      </Link>
    </article>
  );
}
