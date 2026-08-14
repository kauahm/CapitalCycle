import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  ArrowLeft, Check, Copy, CreditCard, QrCode,
  ShieldCheck, Lock, Clock, X, User
} from 'lucide-react';
import Toast from '../components/ui/Toast';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { useAuth } from '../hooks/useAuth';

// ─── Planos espelhados do Register (cobrança anual) ─────────────────────────
const PLANS = {
  jovem:  { id: 'jovem',  name: 'Jovem',  price: 44.90, priceStr: '44,90' },
  adulto: { id: 'adulto', name: 'Adulto', price: 64.90, priceStr: '64,90' },
};

// Tempo de expiração do QR Code PIX (em segundos) — só simulação
const PIX_EXPIRATION_SECONDS = 300;

// Gera um identificador de transação visualmente realista
const generateTxId = () => {
  const ts = Date.now().toString(36).toUpperCase();
  const rnd = Math.random().toString(36).slice(2, 8).toUpperCase();
  return `TX-${ts}-${rnd}`;
};

// Constrói um payload PIX no padrão BR Code (apenas visual, não é um PIX real válido)
const buildPixPayload = ({ txid, amount, beneficiary = 'CAPITALCYCLE TCC' }) => {
  // Não é um BR Code válido — apenas um texto visual que "lembra" um PIX Copia/Cola.
  return [
    '00020126',
    '580014br.gov.bcb.pix',
    `0114+5511999999999`,
    `0220Pagamento ${beneficiary}`,
    `52040000`,
    `5303986`,
    `54${String(amount.toFixed(2).length).padStart(2, '0')}${amount.toFixed(2)}`,
    '5802BR',
    '5913CAPITALCYCLE',
    '6008SAOPAULO',
    `62${String(txid.length + 4).padStart(2, '0')}05${String(txid.length).padStart(2, '0')}${txid}`,
    '6304ABCD',
  ].join('').toUpperCase();
};

// Componente visual de QR Code (matriz simulada com base no hash do payload)
const FakeQRCode = ({ payload, size = 200 }) => {
  // Gera uma grade 25x25 com base no payload para parecer um QR real.
  const cells = 25;
  const grid = [];
  let seed = 0;
  for (let i = 0; i < payload.length; i++) seed = (seed * 31 + payload.charCodeAt(i)) & 0xffffffff;

  for (let y = 0; y < cells; y++) {
    const row = [];
    for (let x = 0; x < cells; x++) {
      const h = (Math.sin((x + 1) * (y + 1) + seed) * 10000) % 1;
      row.push(Math.abs(h) > 0.5 ? 1 : 0);
    }
    grid.push(row);
  }

  // Cantos de posicionamento (padrão QR Code)
  const isFinder = (x, y) => {
    const inBox = (cx, cy) => x >= cx && x < cx + 7 && y >= cy && y < cy + 7;
    const border = (cx, cy) => {
      if (!inBox(cx, cy)) return false;
      const lx = x - cx, ly = y - cy;
      const onEdge = lx === 0 || lx === 6 || ly === 0 || ly === 6;
      const inner = lx >= 2 && lx <= 4 && ly >= 2 && ly <= 4;
      return onEdge || inner;
    };
    return border(0, 0) || border(cells - 7, 0) || border(0, cells - 7);
  };

  const cellSize = size / cells;

  return (
    <div
      className="bg-white p-3 rounded-2xl shadow-lg border border-slate-200"
      style={{ width: size + 24, height: size + 24 }}
    >
      <svg width={size} height={size} viewBox={`0 0 ${cells} ${cells}`} className="block">
        {grid.map((row, y) =>
          row.map((v, x) => {
            const filled = isFinder(x, y) || (grid[y][x] && !isFinder(x, y) && !(x < 8 && y > cells - 9) && !(x > cells - 9 && y < 8));
            return filled ? (
              <rect key={`${x}-${y}`} x={x} y={y} width={1} height={1} fill="#0f172a" />
            ) : null;
          })
        )}
      </svg>
    </div>
  );
};

// Formata valor monetário em BRL
const fmtBRL = (v) =>
  v == null ? '—' : Number(v).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

// Formata número de cartão
const formatCardNumber = (v) => v.replace(/\D/g, '').slice(0, 19).replace(/(\d{4})(?=\d)/g, '$1 ').trim();
const formatExpiry = (v) => {
  const d = v.replace(/\D/g, '').slice(0, 4);
  if (d.length < 3) return d;
  return `${d.slice(0, 2)}/${d.slice(2)}`;
};

// ─── Card de método de pagamento (etapa de seleção) ───────────────────────────
function MetodoCard({ selecionado, onSelecionar, Icone, corIcone, titulo, subtitulo, badge, corBadge, descricao }) {
  return (
    <button
      type="button"
      onClick={onSelecionar}
      aria-pressed={selecionado}
      className={`w-full rounded-2xl border p-4 text-left transition-colors focus:outline-none ${
        selecionado
          ? 'border-primary ring-1 ring-primary'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      <div className="flex items-center gap-3">
        <span className={`flex h-11 w-11 flex-none items-center justify-center rounded-xl ${corIcone}`}>
          <Icone size={19} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-[0.95rem] font-bold text-slate-950">{titulo}</p>
          <p className="text-[0.8rem] text-slate-500">{subtitulo}</p>
        </div>

        <span className={`flex-none rounded-full px-2.5 py-1 text-[0.62rem] font-bold uppercase tracking-wide ${corBadge}`}>
          {badge}
        </span>
      </div>

      <p className="mt-3 text-[0.8rem] leading-relaxed text-slate-500">{descricao}</p>
    </button>
  );
}

// ─── Componente Principal ─────────────────────────────────────────────────────
export default function Payment() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerWithPayment, registerWithPaymentGoogle, changePlanWithPayment } = useAuth();

  // Dados que chegam da tela Register
  const registrationData = location.state;
  const isPlanChange = !!registrationData?.isPlanChange;

  // Guarda de rota: se chegar sem dados, volta para o cadastro
  useEffect(() => {
    if (!registrationData?.plan) {
      navigate('/cadastro', { replace: true });
    }
  }, [registrationData, navigate]);

  const plan = registrationData?.plan ? PLANS[registrationData.plan] : null;

  // ── Estado do fluxo ──
  const [method, setMethod] = useState('pix'); // 'pix' | 'cartao'
  const [step, setStep] = useState('select'); // 'select' | 'pix-waiting' | 'card-form' | 'processing' | 'success'

  // ── Estado PIX ──
  const [pixPayload, setPixPayload] = useState('');
  const [pixTxId, setPixTxId] = useState('');
  const [pixSecondsLeft, setPixSecondsLeft] = useState(PIX_EXPIRATION_SECONDS);
  const pixIntervalRef = useRef(null);

  // ── Estado Cartão ──
  const [cardNumber, setCardNumber] = useState('');
  const [cardName, setCardName]   = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv]     = useState('');
  const [cardBrand, setCardBrand] = useState(''); // 'visa' | 'master' | 'elo' | etc.
  const [installments, setInstallments] = useState(1);

  // ── Estado geral ──
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  // ── Limpa o timer do PIX ao sair ──
  useEffect(() => {
    return () => {
      if (pixIntervalRef.current) clearInterval(pixIntervalRef.current);
    };
  }, []);

  // ── Detecta bandeira do cartão ──
  useEffect(() => {
    const n = cardNumber.replace(/\D/g, '');
    if (/^4/.test(n)) setCardBrand('visa');
    else if (/^(5[1-5]|2[2-7])/.test(n)) setCardBrand('master');
    else if (/^(3[47])/.test(n)) setCardBrand('amex');
    else if (/^(6|5)/.test(n)) setCardBrand('elo');
    else setCardBrand('');
  }, [cardNumber]);

  // ── Inicia contagem regressiva do PIX ──
  const startPixCountdown = () => {
    setPixSecondsLeft(PIX_EXPIRATION_SECONDS);
    if (pixIntervalRef.current) clearInterval(pixIntervalRef.current);
    pixIntervalRef.current = setInterval(() => {
      setPixSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(pixIntervalRef.current);
          pixIntervalRef.current = null;
          // Gera novo payload automaticamente
          regeneratePix();
          return PIX_EXPIRATION_SECONDS;
        }
        return s - 1;
      });
    }, 1000);
  };

  const regeneratePix = () => {
    const txid = generateTxId();
    setPixTxId(txid);
    setPixPayload(buildPixPayload({ txid, amount: plan.price }));
  };

  // ── Avança para a tela do método escolhido ──
  // A escolha agora é só visual (o card marca o método); quem avança é o
  // botão "Finalizar pagamento".
  const handleSelectMethod = (m) => {
    setMethod(m);
    if (m === 'pix') {
      regeneratePix();
      startPixCountdown();
      setStep('pix-waiting');
    } else {
      setStep('card-form');
    }
  };

  const handleContinuar = () => handleSelectMethod(method);

  // ── Copia código PIX ──
  const handleCopyPix = async () => {
    try {
      await navigator.clipboard.writeText(pixPayload);
      setToast({ show: true, message: 'Código PIX copiado!', type: 'success' });
    } catch {
      setToast({ show: true, message: 'Não foi possível copiar o código.', type: 'error' });
    }
  };

  // ── Simula o pagamento PIX sendo confirmado (botão "Já paguei") ──
  const handlePixPaid = async () => {
    setStep('processing');
    setLoading(true);
    // Simula a "verificação" do pagamento no PSP
    await new Promise((r) => setTimeout(r, 1800));
    await finishRegistration({
      metodo: 'pix',
      valor: plan.price,
      idTransacao: pixTxId,
    });
  };

  // ── Submete cartão ──
  const handleCardSubmit = async (e) => {
    e.preventDefault();

    // Validações
    const n = cardNumber.replace(/\D/g, '');
    if (n.length < 13) {
      setToast({ show: true, message: 'Número de cartão inválido.', type: 'error' });
      return;
    }
    if (!cardName.trim() || cardName.trim().length < 3) {
      setToast({ show: true, message: 'Informe o nome impresso no cartão.', type: 'error' });
      return;
    }
    if (cardExpiry.length < 5) {
      setToast({ show: true, message: 'Data de validade inválida.', type: 'error' });
      return;
    }
    if (cardCvv.length < 3) {
      setToast({ show: true, message: 'CVV inválido.', type: 'error' });
      return;
    }

    setStep('processing');
    setLoading(true);

    // Simula validação do cartão no gateway
    await new Promise((r) => setTimeout(r, 2200));

    // Recusa simulada para cartões terminados em "0000" (apenas para a demo)
    if (n.endsWith('0000')) {
      setLoading(false);
      setStep('card-form');
      setToast({
        show: true,
        message: 'Cartão recusado. Use outro cartão (a simulação recusa cartões terminados em 0000).',
        type: 'error',
      });
      return;
    }

    await finishRegistration({
      metodo: 'cartao',
      valor: plan.price,
      idTransacao: generateTxId(),
      cartaoFinal: n.slice(-4),
    });
  };

  // ── Finaliza cadastro: cria usuário no Firebase Auth + registra pagamento ──
  const finishRegistration = async (payment) => {
    try {
      if (isPlanChange) {
        // Usuário já autenticado trocando de plano — só atualiza o plano, não cria conta nova
        await changePlanWithPayment({ plan: plan.id, payment });
      } else if (registrationData.isGoogle) {
        // Se veio do fluxo Google, abre o popup aqui (após pagamento)
        await registerWithPaymentGoogle({ plan: plan.id, payment });
      } else {
        await registerWithPayment({ ...registrationData, payment });
      }
      setStep('success');
      setLoading(false);
    } catch (error) {
      console.error('Erro ao finalizar cadastro:', error);
      setLoading(false);
      setStep(method === 'pix' ? 'pix-waiting' : 'card-form');
      if (error.code === 'auth/email-already-in-use') {
        setToast({ show: true, message: 'Este e-mail já está cadastrado. Faça login.', type: 'error' });
      } else if (error.code === 'auth/popup-closed-by-user' || error.code === 'auth/cancelled-popup-request') {
        setToast({ show: true, message: 'Popup do Google fechado.', type: 'warning' });
      } else {
        setToast({ show: true, message: 'Não foi possível concluir. Tente novamente.', type: 'error' });
      }
    }
  };

  const goToDashboard = () => navigate(isPlanChange ? '/capital/perfil' : '/capital/dashboard');

  // ── Formata mm:ss para o cronômetro ──
  const fmtTimer = (s) => {
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  };

  // ── Bandeiras suportadas (visual) ──
  const BRAND_COLORS = {
    visa:   { bg: 'bg-[#1a1f71]', text: 'text-white',  label: 'VISA' },
    master: { bg: 'bg-[#eb001b]', text: 'text-white',  label: 'mastercard' },
    amex:   { bg: 'bg-[#2e77bb]', text: 'text-white',  label: 'AMEX' },
    elo:    { bg: 'bg-[#000000]', text: 'text-white',  label: 'ELO' },
  };

  if (!plan) return null;

  return (
    <div className="min-h-screen flex flex-col bg-white lg:grid lg:grid-cols-[54fr_46fr]">

      {/* ── Coluna Esquerda: Conteúdo principal ── */}
      <div className="flex flex-col justify-between px-8 py-8 sm:px-12 lg:px-14">

        {/* Cabeçalho: voltar */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigate('/cadastro', { state: location.state })}
            className="flex items-center gap-1.5 text-[0.8rem] text-slate-500 transition-colors hover:text-slate-900"
          >
            <ArrowLeft size={14} />
            Voltar
          </button>

          {/* Indicador: pagamento seguro */}
          <div className="flex items-center gap-2 text-[0.7rem] font-bold uppercase tracking-[0.15em] text-slate-700">
            <Lock size={12} className="text-amber-500" /> Pagamento seguro
          </div>
        </div>

        {/* ── STEP: Seleção de método ── */}
        {step === 'select' && (
          <div className="flex w-full max-w-[32rem] flex-1 flex-col justify-center py-8">
            <h1 className="text-[2.4rem] font-extrabold leading-none tracking-tight text-slate-950">
              Quase lá!
            </h1>
            <p className="mt-3 text-[0.9rem] text-slate-500">
              Escolha como deseja pagar o plano{' '}
              <span className="font-bold text-slate-950">{plan.name}</span>.
            </p>

            <div className="mt-7 flex flex-col gap-4">
              <MetodoCard
                selecionado={method === 'pix'}
                onSelecionar={() => setMethod('pix')}
                Icone={QrCode}
                corIcone="bg-emerald-100 text-emerald-600"
                titulo="PIX"
                subtitulo="Aprovação instantânea"
                badge="Recomendado"
                corBadge="bg-emerald-100 text-emerald-700"
                descricao="Pague com qualquer banco via QR Code. A confirmação é em segundos."
              />

              <MetodoCard
                selecionado={method === 'cartao'}
                onSelecionar={() => setMethod('cartao')}
                Icone={CreditCard}
                corIcone="bg-indigo-50 text-indigo-600"
                titulo="Cartão de Crédito"
                subtitulo="Visa, Master, Elo, Amex"
                badge="12x sem juros"
                corBadge="bg-indigo-50 text-indigo-600"
                descricao="Pagamento processado com criptografia. Dados protegidos."
              />
            </div>

            <button
              type="button"
              onClick={handleContinuar}
              className="mt-8 flex h-[3.1rem] w-full items-center justify-center rounded-2xl bg-[#0a0d12] text-[0.95rem] font-bold text-white transition-colors hover:bg-black"
            >
              Finalizar pagamento
            </button>

            <p className="mt-5 flex items-center gap-2 text-[0.78rem] text-slate-400">
              <ShieldCheck size={14} />
              Ambiente criptografado · Dados protegidos
            </p>
          </div>
        )}

        {/* ── STEP: PIX (aguardando pagamento) ── */}
        {step === 'pix-waiting' && (
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-6 text-center">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Pague com PIX
              </h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                Escaneie o QR Code ou copie o código abaixo.
              </p>
            </div>

            {/* Cronômetro */}
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold bg-slate-100 px-3 py-1.5 rounded-full">
                <Clock size={12} />
                Expira em <span className="text-slate-900 font-bold tabular-nums">{fmtTimer(pixSecondsLeft)}</span>
              </div>
            </div>

            {/* QR Code */}
            <div className="flex justify-center mb-6">
              <FakeQRCode payload={pixPayload} size={220} />
            </div>

            {/* Linha de valor */}
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Valor</p>
                <p className="text-2xl font-extrabold text-slate-900 tabular-nums">{fmtBRL(plan.price)}</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold">Transação</p>
                <p className="text-xs font-mono font-bold text-slate-700">{pixTxId}</p>
              </div>
            </div>

            {/* Copia/Cola */}
            <div className="mb-4">
              <label className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-1.5 block">
                PIX Copia e Cola
              </label>
              <div className="flex gap-2">
                <input
                  readOnly
                  value={pixPayload}
                  className="flex-1 bg-slate-50 border border-slate-200 text-slate-700 text-xs font-mono rounded-lg px-3 py-2.5 truncate focus:outline-none"
                />
                <button
                  onClick={handleCopyPix}
                  className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  <Copy size={13} />
                  Copiar
                </button>
              </div>
            </div>

            {/* Ações */}
            <div className="flex gap-2">
              <button
                onClick={() => { setStep('select'); clearInterval(pixIntervalRef.current); }}
                className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-400 rounded-lg transition-colors"
              >
                Trocar método
              </button>
              <button
                onClick={handlePixPaid}
                className="flex-[2] py-3 text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <Check size={15} />
                Já paguei
              </button>
            </div>

            <p className="text-[10px] text-slate-400 text-center mt-4 leading-relaxed">
              Após o pagamento, sua conta será criada automaticamente e você terá acesso imediato.
            </p>
          </div>
        )}

        {/* ── STEP: Formulário de Cartão ── */}
        {step === 'card-form' && (
          <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
            <div className="mb-6">
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Cartão de Crédito
              </h2>
              <p className="mt-2 text-sm text-slate-500 font-medium">
                Preencha os dados do cartão para finalizar a assinatura.
              </p>
            </div>

            {/* Preview do cartão */}
            <div className={`relative h-44 rounded-2xl p-5 mb-6 overflow-hidden shadow-lg ${
              cardBrand && BRAND_COLORS[cardBrand]
                ? `${BRAND_COLORS[cardBrand].bg} ${BRAND_COLORS[cardBrand].text}`
                : 'bg-gradient-to-br from-slate-800 to-slate-900 text-white'
            }`}>
              <div className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-widest opacity-80">
                {cardBrand ? BRAND_COLORS[cardBrand].label : 'CapitalCycle'}
              </div>
              <div className="absolute bottom-3 left-5 right-5">
                <p className="font-mono text-base tracking-widest mb-3">
                  {cardNumber || '•••• •••• •••• ••••'}
                </p>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-[8px] uppercase tracking-widest opacity-70">Titular</p>
                    <p className="text-xs font-semibold uppercase truncate max-w-[180px]">
                      {cardName || 'SEU NOME'}
                    </p>
                  </div>
                  <div>
                    <p className="text-[8px] uppercase tracking-widest opacity-70">Validade</p>
                    <p className="text-xs font-semibold">{cardExpiry || 'MM/AA'}</p>
                  </div>
                </div>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleCardSubmit}>
              {/* Número do cartão */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                  Número do cartão
                </label>
                <div className="relative">
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    placeholder="0000 0000 0000 0000"
                    maxLength={23}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg pl-4 pr-12 py-3 text-sm font-mono focus:outline-none focus:border-slate-900 transition-colors"
                  />
                  <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                </div>
              </div>

              {/* Titular */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                  Nome impresso no cartão
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={cardName}
                    onChange={(e) => setCardName(e.target.value.toUpperCase())}
                    placeholder="JOÃO DA SILVA"
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg pl-4 pr-3 py-3 text-sm uppercase focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>

              {/* Validade e CVV */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                    Validade
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardExpiry}
                    onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
                    placeholder="MM/AA"
                    maxLength={5}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                    CVV
                  </label>
                  <input
                    type="text"
                    inputMode="numeric"
                    value={cardCvv}
                    onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                    placeholder="123"
                    maxLength={4}
                    className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-slate-900 transition-colors"
                  />
                </div>
              </div>

              {/* Parcelas */}
              <div>
                <label className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-1.5 block">
                  Parcelas
                </label>
                <select
                  value={installments}
                  onChange={(e) => setInstallments(parseInt(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 text-slate-900 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-slate-900 transition-colors"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => {
                    const v = plan.price / n;
                    return (
                      <option key={n} value={n}>
                        {n}x de {fmtBRL(v)} sem juros
                      </option>
                    );
                  })}
                </select>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setStep('select')}
                  className="flex-1 py-3 text-sm font-bold text-slate-600 bg-white border border-slate-200 hover:border-slate-400 rounded-lg transition-colors"
                >
                  Trocar método
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-[2] py-3 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {loading ? <LoadingSpinner size="sm" color="text-white" /> : (
                    <>
                      <Lock size={14} />
                      Pagar {fmtBRL(plan.price)}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* ── STEP: Processando ── */}
        {step === 'processing' && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
            <div className="mb-6">
              <LoadingSpinner size="lg" color="text-slate-900" />
            </div>
            <h2 className="text-2xl font-extrabold text-slate-900 text-center">
              Processando pagamento…
            </h2>
            <p className="mt-2 text-sm text-slate-500 text-center font-medium">
              Estamos confirmando o pagamento e criando sua conta.
              <br />Não feche esta tela.
            </p>
          </div>
        )}

        {/* ── STEP: Sucesso ── */}
        {step === 'success' && (
          <div className="flex-1 flex flex-col items-center justify-center max-w-sm mx-auto w-full">
            <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center mb-6">
              <Check className="text-emerald-600" size={40} strokeWidth={3} />
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 text-center">
              Pagamento confirmado!
            </h2>
            <p className="mt-2 text-sm text-slate-500 text-center font-medium">
              {isPlanChange ? (
                <>Seu plano foi atualizado com sucesso.<br />Agora você está no <span className="font-bold text-slate-900">CapitalCycle {plan.name}</span>.</>
              ) : (
                <>Sua conta foi criada com sucesso.<br />Bem-vindo ao <span className="font-bold text-slate-900">CapitalCycle {plan.name}</span>.</>
              )}
            </p>

            <button
              onClick={goToDashboard}
              className="mt-8 w-full py-3.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              {isPlanChange ? 'Ver meu perfil' : 'Acessar Dashboard'}
              <ArrowLeft size={14} className="rotate-180" />
            </button>
          </div>
        )}

        {/* Rodapé */}
        <div className="pt-6 text-[0.75rem] text-slate-400">
          CapitalCycle © 2026 - TCC Solutions
        </div>
      </div>

      {/* ── Coluna Direita: Resumo do plano ── */}
      <div className="hidden bg-[#05070e] px-10 lg:flex lg:flex-col lg:items-center lg:justify-center">
        <div className="w-full max-w-[24rem]">
          <p className="text-center text-[0.72rem] font-semibold uppercase tracking-[0.25em] text-slate-400">
            Resumo da assinatura
          </p>

          <div className="mt-7 rounded-2xl border-2 border-primary bg-[#0d1117] p-6">
            <div className="flex items-start justify-between gap-4">
              <span className="text-[0.75rem] font-bold uppercase tracking-[0.15em] text-slate-200">
                Plano {plan.name}
              </span>
              <span
                className="flex h-6 w-6 flex-none items-center justify-center rounded-full bg-primary text-white"
                aria-hidden="true"
              >
                <Check size={13} strokeWidth={3} />
              </span>
            </div>

            <div className="mt-4 flex items-baseline gap-1.5">
              <span className="text-lg font-bold text-white">R$</span>
              <span className="text-[2rem] font-extrabold tracking-tight text-white">{plan.priceStr}</span>
              <span className="text-[0.9rem] text-slate-400">/ano</span>
            </div>

            <div className="mt-5 border-t border-slate-700/60 pt-4">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-slate-500">
                Cobrança
              </p>

              <div className="mt-3 flex justify-between text-[0.85rem]">
                <span className="text-slate-300">Plano {plan.name} (anual)</span>
                <span className="font-semibold text-white">{fmtBRL(plan.price)}</span>
              </div>

              <div className="mt-2 flex justify-between text-[0.85rem]">
                <span className="text-slate-300">Taxa de adesão</span>
                <span className="font-semibold text-emerald-400">Grátis</span>
              </div>
            </div>

            <div className="mt-4 flex items-center justify-between border-t border-slate-700/60 pt-4">
              <span className="text-[0.95rem] font-bold text-white">Total hoje</span>
              <span className="text-[1.05rem] font-extrabold text-white">{fmtBRL(plan.price)}</span>
            </div>
          </div>

          {/* Conta do usuário (avatar) */}
          {registrationData && !registrationData.isGoogle && registrationData.name && (
            <div className="mt-5 rounded-2xl bg-[#0d1117] p-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-slate-500">
                Conta a ser criada
              </p>
              <div className="mt-3 flex items-center gap-3">
                <div className="flex h-10 w-10 flex-none items-center justify-center rounded-full bg-primary/20">
                  <User size={17} className="text-indigo-400" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[0.95rem] font-bold text-white">{registrationData.name}</p>
                  <p className="truncate text-[0.8rem] text-slate-400">{registrationData.email}</p>
                </div>
              </div>
            </div>
          )}

          {registrationData?.isGoogle && (
            <div className="mt-5 rounded-2xl bg-[#0d1117] p-5">
              <p className="text-[0.68rem] font-bold uppercase tracking-[0.15em] text-slate-500">
                Conta Google
              </p>
              <p className="mt-3 text-[0.85rem] text-slate-300">
                Após confirmar o pagamento, sua conta Google será vinculada automaticamente.
              </p>
            </div>
          )}

          <p className="mt-6 text-center text-[0.75rem] text-slate-500">
            Pagamento seguro · Cancele quando quiser · Sem fidelidade
          </p>
        </div>
      </div>

      {/* Toast */}
      {toast.show && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast({ ...toast, show: false })}
        />
      )}
    </div>
  );
}
