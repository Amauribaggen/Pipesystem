// Recebe os formulários do site (contato/cotação e envio de artigo) e envia por e-mail para info@,
// com o arquivo anexado, pelo Resend (https://resend.com). A chave fica na Vercel: RESEND_API_KEY.
// Os dados não são guardados aqui: a função só repassa a mensagem para o e-mail da PipeSystem.

const DESTINO = 'info@pipesystem.com.br';
const REMETENTE = 'Site PipeSystem <site@pipesystem.com.br>';
const MAX_ARQUIVO = 4 * 1024 * 1024;   // a Vercel aceita até 4,5 MB por envio
const TIPOS = /\.(pdf|docx?|xlsx?|csv|txt|jpe?g|png|webp)$/i;
const ROTULOS = {
  nome: 'Nome', email: 'E-mail', empresa: 'Empresa', telefone: 'Telefone', assunto: 'Assunto', mensagem: 'Mensagem',
  titulo: 'Título do artigo', autores: 'Autor(es)', link: 'Link', resumo: 'Resumo',
  autorizacao: 'Autorização de divulgação', privacidade: 'Aceite da Política de Privacidade',
};

const json = (status, body) => new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
const limpa = (s, max = 5000) => String(s ?? '').replace(/\r/g, '').trim().slice(0, max);

export async function POST(request) {
  const chave = process.env.RESEND_API_KEY;
  if (!chave) return json(500, { ok: false, erro: 'Envio não configurado.' });

  let dados;
  try { dados = await request.formData(); } catch { return json(400, { ok: false, erro: 'Formulário inválido.' }); }

  // Robôs preenchem o campo escondido: finge que deu certo e não envia nada
  if (limpa(dados.get('bot-field'))) return json(200, { ok: true });

  const tipo = limpa(dados.get('form-name'), 40) === 'artigo' ? 'artigo' : 'contato';
  const nome = limpa(dados.get('nome'), 200), email = limpa(dados.get('email'), 200);
  if (!nome || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json(400, { ok: false, erro: 'Informe nome e um e-mail válido.' });
  if (limpa(dados.get('privacidade')) !== 'sim') return json(400, { ok: false, erro: 'É preciso aceitar a Política de Privacidade.' });

  // Campos do texto do e-mail (tudo, menos o arquivo e os campos técnicos)
  const campos = [];
  for (const [k, v] of dados.entries()) {
    if (['arquivo', 'bot-field', 'form-name'].includes(k) || typeof v !== 'string') continue;
    const valor = limpa(v); if (!valor) continue;
    campos.push([ROTULOS[k] || k, valor]);
  }

  // Anexo (opcional)
  const attachments = [];
  const arq = dados.get('arquivo');
  if (arq && typeof arq === 'object' && arq.size > 0) {
    if (arq.size > MAX_ARQUIVO) return json(413, { ok: false, erro: 'O arquivo passa de 4 MB.' });
    if (!TIPOS.test(arq.name || '')) return json(415, { ok: false, erro: 'Tipo de arquivo não aceito.' });
    attachments.push({ filename: arq.name.replace(/[^\w.\- ()]/g, '_'), content: Buffer.from(await arq.arrayBuffer()).toString('base64') });
  }

  const assunto = tipo === 'artigo'
    ? `[Site] Artigo técnico: ${limpa(dados.get('titulo'), 150) || 'sem título'}`
    : `[Site] ${limpa(dados.get('assunto'), 150) || 'Contato'} — ${nome}`;
  const texto = campos.map(([k, v]) => `${k}: ${v}`).join('\n') + (attachments.length ? `\n\nArquivo anexado: ${attachments[0].filename}` : '');
  const html = `<h2 style="font-family:Arial,sans-serif;color:#0a2240">${esc(tipo === 'artigo' ? 'Novo artigo enviado pelo site' : 'Nova mensagem pelo site')}</h2>
<table style="font-family:Arial,sans-serif;font-size:14px;border-collapse:collapse">${campos.map(([k, v]) =>
    `<tr><th style="text-align:left;vertical-align:top;padding:6px 12px 6px 0;color:#5b6b80">${esc(k)}</th><td style="padding:6px 0;white-space:pre-wrap">${esc(v)}</td></tr>`).join('')}</table>
${attachments.length ? `<p style="font-family:Arial,sans-serif;font-size:14px">📎 Arquivo anexado: <b>${esc(attachments[0].filename)}</b></p>` : ''}
<p style="font-family:Arial,sans-serif;font-size:12px;color:#8a97a8">Responda este e-mail para falar direto com ${esc(nome)}.</p>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${chave}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: REMETENTE, to: [DESTINO], reply_to: email, subject: assunto, text: texto, html, attachments }),
  });
  if (!r.ok) {
    console.error('Resend', r.status, await r.text().catch(() => ''));
    return json(502, { ok: false, erro: 'Não foi possível enviar agora.' });
  }
  return json(200, { ok: true });
}
