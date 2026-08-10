import { PageContent } from "@/components/common/PageContent";

export default function ContactusPage({ params }: { params: { locale: string } }) {
  return (
    <PageContent
      title="Contact Us"
      description="Find the best way to contact AddisPay."
    >
      <p className="text-sm text-slate-700">Locale: {params.locale}</p>
    </PageContent>
  );
}
