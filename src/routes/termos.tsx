import { createFileRoute, Link } from "@tanstack/react-router";
import { ContactEmail, LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/termos")({
  head: () => ({ meta: [{ title: `Termos de Uso — ${BRAND.name}` }] }),
  component: Terms,
});

function Terms() {
  return (
    <LegalPage title="Termos de Uso">
      <p>
        Ao acessar o {BRAND.name}, você concorda com estes termos. Se não concordar com algum ponto, não use o site.
      </p>

      <h2>1. Somente para maiores de 18 anos</h2>
      <p>
        Este site contém conteúdo adulto. Ao entrar, você declara ter pelo menos 18 anos (ou a maioridade legal no
        lugar onde mora) e que acessar esse tipo de conteúdo é permitido para você. Se você for menor de idade, saia
        imediatamente.
      </p>

      <h2>2. Conteúdo próprio</h2>
      <p>
        As prévias exclusivas publicadas pelo {BRAND.name} mostram apenas pessoas que tinham 18 anos ou mais no
        momento da gravação e que consentiram em ser filmadas e com a publicação.
      </p>

      <h2>3. Conteúdo de terceiros</h2>
      <p>
        Alguns vídeos são incorporados de outros sites (marcados como “via” o site de origem). Eles continuam
        hospedados e sendo exibidos pelo site de origem, e seus direitos pertencem aos respectivos donos. Removemos
        qualquer vídeo incorporado a pedido do titular dos direitos — veja a página de{" "}
        <Link to="/denuncia" className="text-[var(--color-accent-hi)] underline">
          denúncia e remoção
        </Link>
        .
      </p>

      <h2>4. Tolerância zero</h2>
      <p>Não aceitamos, em nenhuma hipótese:</p>
      <ul>
        <li>conteúdo envolvendo menores de 18 anos ou que sugira menoridade;</li>
        <li>conteúdo íntimo publicado sem o consentimento de quem aparece;</li>
        <li>violência real, coação ou qualquer ato sem consentimento;</li>
        <li>conteúdo que viole direitos autorais ou a lei brasileira.</li>
      </ul>
      <p>
        Conteúdo desse tipo é removido assim que identificado e, quando a lei exige, comunicado às autoridades.
      </p>

      <h2>5. Envio de vídeos</h2>
      <p>
        Ao enviar um vídeo pelo site, você declara ser o dono do conteúdo e que todas as pessoas nele eram maiores de
        18 anos e consentiram com a gravação e a publicação. Você é responsável pelo que envia.
      </p>

      <h2>6. Comunidade no Telegram</h2>
      <p>
        O acesso à comunidade privada acontece no Telegram, um serviço de terceiros com regras próprias. Valores,
        pagamentos e regras do grupo são informados lá antes da entrada.
      </p>

      <h2>7. Uso do site</h2>
      <ul>
        <li>O conteúdo é para uso pessoal; não copie, baixe ou redistribua sem autorização.</li>
        <li>Não tente burlar a verificação de idade nem prejudicar o funcionamento do site.</li>
      </ul>

      <h2>8. Limitação de responsabilidade</h2>
      <p>
        O site é oferecido “como está”. Não garantimos funcionamento ininterrupto e não respondemos por conteúdo ou
        serviços de sites de terceiros.
      </p>

      <h2>9. Alterações</h2>
      <p>Podemos atualizar estes termos. A data no topo desta página indica a versão em vigor.</p>

      <h2>10. Contato</h2>
      <p>
        Dúvidas sobre estes termos: <ContactEmail />.
      </p>
    </LegalPage>
  );
}
