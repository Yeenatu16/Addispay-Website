import { PageContent } from "@/components/common/PageContent";

export default function NewsPage({ params }: { params: { locale: string } }) {
  return (
    <PageContent
      title="News"
      description="Read the latest news and updates."
    >
      <p className="text-sm text-slate-700">Locale: {params.locale}</p>
    </PageContent>
  );
}
