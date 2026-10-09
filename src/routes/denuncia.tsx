import { createFileRoute } from "@tanstack/react-router";
import { ContactEmail, LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/denuncia")({
  head: () => ({ meta: [{ title: `Denúncia e Remoção — ${BRAND.name}` }] }),
  component: Report,
});

function Report() {
  return (
    <LegalPage title="Denúncia e Remoção">
      <p>
        Se algum conteúdo no {BRAND.name} viola a lei, seus direitos ou estes termos, avise-nos. Analisamos toda
        denúncia e removemos o que for irregular.
      </p>

      <h2>O que você pode denunciar</h2>
      <ul>
        <li>
          <strong>Menores de idade:</strong> qualquer conteúdo que envolva ou sugira pessoas com menos de 18 anos.
          Prioridade máxima: removemos imediatamente e comunicamos às autoridades.
        </li>
        <li>
          <strong>Sem consentimento:</strong> conteúdo íntimo publicado sem a autorização de quem aparece, incluindo
          montagens e deepfakes.
        </li>
        <li>
          <strong>Direitos autorais:</strong> conteúdo seu publicado ou incorporado sem permissão (Lei nº 9.610/1998).
        </li>
        <li>
          <strong>Outros problemas:</strong> qualquer conteúdo ilegal ou que viole nossos termos.
        </li>
      </ul>

      <h2>Como denunciar</h2>
      <p>
        Envie um e-mail para <ContactEmail /> com:
      </p>
      <ul>
        <li>o link da página do vídeo no {BRAND.name};</li>
        <li>o motivo da denúncia;</li>
        <li>
          em pedidos de direitos autorais: seu nome, prova de que você é o titular (ou o representa) e onde está o
          original;
        </li>
        <li>uma forma de contato para retorno, se quiser resposta.</li>
      </ul>
      <p>Você pode denunciar anonimamente; nesse caso, apenas não conseguiremos responder.</p>

      <h2>Prazos</h2>
      <ul>
        <li>Conteúdo envolvendo menores: removido imediatamente após o recebimento.</li>
        <li>Conteúdo sem consentimento: removido em até 24 horas.</li>
        <li>Demais pedidos: analisados em até 48 horas.</li>
      </ul>

      <h2>Canais oficiais</h2>
      <p>
        Você também pode denunciar crimes na internet diretamente à{" "}
        <a
          href="https://new.safernet.org.br/denuncie"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--color-accent-hi)] underline"
        >
          SaferNet Brasil
        </a>{" "}
        ou pelo Disque 100.
      </p>
    </LegalPage>
  );
}
