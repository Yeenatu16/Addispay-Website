import { PageContent } from "@/components/common/PageContent";

export default function HomePage({ params }: { params: { locale: string } }) {
  return (
    <PageContent
      title="Home"
      description="Welcome to the AddisPay home page."
    >
      <p className="text-sm text-slate-700">Locale: {params.locale}</p>
    </PageContent>
  );
}
