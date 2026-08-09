import React, { useState, useEffect, useCallback } from 'react';
import {
  TrendingUp, TrendingDown, RefreshCw, Key, Eye, EyeOff,
  Search, X, BarChart2, Bitcoin, DollarSign, Globe,
  CheckCircle, Circle, ExternalLink, AlertTriangle
} from 'lucide-react';


const ENV_BRAPI = import.meta.env.VITE_BRAPI_KEY || '';

// Watchlist padrão
const DEFAULT_TICKERS = ['PETR4'];

const CRYPTO_IDS = [
  { id: 'bitcoin',       symbol: 'BTC', name: 'Bitcoin'  },
  { id: 'ethereum',      symbol: 'ETH', name: 'Ethereum' },
  { id: 'solana',        symbol: 'SOL', name: 'Solana'   },
  { id: 'binancecoin',   symbol: 'BNB', name: 'BNB'      },
];

// ─── helpers ───────────────────────────────────────────
const fmt = (v, decimals = 2) =>
  v == null ? '—' : Number(v).toLocaleString('pt-BR', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });

const fmtBRL = v =>
  v == null ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

function Delta({ value }) {
  if (value == null) return <span className="text-slate-500">—</span>;
  const pos = value >= 0;
  return (
    <span className={`flex items-center gap-1 text-xs font-semibold ${pos ? 'text-emerald-400' : 'text-rose-400'}`}>
      {pos ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
      {pos ? '+' : ''}{fmt(value)}%
    </span>
  );
}

// ─── Card de ação ──────────────────────────────────────
function StockCard({ stock, onRemove }) {
  const pos = (stock.regularMarketChangePercent ?? 0) >= 0;
  return (
    <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-5 flex flex-col gap-3 relative group hover:border-indigo-500/30 transition-colors">
      <button
        onClick={() => onRemove(stock.symbol)}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity text-slate-600 hover:text-rose-400"
      >
        <X size={14} />
      </button>
      <div className="flex justify-between items-start">
        <div>
          <span className="text-white font-bold text-sm">{stock.symbol}</span>
          <p className="text-slate-500 text-xs mt-0.5 truncate max-w-[120px]">{stock.shortName || stock.longName || '—'}</p>
        </div>
        <div className={`p-2 rounded-xl ${pos ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
          {pos ? <TrendingUp size={16} className="text-emerald-400" /> : <TrendingDown size={16} className="text-rose-400" />}
        </div>
      </div>
      <div>
        <div className="text-white font-bold text-xl font-mono">{fmtBRL(stock.regularMarketPrice)}</div>
        <div className="flex items-center gap-2 mt-1">
          <Delta value={stock.regularMarketChangePercent} />
          <span className="text-slate-600 text-xs">{stock.regularMarketChange >= 0 ? '+' : ''}{fmtBRL(stock.regularMarketChange)}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#1e293b]">
        <div>
          <div className="text-slate-600 text-[10px] uppercase tracking-wider">Mín.</div>
          <div className="text-slate-300 text-xs font-mono">{fmtBRL(stock.regularMarketDayLow)}</div>
        </div>
        <div>
          <div className="text-slate-600 text-[10px] uppercase tracking-wider">Máx.</div>
          <div className="text-slate-300 text-xs font-mono">{fmtBRL(stock.regularMarketDayHigh)}</div>
        </div>
      </div>
    </div>
  );
}

// ─── Card de cripto ────────────────────────────────────
function CryptoCard({ coin, data }) {
  if (!data) return (
    <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-5 animate-pulse h-32" />
  );
  const price  = data.brl;
  const change = data.brl_24h_change;
  const pos    = (change ?? 0) >= 0;
  return (
    <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-5 flex flex-col gap-3 hover:border-indigo-500/30 transition-colors">
      <div className="flex justify-between items-start">
        <div>
          <span className="text-white font-bold text-sm">{coin.symbol}</span>
          <p className="text-slate-500 text-xs mt-0.5">{coin.name}</p>
        </div>
        <div className={`p-2 rounded-xl ${pos ? 'bg-emerald-500/10' : 'bg-rose-500/10'}`}>
          <Bitcoin size={16} className={pos ? 'text-emerald-400' : 'text-rose-400'} />
        </div>
      </div>
      <div>
        <div className="text-white font-bold text-xl font-mono">{fmtBRL(price)}</div>
        <div className="mt-1"><Delta value={change} /></div>
      </div>
    </div>
  );
}

// ─── Passo a passo ────────────────────────────────────
function SetupStep({ num, done, children }) {
  return (
    <div className="flex gap-3 items-start">
      <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 text-xs font-bold mt-0.5 ${done ? 'bg-emerald-500/20 text-emerald-400' : 'bg-indigo-500/20 text-indigo-400'}`}>
        {done ? <CheckCircle size={14} /> : num}
      </div>
      <div className="text-xs text-slate-400 leading-relaxed">{children}</div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════
//  COMPONENTE PRINCIPAL
// ═══════════════════════════════════════════════════════
export default function Mercado() {
  // Config
  const [brapiKey, setBrapiKey]       = useState(ENV_BRAPI);
  const [keyDraft, setKeyDraft]       = useState('');
  const [showKey, setShowKey]         = useState(false);
  const [showConfig, setShowConfig]   = useState(!ENV_BRAPI);

  // Dados B3
  const [stocks, setStocks]           = useState([]);
  const [loadingStocks, setLoadingStocks] = useState(false);
  const [stockError, setStockError]   = useState(null);
  const [tickers, setTickers]         = useState(DEFAULT_TICKERS);
  const [searchTicker, setSearchTicker] = useState('');
  const [searching, setSearching]     = useState(false);
  const [searchError, setSearchError] = useState(null);

  // Dados cripto
  const [cryptoData, setCryptoData]   = useState(null);
  const [loadingCrypto, setLoadingCrypto] = useState(false);

  // Câmbio
  const [forex, setForex]             = useState(null);
  const [loadingForex, setLoadingForex] = useState(false);

  // Atualizado em
  const [lastUpdate, setLastUpdate]   = useState(null);

  // ── Fetch Ações B3 ──────────────────────────────────
  const fetchStocks = useCallback(async (key = brapiKey, list = tickers) => {
    if (!key || list.length === 0) return;
    setLoadingStocks(true);
    setStockError(null);
    try {
      const symbols = list.join(',');
      const res = await fetch(
        `https://brapi.dev/api/quote/${symbols}?token=${key}`
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || `Erro ${res.status}`);
      setStocks(data.results || []);
      setLastUpdate(new Date());
    } catch (e) {
      setStockError(e.message);
    } finally {
      setLoadingStocks(false);
    }
  }, [brapiKey, tickers]);

  // ── Fetch Cripto (sem chave) ───────────────────────
  const fetchCrypto = useCallback(async () => {
    setLoadingCrypto(true);
    try {
      const ids = CRYPTO_IDS.map(c => c.id).join(',');
      const res = await fetch(
        `https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=brl&include_24hr_change=true`
      );
      const data = await res.json();
      setCryptoData(data);
    } catch {
      // silencioso — cripto é complementar
    } finally {
      setLoadingCrypto(false);
    }
  }, []);

  // ── Fetch Câmbio (BRAPI) ────────────────────────────
  const fetchForex = useCallback(async (key = brapiKey) => {
    if (!key) return;
    setLoadingForex(true);
    try {
      const res = await fetch(
        `https://brapi.dev/api/v2/currency?currency=USD-BRL,EUR-BRL,BTC-BRL&token=${key}`
      );
      const data = await res.json();
      if (res.ok) setForex(data.currency || []);
    } catch {
      // silencioso
    } finally {
      setLoadingForex(false);
    }
  }, [brapiKey]);

  // ── Salvar configuração ─────────────────────────────
  const handleSaveConfig = () => {
    if (!keyDraft.trim()) return;
    const key = keyDraft.trim();
    setBrapiKey(key);
    setShowConfig(false);
    fetchStocks(key, tickers);
    fetchForex(key);
  };

  // ── Adicionar ticker ────────────────────────────────
  const handleAddTicker = async () => {
    const ticker = searchTicker.trim().toUpperCase();
    if (!ticker || tickers.includes(ticker)) return;
    setSearching(true);
    setSearchError(null);
    try {
      const res = await fetch(
        `https://brapi.dev/api/quote/${ticker}?token=${brapiKey}`
      );
      const data = await res.json();
      if (!res.ok || !data.results?.length) throw new Error('Ticker não encontrado.');
      setTickers(prev => [...prev, ticker]);
      setStocks(prev => [...prev, data.results[0]]);
      setSearchTicker('');
    } catch (e) {
      setSearchError(e.message);
    } finally {
      setSearching(false);
    }
  };

  const handleRemoveTicker = (symbol) => {
    setTickers(prev => prev.filter(t => t !== symbol));
    setStocks(prev => prev.filter(s => s.symbol !== symbol));
  };

  // ── Refresh geral ───────────────────────────────────
  const handleRefresh = () => {
    fetchStocks();
    fetchCrypto();
    fetchForex();
  };

  // ── Monta na primeira vez ───────────────────────────
  useEffect(() => {
    fetchCrypto();
    if (brapiKey) {
      fetchStocks(brapiKey, tickers);
      fetchForex(brapiKey);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Forex card ───────────────────────────────────
  const forexCard = (currency) => {
    if (!forex) return null;
    const item = forex.find(f => f.fromCurrency === currency);
    if (!item) return null;
    return (
      <div key={currency} className="bg-[#101623] border border-[#1e293b] rounded-2xl p-4 flex items-center justify-between">
        <div>
          <div className="text-slate-500 text-xs font-semibold uppercase tracking-wider mb-0.5">{currency} / BRL</div>
          <div className="text-white font-bold text-lg font-mono">{fmtBRL(item.regularMarketPrice)}</div>
        </div>
        <Delta value={item.regularMarketChangePercent} />
      </div>
    );
  };

  return (
    <div className="space-y-6">

      {/* ── HEADER ──────────────────────────────────── */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
            <BarChart2 className="text-indigo-400" size={28} /> Mercado
          </h1>
          <p className="text-slate-400 text-sm">
            Cotações em tempo real · B3, Cripto e Câmbio
            {lastUpdate && (
              <span className="ml-2 text-slate-600">
                · atualizado às {lastUpdate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleRefresh}
            disabled={loadingStocks}
            className="flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-xl border border-[#1e293b] bg-[#101623] text-slate-400 hover:text-white hover:border-slate-600 transition-colors disabled:opacity-40"
          >
            <RefreshCw size={13} className={loadingStocks ? 'animate-spin' : ''} />
            Atualizar
          </button>
          
            
           
          
        </div>
      </div>

      {/* ── PAINEL DE CONFIGURAÇÃO ───────────────────── */}
      {showConfig && (
        <div className="bg-[#101623] border border-indigo-500/25 rounded-2xl p-6 space-y-5">

          <div className="flex items-center justify-between">
            <p className="text-white font-bold text-sm flex items-center gap-2">
              <Key size={14} className="text-indigo-400" /> Configurar API do Mercado
            </p>
            <a href="https://brapi.dev" target="_blank" rel="noreferrer"
              className="text-indigo-400 text-xs flex items-center gap-1 hover:underline">
              brapi.dev <ExternalLink size={11} />
            </a>
          </div>

         

          {/* CoinGecko — sem chave */}
          <div className="bg-emerald-500/5 border border-emerald-500/15 rounded-xl p-4">
            <p className="text-emerald-400 text-xs font-bold flex items-center gap-2 mb-1">
              <CheckCircle size={13} /> CoinGecko — sem configuração necessária
            </p>
            <p className="text-slate-500 text-xs leading-relaxed">
              As cotações de criptomoedas usam a API pública do CoinGecko e já funcionam automaticamente, sem chave.
            </p>
          </div>

          {/* Input chave */}
          <div>
            <label className="text-xs text-slate-500 font-semibold mb-1.5 block">TOKEN BRAPI</label>
            <div className="relative">
              <input
                type={showKey ? 'text' : 'password'}
                value={keyDraft}
                onChange={e => setKeyDraft(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSaveConfig()}
                placeholder={brapiKey ? '••••••••••••••••••••' : 'Cole seu token aqui...'}
                className="w-full bg-[#070b14] border border-[#1e293b] text-white rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-indigo-500 transition-colors font-mono"
              />
              <button type="button" onClick={() => setShowKey(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors">
                {showKey ? <EyeOff size={14} /> : <Eye size={14} />}
              </button>
            </div>
          </div>

          <button
            onClick={handleSaveConfig}
            disabled={!keyDraft.trim()}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-sm font-bold rounded-xl transition-colors"
          >
            Salvar e carregar dados
          </button>
        </div>
      )}

      {/* ── CÂMBIO ──────────────────────────────────── */}
      {forex && forex.length > 0 && (
        <div>
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
            <Globe size={13} /> Câmbio
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {['USD', 'EUR', 'BTC'].map(c => forexCard(c))}
          </div>
        </div>
      )}

      {/* ── CRIPTOMOEDAS ────────────────────────────── */}
      <div>
        <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2">
          <Bitcoin size={13} /> Criptomoedas <span className="text-slate-600 font-normal normal-case">via CoinGecko</span>
        </h2>
        {loadingCrypto && !cryptoData ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CRYPTO_IDS.map(c => (
              <div key={c.id} className="bg-[#101623] border border-[#1e293b] rounded-2xl p-5 animate-pulse h-32" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {CRYPTO_IDS.map(coin => (
              <CryptoCard key={coin.id} coin={coin} data={cryptoData?.[coin.id]} />
            ))}
          </div>
        )}
      </div>

      {/* ── AÇÕES B3 ────────────────────────────────── */}
      <div>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-3">
          <h2 className="text-slate-400 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
            <TrendingUp size={13} /> Ações B3
           
          </h2>

          {/* Buscar ticker */}
          {brapiKey && (
            <div className="flex gap-2">
              <div className="relative">
                <input
                  type="text"
                  value={searchTicker}
                  onChange={e => setSearchTicker(e.target.value.toUpperCase())}
                  onKeyDown={e => e.key === 'Enter' && handleAddTicker()}
                  placeholder="Ex: MGLU3"
                  maxLength={6}
                  className="bg-[#101623] border border-[#1e293b] text-white rounded-xl pl-4 pr-10 py-2 text-xs focus:outline-none focus:border-indigo-500 transition-colors font-mono w-32"
                />
                <Search size={12} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-600" />
              </div>
              <button
                onClick={handleAddTicker}
                disabled={!searchTicker.trim() || searching}
                className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white text-xs font-bold rounded-xl transition-colors"
              >
                {searching ? 'Buscando...' : 'Adicionar'}
              </button>
            </div>
          )}
        </div>

        {searchError && (
          <div className="flex gap-2 items-center bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2 mb-3">
            <AlertTriangle size={13} className="text-rose-400" />
            <p className="text-rose-300 text-xs">{searchError}</p>
          </div>
        )}

        {stockError && (
          <div className="flex gap-2 items-center bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-2 mb-3">
            <AlertTriangle size={13} className="text-rose-400" />
            <p className="text-rose-300 text-xs">[API] {stockError}</p>
          </div>
        )}

        {loadingStocks && stocks.length === 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tickers.map(t => (
              <div key={t} className="bg-[#101623] border border-[#1e293b] rounded-2xl p-5 animate-pulse h-40" />
            ))}
          </div>
        ) : stocks.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {stocks.map(stock => (
              <StockCard key={stock.symbol} stock={stock} onRemove={handleRemoveTicker} />
            ))}
          </div>
        ) : brapiKey ? (
          <div className="bg-[#101623] border border-[#1e293b] rounded-2xl p-8 text-center">
            <p className="text-slate-500 text-sm">Nenhuma ação carregada.</p>
          </div>
        ) : null}
      </div>

      {/* ── NOTA DE RODAPÉ ──────────────────────────── */}
      <p className="text-center text-[11px] text-slate-600 pb-2">
        Dados fornecidos por BRAPI e CoinGecko · Apenas para fins educacionais · Não constitui recomendação de investimento
      </p>

    </div>
  );
}
