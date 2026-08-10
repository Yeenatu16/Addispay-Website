import { PageContent } from "@/components/common/PageContent";

export default function AboutusPage({ params }: { params: { locale: string } }) {
  return (
    <PageContent
      title="About Us"
      description="Learn more about AddisPay and our mission."
    >
      <p className="text-sm text-slate-700">Locale: {params.locale}</p>
    </PageContent>
  );
}
