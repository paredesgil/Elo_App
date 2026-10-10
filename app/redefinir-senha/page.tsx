import { AuthShell } from "@/components/AuthShell";
import { RedefinirSenhaForm } from "./RedefinirSenhaForm";

export default function RedefinirSenhaPage() {
  return (
    <AuthShell subtitulo="Crie uma nova senha para sua conta">
      <RedefinirSenhaForm />
    </AuthShell>
  );
}
