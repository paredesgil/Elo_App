import { EloMark } from "./EloMark";
import { BackButton } from "./BackButton";

export function PageHeader({
  title,
  subtitle,
  comVoltar = false,
}: {
  title: string;
  subtitle?: string;
  comVoltar?: boolean;
}) {
  return (
    <header className="relative bg-gradient-to-br from-navy to-navy-2 px-6 pb-7 pt-12">
      {comVoltar && <BackButton light />}
      <div className={`flex items-center gap-3 ${comVoltar ? "mt-8" : ""}`}>
        <EloMark size={34} />
        <div>
          <h1 className="font-serif text-lg font-semibold text-off-white">{title}</h1>
          {subtitle && <p className="mt-0.5 text-xs text-off-white/60">{subtitle}</p>}
        </div>
      </div>
    </header>
  );
}
