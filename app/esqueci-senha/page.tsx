import { AuthShell } from "@/components/AuthShell";
import { EsqueciSenhaForm } from "./EsqueciSenhaForm";

export default function EsqueciSenhaPage() {
  return (
    <AuthShell subtitulo="Recupere o acesso à sua conta">
      <EsqueciSenhaForm />
    </AuthShell>
  );
}
