import { PageContent } from "@/components/common/PageContent";

export default function BlogsPage({ params }: { params: { locale: string } }) {
  return (
    <PageContent
      title="Blogs"
      description="Read the latest blog posts from AddisPay."
    >
      <p className="text-sm text-slate-700">Locale: {params.locale}</p>
    </PageContent>
  );
}
