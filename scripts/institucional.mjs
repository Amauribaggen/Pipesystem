// Páginas institucionais: Política de Privacidade (LGPD) e Termos de Uso.
// Dados da empresa num só lugar: ao preencher CNPJ e endereço aqui, eles aparecem nas duas páginas
// (o rodapé da página inicial fica em site/index.html).
export const EMPRESA = {
  razao: 'PipeSystem Serviços de Consultoria Ltda.',
  cnpj: '66.598.446/0001-78',
  endereco: 'Itajaí/SC',
  email: 'info@pipesystem.com.br',
  whatsapp: '+55 (47) 98802-7372',
  whatsappUrl: 'https://wa.me/5547988027372',
};
export const ATUALIZADO = '22 de outubro de 2026';

// sem ponto final, porque as frases das páginas já terminam com ponto
const identificacao = () => [EMPRESA.razao, EMPRESA.cnpj && `CNPJ ${EMPRESA.cnpj}`, EMPRESA.endereco].filter(Boolean).join(' · ').replace(/\.$/, '');
const contato = () => `<a href="mailto:${EMPRESA.email}">${EMPRESA.email}</a> ou WhatsApp <a href="${EMPRESA.whatsappUrl}" target="_blank" rel="noopener noreferrer">${EMPRESA.whatsapp}</a>`;
const sec = (titulo, html) => `      <h2 class="page__h">${titulo}</h2>\n      ${html}`;
const ul = itens => `<ul class="inst__list">${itens.map(i => `<li>${i}</li>`).join('')}</ul>`;

export function institutionalPages() {
  const privacidade = {
    url: '/privacidade',
    title: 'Política de Privacidade | PipeSystem',
    description: 'Como a PipeSystem coleta, usa, compartilha e protege dados pessoais, conforme a Lei Geral de Proteção de Dados (LGPD).',
    h1: 'Política de Privacidade',
    body: [
      `<p class="sheet__desc page__lead">Esta política explica quais dados pessoais o portal PipeSystem coleta, para que usa, com quem compartilha e como você pode exercer seus direitos, conforme a Lei Geral de Proteção de Dados Pessoais (Lei nº 13.709/2018 — LGPD).</p>`,
      sec('1. Quem é o responsável pelos seus dados', `<p>O controlador dos dados é a ${identificacao()}. Para qualquer assunto sobre privacidade, inclusive falar com o encarregado pelo tratamento de dados, use ${contato()}.</p>`),
      sec('2. Quais dados coletamos', ul([
        '<b>Dados que você nos envia:</b> nome, e-mail, telefone, empresa, cidade, mensagem e arquivos anexados nos formulários de contato, cotação, cadastro e envio de artigos, ou quando você fala conosco por e-mail ou WhatsApp. Hoje os formulários abrem o seu programa de e-mail com a mensagem pronta: os dados só chegam até nós quando você envia o e-mail.',
        '<b>Medição de audiência sem cookies:</b> usamos o Vercel Web Analytics, que registra de forma agregada as páginas visitadas, a página de origem, o país, o tipo de dispositivo e o navegador. Ele não usa cookies e não identifica quem você é.',
        '<b>Registros técnicos da hospedagem:</b> o provedor do site (Vercel) registra dados como endereço IP, data e hora de acesso, por segurança e para o funcionamento do site.',
        '<b>Armazenamento no navegador:</b> guardamos, só durante a visita, a informação de que a vinheta de abertura já foi exibida. Se você escolher a versão em inglês, o site grava o cookie <code>googtrans</code> e carrega o tradutor do Google, um serviço de terceiros sujeito à política de privacidade do Google.',
        'O <b>Dimensionamento Inteligente</b> e as calculadoras funcionam no seu navegador: os dados do empreendimento não são enviados para nós, a menos que você os inclua num pedido de cotação.',
      ])),
      sec('3. Para que usamos os dados', ul([
        'Responder contatos, dúvidas técnicas e pedidos de consultoria.',
        'Preparar cotações e, <b>quando você pede uma cotação</b>, encaminhar a sua solicitação aos fornecedores e distribuidores parceiros que vão enviar propostas.',
        'Avaliar e publicar artigos técnicos enviados, sempre com o crédito ao autor.',
        'Enviar novidades e comunicações, somente se você autorizar; você pode cancelar a qualquer momento.',
        'Melhorar o conteúdo e o funcionamento do site, com dados de audiência anônimos.',
        'Cumprir obrigações legais e regulatórias e exercer direitos em processos.',
      ]) + `<p>As bases legais são: o seu consentimento; os procedimentos preliminares a um contrato que você solicitou (como uma cotação); o nosso legítimo interesse em manter e melhorar o portal, sempre respeitando os seus direitos; e o cumprimento de obrigação legal.</p>`),
      sec('4. Com quem compartilhamos', ul([
        '<b>Fornecedores e distribuidores parceiros</b>, apenas para atender ao pedido de cotação que você fez.',
        '<b>Prestadores de serviço</b> que operam o site e o e-mail (hospedagem e encaminhamento de mensagens), que só podem usar os dados para prestar o serviço.',
        '<b>Autoridades</b>, quando houver obrigação legal ou ordem judicial.',
      ]) + `<p><b>Não vendemos dados pessoais.</b> Alguns desses prestadores, como a Vercel, ficam fora do Brasil; nesses casos a transferência segue as garantias previstas na LGPD.</p>`),
      sec('5. Por quanto tempo guardamos', `<p>Pelo tempo necessário para a finalidade que motivou a coleta e para cumprir obrigações legais. Depois disso, os dados são excluídos ou anonimizados.</p>`),
      sec('6. Seus direitos', ul([
        'Confirmar se tratamos dados seus e acessá-los.',
        'Corrigir dados incompletos, inexatos ou desatualizados.',
        'Pedir a anonimização, o bloqueio ou a eliminação de dados desnecessários ou tratados em desconformidade com a lei.',
        'Pedir a portabilidade dos dados e saber com quem eles foram compartilhados.',
        'Revogar o consentimento e pedir a eliminação dos dados tratados com base nele.',
      ]) + `<p>Para exercer qualquer direito, escreva para ${contato()}. Respondemos em até 15 dias. Você também pode reclamar à Autoridade Nacional de Proteção de Dados (<a href="https://www.gov.br/anpd" target="_blank" rel="noopener noreferrer">ANPD</a>).</p>`),
      sec('7. Segurança', `<p>O site usa conexão criptografada (HTTPS) e adotamos medidas técnicas e administrativas para proteger os dados contra acessos não autorizados, perda ou alteração.</p>`),
      sec('8. Público do site', `<p>O portal é voltado a profissionais e empresas do setor. Não coletamos de propósito dados de menores de 18 anos.</p>`),
      sec('9. Alterações desta política', `<p>Esta política pode ser atualizada. A data da última atualização fica sempre no fim desta página.</p>`),
    ],
  };

  const termos = {
    url: '/termos',
    title: 'Termos de Uso | PipeSystem',
    description: 'Regras de uso do portal PipeSystem: conteúdo técnico orientativo, cotações, publicidade identificada, envio de conteúdo e propriedade intelectual.',
    h1: 'Termos de Uso',
    body: [
      `<p class="sheet__desc page__lead">Ao usar o portal PipeSystem, você concorda com estes termos. Se não concordar, por favor, não use o site.</p>`,
      sec('1. O que é o PipeSystem', `<p>Portal de informação técnica, ferramentas de cálculo, consultoria e intermediação de negócios para o setor de hidráulica e condução de fluidos, mantido pela ${identificacao()}.</p>`),
      sec('2. Conteúdo técnico é orientativo', ul([
        'As fichas, os esquemas, as calculadoras e o Dimensionamento Inteligente dão <b>resultados indicativos</b> e não substituem o projeto feito por profissional habilitado, com a respectiva ART ou RRT.',
        'As normas técnicas são citadas como referência. Confira sempre a versão vigente no site oficial da entidade que a publica (ABNT, ISO, ASME, NFPA e outras).',
        'Revisamos o conteúdo com cuidado, mas ele pode conter erros ou ficar desatualizado. Se encontrar algum problema, avise-nos pelo contato.',
      ])),
      sec('3. Fabricantes, preços e cotações', ul([
        'As listas de fabricantes e importadores são <b>indicativas e sem vínculo comercial</b>, salvo quando identificadas como patrocinadas.',
        'Preços de referência (como o SINAPI) são estimativas. As cotações são propostas dos próprios fornecedores, que respondem por preços, prazos, garantia e entrega.',
        'A PipeSystem não é parte da compra e venda entre você e o fornecedor, a não ser que isso seja contratado de forma expressa.',
      ])),
      sec('4. Publicidade e conteúdo patrocinado', `<p>Anúncios e conteúdos pagos são sempre identificados como <b>"Patrocinado"</b> ou <b>"Espaço publicitário"</b>. Anunciantes não alteram as fichas técnicas nem a ordem das listas editoriais. O anunciante é responsável pelas informações do seu anúncio.</p>`),
      sec('5. Conteúdo que você envia', `<p>Ao enviar artigos, fotos ou arquivos, você declara ter os direitos sobre eles e autoriza a PipeSystem, sem exclusividade e sem custo, a publicá-los no portal com o crédito ao autor. Podemos recusar ou retirar conteúdos a nosso critério.</p>`),
      sec('6. Propriedade intelectual', ul([
        'Os textos, esquemas, ilustrações, ferramentas e a marca PipeSystem pertencem à PipeSystem. Você pode citá-los indicando a fonte e o link; outras reproduções dependem de autorização.',
        'As fotos de terceiros são usadas sob licenças livres (Creative Commons ou domínio público), com os créditos indicados junto a cada imagem.',
        'Os textos das normas técnicas pertencem às entidades que as publicam.',
      ])),
      sec('7. Links para outros sites', `<p>O portal tem links para sites de fabricantes, entidades e ferramentas. Não controlamos esses sites e não respondemos pelo conteúdo nem pelas práticas de privacidade deles.</p>`),
      sec('8. Uso proibido', ul([
        'Copiar o conteúdo em massa ou por meios automatizados para republicação.',
        'Enviar conteúdo falso, ofensivo, ilegal ou que viole direitos de terceiros.',
        'Tentar prejudicar o funcionamento ou a segurança do site.',
      ])),
      sec('9. Responsabilidade', `<p>A PipeSystem não responde por decisões de projeto, compra ou instalação tomadas apenas com base no conteúdo do portal, nem por indisponibilidades temporárias do site.</p>`),
      sec('10. Alterações e lei aplicável', `<p>Estes termos podem ser atualizados a qualquer momento. Aplica-se a legislação brasileira, e fica eleito o foro da comarca da sede da PipeSystem.</p>`),
      sec('11. Contato', `<p>${contato()}. Veja também a nossa <a href="/privacidade">Política de Privacidade</a>.</p>`),
    ],
  };

  const editorial = {
    url: '/politica-editorial',
    title: 'Política Editorial | PipeSystem',
    description: 'Como a Equipe Técnica PipeSystem produz, revisa e atualiza o conteúdo técnico do portal, com independência em relação a anunciantes e fabricantes.',
    h1: 'Política Editorial',
    body: [
      `<p class="sheet__desc page__lead">O PipeSystem existe para ser uma fonte técnica confiável e independente sobre hidráulica e condução de fluidos. Esta política explica como o conteúdo é produzido, revisado e atualizado, e como separamos informação técnica de interesses comerciais.</p>`,
      sec('1. Quem produz e revisa', ul([
        'As fichas de sistemas e do catálogo, os esquemas e as ferramentas são preparados e revisados pela <b>Equipe Técnica PipeSystem</b>.',
        'Cada ficha mostra o selo <b>"Revisado pela Equipe Técnica PipeSystem"</b> com o mês da última atualização.',
        'Artigos de autores convidados ou enviados por leitores trazem sempre o nome do autor e a fonte original.',
        'Ferramentas digitais podem apoiar a pesquisa e a redação, mas nenhum conteúdo técnico é publicado sem a revisão da Equipe Técnica.',
      ])),
      sec('2. Fontes', ul([
        'Normas técnicas vigentes (ABNT, ISO, ASME, NFPA, ASTM, DIN e outras), sempre citadas com link para o site oficial da entidade.',
        'Catálogos e manuais técnicos de fabricantes, literatura técnica e publicações de entidades do setor.',
        'Experiência prática de projeto, instalação e manutenção da equipe e dos consultores.',
      ])),
      sec('3. Como revisamos e atualizamos', ul([
        'Antes de publicar, conferimos dados técnicos, unidades, normas citadas e links.',
        'Revisamos as fichas pelo menos uma vez por ano e sempre que uma norma importante é publicada, revisada ou cancelada.',
        'Normas canceladas ou substituídas são retiradas ou atualizadas, e a data no selo da ficha muda.',
        'Fotos de terceiros são usadas somente com licença livre e com o crédito ao autor.',
      ])),
      sec('4. Independência em relação a anunciantes e fabricantes', ul([
        'Anunciantes e patrocinadores <b>não alteram</b> o conteúdo das fichas, as normas citadas, os resultados das ferramentas nem a ordem das listas editoriais.',
        'As listas de fabricantes e importadores seguem critérios técnicos e de presença no mercado brasileiro, sem pagamento para entrar.',
        'Todo anúncio ou conteúdo pago é identificado como <b>"Patrocinado"</b> ou <b>"Espaço publicitário"</b> e fica separado do conteúdo técnico.',
        'Quando uma empresa contratar um perfil ou destaque, isso será sempre identificado, nunca misturado ao conteúdo editorial.',
      ])),
      sec('5. Limites do conteúdo', `<p>O conteúdo é orientativo e não substitui o projeto feito por profissional habilitado, com ART ou RRT, nem a leitura da norma completa. Veja os <a href="/termos">Termos de Uso</a>.</p>`),
      sec('6. Correções', `<p>Encontrou um erro, uma norma desatualizada ou uma informação incompleta? Avise por ${contato()}. Analisamos todas as mensagens e, quando procedente, corrigimos a ficha e atualizamos a data de revisão.</p>`),
    ],
  };

  return [editorial, privacidade, termos].map(p => ({
    ...p,
    body: `      <div class="sheet__head"><div><p class="eyebrow">Institucional</p><h1 id="sheetTitle" class="page__title">${p.h1}</h1></div></div>
${p.body.join('\n')}
      <p class="inst__date">Última atualização: ${ATUALIZADO}.</p>`,
  }));
}
