export function PageHeader({ eyebrow, title, description, actions }) {
  return (
    <section className="border-b border-slate-200 bg-white">
      <div className="container-page py-8 sm:py-10">
        {eyebrow ? <p className="mb-2 text-sm font-bold uppercase tracking-wide text-teal-700">{eyebrow}</p> : null}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <h1 className="max-w-3xl text-3xl font-black text-slate-950 sm:text-4xl">{title}</h1>
            {description ? <p className="mt-3 max-w-2xl text-base leading-7 text-slate-600">{description}</p> : null}
          </div>
          {actions ? <div className="flex flex-wrap gap-3">{actions}</div> : null}
        </div>
      </div>
    </section>
  );
}
