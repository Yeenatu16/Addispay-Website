import Link from "next/link";
import { localeLabels } from "@/lib/locales";

type SiteHeaderProps = {
  locale: string;
};

const navItems = [
  { label: "Home", href: "home" },
  { label: "About", href: "aboutus" },
  { label: "News", href: "news" },
  { label: "Products", href: "products" },
  { label: "Business", href: "business" },
  { label: "Careers", href: "carrers" },
  { label: "Blogs", href: "blogs" },
  { label: "Contact", href: "contactus" },
];

export function SiteHeader({ locale }: SiteHeaderProps) {
  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur-lg">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-4">
        <div>
          <Link href={`/${locale}/home`} className="text-xl font-semibold text-slate-900">
            AddisPay
          </Link>
          <p className="text-sm text-slate-500">{localeLabels[locale as keyof typeof localeLabels]}</p>
        </div>

        <nav className="flex flex-wrap items-center gap-3 text-sm text-slate-700">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={`/${locale}/${item.href}`}
              className="rounded-md px-3 py-2 transition hover:bg-slate-100"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
