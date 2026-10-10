import { EloMark } from "@/components/EloMark";

export function AuthShell({ subtitulo, children }: { subtitulo: string; children: React.ReactNode }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-navy p-6">
      <div className="flex w-full max-w-[380px] flex-col overflow-hidden rounded-[28px] bg-off-white shadow-2xl">
        <div className="flex flex-col items-center gap-3.5 bg-gradient-to-br from-navy to-navy-2 px-8 pb-10 pt-14">
          <EloMark size={52} />
          <h1 className="font-serif text-[28px] font-semibold tracking-wide text-off-white">Elo</h1>
          <p className="max-w-[240px] text-center text-[12.5px] leading-relaxed text-off-white/60">{subtitulo}</p>
        </div>
        <div className="flex flex-1 flex-col gap-4 px-7 py-9">{children}</div>
      </div>
    </main>
  );
}
