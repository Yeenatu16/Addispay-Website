import { PageContent } from "@/components/common/PageContent";

export default function BusinessPage({ params }: { params: { locale: string } }) {
  return (
    <PageContent
      title="Business"
      description="Discover our business services and B2B solutions."
    >
      <p className="text-sm text-slate-700">Locale: {params.locale}</p>
    </PageContent>
  );
}
