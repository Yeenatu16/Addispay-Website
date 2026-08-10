import { PageContent } from "@/components/common/PageContent";

export default function CarrersPage({ params }: { params: { locale: string } }) {
  return (
    <PageContent
      title="Careers"
      description="Join our team and explore open positions."
    >
      <p className="text-sm text-slate-700">Locale: {params.locale}</p>
    </PageContent>
  );
}
