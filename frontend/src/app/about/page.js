import { Award, BookOpen, Users } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

export default function AboutPage() {
  return (
    <>
      <PageHeader title="About StudyHub" description="StudyHub is a full education platform for browsing, enrolling, paying, and learning from structured course content." />
      <section className="container-page grid gap-5 py-8 md:grid-cols-3">
        {[
          ["Practical courses", BookOpen, "Course details, syllabi, instructors, and learning content are connected to the backend API."],
          ["Instructor-led learning", Users, "Instructor profiles and course ownership support a real education marketplace workflow."],
          ["Managed platform", Award, "Admins can manage users, categories, courses, instructors, enrollments, content, and payments."]
        ].map(([title, Icon, text]) => (
          <div className="card p-6" key={title}>
            <Icon className="h-8 w-8 text-teal-700" />
            <h2 className="mt-4 text-xl font-black text-slate-950">{title}</h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </section>
    </>
  );
}
