import Link from "next/link";

type Props = {
  title: string;
  subtitle?: string;
  back?: { href: string; label: string };
};

export function Header({ title, subtitle, back }: Props) {
  return (
    <header className="sticky top-0 z-20 bg-bg/95 backdrop-blur border-b border-border">
      <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
        {back ? (
          <Link href={back.href} className="text-muted hover:text-text text-sm">
            ← {back.label}
          </Link>
        ) : null}
        <div className="flex-1 min-w-0">
          <h1 className="text-base font-semibold truncate">{title}</h1>
          {subtitle ? <p className="text-xs text-muted truncate">{subtitle}</p> : null}
        </div>
      </div>
    </header>
  );
}
