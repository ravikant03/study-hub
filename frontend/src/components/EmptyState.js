import { BookOpen } from "lucide-react";

export function EmptyState({ title = "Nothing here yet", message = "Check back after new data is added." }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 p-8 text-center">
      <BookOpen className="h-10 w-10 text-teal-700" />
      <h2 className="text-xl font-bold text-slate-900">{title}</h2>
      <p className="max-w-md text-sm text-slate-600">{message}</p>
    </div>
  );
}
