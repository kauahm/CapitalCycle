// ─────────────────────────────────────────────────────────────────────────────
//  Cliente da API do Pluggy (agregador Open Finance).
//
//  Configuração no .env da raiz:
//    VITE_PLUGGY_CLIENT_ID=...
//    VITE_PLUGGY_CLIENT_SECRET=...
//    VITE_PLUGGY_SANDBOX=true      ← mostra o "Pluggy Bank" de testes no widget
//
//  ATENÇÃO — decisão consciente do projeto: o clientSecret fica no frontend,
//  como já acontece com a chave do Gemini. Qualquer pessoa que abrir o
//  DevTools consegue lê-lo. A própria Pluggy recomenda guardá-lo num backend;
//  para o TCC (dados de sandbox) isso foi aceito. Antes de usar com dados
//  reais, mover `autenticar()` para uma Cloud Function.
//
//  A API libera CORS (Access-Control-Allow-Origin: *), então as chamadas
//  saem direto do navegador.
// ─────────────────────────────────────────────────────────────────────────────

const API = 'https://api.pluggy.ai';

const CLIENT_ID = import.meta.env.VITE_PLUGGY_CLIENT_ID || '';
const CLIENT_SECRET = import.meta.env.VITE_PLUGGY_CLIENT_SECRET || '';
export const PLUGGY_SANDBOX = import.meta.env.VITE_PLUGGY_SANDBOX === 'true';

export const pluggyConfigurado = () => Boolean(CLIENT_ID && CLIENT_SECRET);

// A apiKey vale 2 horas. Renovamos com 10 minutos de folga.
const VALIDADE_API_KEY_MS = 110 * 60 * 1000;
let cacheApiKey = null; // { valor, expiraEm }

async function autenticar() {
  if (cacheApiKey && Date.now() < cacheApiKey.expiraEm) return cacheApiKey.valor;
  if (!pluggyConfigurado()) {
    throw new Error('Open Finance não configurado: defina VITE_PLUGGY_CLIENT_ID e VITE_PLUGGY_CLIENT_SECRET no .env.');
  }

  const resp = await fetch(`${API}/auth`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ clientId: CLIENT_ID, clientSecret: CLIENT_SECRET }),
  });
  if (!resp.ok) throw new Error(`Falha ao autenticar no Pluggy (HTTP ${resp.status}).`);

  const { apiKey } = await resp.json();
  cacheApiKey = { valor: apiKey, expiraEm: Date.now() + VALIDADE_API_KEY_MS };
  return apiKey;
}

async function chamar(caminho, { method = 'GET', body } = {}) {
  const apiKey = await autenticar();
  const resp = await fetch(`${API}${caminho}`, {
    method,
    headers: { 'Content-Type': 'application/json', 'X-API-KEY': apiKey },
    body: body ? JSON.stringify(body) : undefined,
  });

  if (resp.status === 401) cacheApiKey = null; // força nova autenticação na próxima
  if (!resp.ok) {
    let detalhe = '';
    try { detalhe = (await resp.json())?.message || ''; } catch { /* corpo vazio */ }
    const erro = new Error(`Pluggy ${method} ${caminho.split('?')[0]} falhou (HTTP ${resp.status}) ${detalhe}`.trim());
    erro.status = resp.status;
    throw erro;
  }
  return resp.status === 204 ? null : resp.json();
}

/** Token de 30 min usado pelo widget Pluggy Connect. */
export async function criarConnectToken({ clientUserId, itemId } = {}) {
  const body = { options: { clientUserId, avoidDuplicates: true } };
  if (itemId) body.itemId = itemId;
  const { accessToken } = await chamar('/connect_token', { method: 'POST', body });
  return accessToken;
}

export const buscarItem = (itemId) => chamar(`/items/${itemId}`);

/** Pede ao banco dados novos. A coleta é assíncrona: acompanhe com buscarItem.
 *
 *  O Pluggy aceita no máximo um pedido por item a cada hora e responde 409
 *  antes disso. Nesse caso não é erro para quem usa: a sincronização segue
 *  com os dados que o Pluggy já coletou. Devolve false quando foi limitado. */
export async function atualizarItem(itemId) {
  try {
    await chamar(`/items/${itemId}`, { method: 'PATCH', body: {} });
    return true;
  } catch (erro) {
    if (erro.status === 409) return false;
    throw erro;
  }
}

export const excluirItem = (itemId) => chamar(`/items/${itemId}`, { method: 'DELETE' });

export async function listarContas(itemId) {
  const { results } = await chamar(`/accounts?itemId=${encodeURIComponent(itemId)}`);
  return results || [];
}

/** Todas as transações da conta no período, seguindo o cursor da v2. */
export async function listarTransacoes(accountId, { dateFrom } = {}) {
  const params = new URLSearchParams({ accountId });
  if (dateFrom) params.set('dateFrom', dateFrom);

  const todas = [];
  let caminho = `/v2/transactions?${params}`;
  // Teto de páginas como proteção contra loop caso a API repita o cursor.
  for (let pagina = 0; caminho && pagina < 20; pagina++) {
    const { results, next } = await chamar(caminho);
    todas.push(...(results || []));
    caminho = next ? `/v2/transactions${next}` : null;
  }
  return todas;
}

/** Espera o item sair de UPDATING (após conectar ou atualizar). */
export async function aguardarItemPronto(itemId, { tentativas = 20, intervaloMs = 3000 } = {}) {
  for (let i = 0; i < tentativas; i++) {
    const item = await buscarItem(itemId);
    if (item.status !== 'UPDATING') return item;
    await new Promise((r) => setTimeout(r, intervaloMs));
  }
  return buscarItem(itemId);
}
