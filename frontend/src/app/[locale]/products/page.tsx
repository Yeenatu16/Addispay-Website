import { PageContent } from "@/components/common/PageContent";

export default function ProductsPage({ params }: { params: { locale: string } }) {
  return (
    <PageContent
      title="Products"
      description="Explore our product and solution offerings."
    >
      <p className="text-sm text-slate-700">Locale: {params.locale}</p>
    </PageContent>
  );
}
