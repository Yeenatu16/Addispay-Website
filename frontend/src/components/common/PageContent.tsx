import type { ReactNode } from "react";

type PageContentProps = {
  title: string;
  description: string;
  children?: ReactNode;
};

export function PageContent({ title, description, children }: PageContentProps) {
  return (
    <section className="mx-auto max-w-6xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">{title}</h1>
        <p className="mt-3 text-lg leading-8 text-slate-600">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </section>
  );
}
