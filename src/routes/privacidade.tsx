import { createFileRoute } from "@tanstack/react-router";
import { ContactEmail, LegalPage } from "@/components/legal-page";
import { BRAND } from "@/lib/brand";

export const Route = createFileRoute("/privacidade")({
  head: () => ({ meta: [{ title: `Política de Privacidade — ${BRAND.name}` }] }),
  component: Privacy,
});

function Privacy() {
  return (
    <LegalPage title="Política de Privacidade">
      <p>
        Esta política explica quais dados o {BRAND.name} trata e por quê, de acordo com a Lei Geral de Proteção de
        Dados (LGPD, Lei nº 13.709/2018).
      </p>

      <h2>1. Não pedimos cadastro</h2>
      <p>O site não tem contas de usuário. Não pedimos nome, e-mail, documento ou dados de pagamento.</p>

      <h2>2. Dados guardados no seu navegador</h2>
      <ul>
        <li>
          <strong>Confirmação de idade:</strong> lembramos que você confirmou ter 18 anos ou mais, para não perguntar
          de novo.
        </li>
        <li>
          <strong>Vídeos enviados:</strong> arquivos enviados pela página de envio ficam somente no seu navegador e não
          são transmitidos para nós.
        </li>
      </ul>
      <p>Você pode apagar esses dados a qualquer momento limpando os dados do site no seu navegador.</p>

      <h2>3. Registros técnicos</h2>
      <p>
        Como qualquer site, nossos provedores de hospedagem e de vídeo registram dados técnicos das visitas (como
        endereço IP, navegador e horário) para entregar as páginas e proteger o serviço contra abusos.
      </p>

      <h2>4. Serviços de terceiros</h2>
      <ul>
        <li>
          <strong>Vídeos incorporados:</strong> vídeos marcados como “via” outro site são exibidos pelo player desse
          site, que pode usar cookies e coletar dados conforme a política de privacidade dele.
        </li>
        <li>
          <strong>Links externos:</strong> ao clicar para entrar na comunidade, você sai do {BRAND.name} e passa a usar
          serviços de terceiros (como Beacons e Telegram), sujeitos às políticas deles.
        </li>
      </ul>

      <h2>5. O que não fazemos</h2>
      <p>Não vendemos nem compartilhamos dados pessoais com anunciantes.</p>

      <h2>6. Seus direitos</h2>
      <p>
        Pela LGPD, você pode pedir confirmação de tratamento, acesso, correção ou exclusão dos seus dados, entre
        outros direitos. Envie seu pedido para <ContactEmail />.
      </p>

      <h2>7. Alterações</h2>
      <p>Podemos atualizar esta política. A data no topo indica a versão em vigor.</p>
    </LegalPage>
  );
}
