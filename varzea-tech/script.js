/* ===== Várzea Tech — script.js (protótipo de TCC) =====
   Os dados ficam no localStorage. Quando houver backend, troque apenas o objeto `db`. */

/* ---------- utilidades ---------- */
const $ = (s, e = document) => e.querySelector(s);
const $$ = (s, e = document) => [...e.querySelectorAll(s)];
const esc = s => String(s ?? "").replace(/[&<>"']/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
const digitos = s => String(s || "").replace(/\D/g, "");
/* posições mudam conforme o tipo do racha */
const POS = {
  Campo: ["Goleiro", "Zagueiro", "Lateral", "Volante", "Meia", "Ponta", "Atacante"],
  Society: ["Goleiro", "Zagueiro", "Ala", "Meia", "Atacante"],
  Futsal: ["Goleiro", "Fixo", "Ala", "Pivô"],
  Areia: ["Goleiro", "Fixo", "Ala", "Pivô"]
};
const POSICOES = [...new Set(Object.values(POS).flat())]; /* todas, usadas no cadastro e no perfil */
const EQUIV = { Zagueiro: "Fixo", Lateral: "Ala", Volante: "Meia", Meia: "Ala", Ponta: "Ala", Atacante: "Pivô", Ala: "Lateral", Fixo: "Zagueiro", Pivô: "Atacante" };
const ocupadas = r => r.jogadores.length + (r.aconfirmar?.length || 0); /* confirmados + vagas reservadas */
const posDe = t => POS[t] || POSICOES;
const posValida = (t, p) => { const ps = posDe(t); return ps.includes(p) ? p : ps.includes(EQUIV[p]) ? EQUIV[p] : ps[1] || ps[0]; };
const TIPOS = ["Society", "Campo", "Futsal", "Areia"];

const SUPORTE = { instagram: "https://www.instagram.com/varzea_tech_", email: "suporte@varzeatech.com.br" };
const CATS = [["tecnica", "Habilidade"], ["fairplay", "Fair play"], ["pontual", "Pontualidade"]];
const mediaN = n => ((n.tecnica + n.fairplay + n.pontual) / 3).toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });
const capaDe = r => r.foto || r.fotos?.[0]?.src || ""; 
const quem = j => ({ username: j.username, nome: j.nome, foto: db.user(j.username)?.foto || "" }); 
const fmtData = iso => iso ? new Date(iso).toLocaleString("pt-BR", { weekday: "short", day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" }) : "A definir";
const dinheiro = v => v > 0 ? v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" }) : "Grátis";
const wa = (tel, msg = "") => `https://wa.me/55${digitos(tel)}${msg ? "?text=" + encodeURIComponent(msg) : ""}`;
const iniciais = n => n.split(" ").map(p => p[0]).slice(0, 2).join("").toUpperCase();
const local = r => [r.endereco + (r.numero ? ", " + r.numero : ""), r.bairro, r.cidade].filter(Boolean).join(", ");
const localISO = d => { const p = n => String(n).padStart(2, "0"); return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(d.getHours())}:${p(d.getMinutes())}`; };
const maskTel = v => { const d = digitos(v).slice(0, 11); return d.length > 10 ? d.replace(/(\d\d)(\d{5})(\d{4})/, "($1) $2-$3") : d.length > 6 ? d.replace(/(\d\d)(\d{4})(\d{0,4})/, "($1) $2-$3") : d.length > 2 ? d.replace(/(\d\d)(\d*)/, "($1) $2") : d; };
const REGRAS = { len: s => s.length >= 8, up: s => /[A-Z]/.test(s), low: s => /[a-z]/.test(s), num: s => /\d/.test(s) };
const EYE = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/><line class="slash" x1="2" y1="2" x2="22" y2="22"/></svg>`;

const ICONES = {
  lock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  unlock: '<rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
  calendar: '<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  pin: '<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>',
  map: '<path d="M3 6l6-3 6 3 6-3v15l-6 3-6-3-6 3z"/><path d="M9 3v15M15 6v15"/>',
  chat: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
  send: '<path d="M22 2 11 13M22 2l-7 20-4-9-9-4z"/>',
  link: '<path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/>',
  shuffle: '<path d="M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5"/>',
  camera: '<path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/>',
  x: '<path d="M18 6 6 18M6 6l12 12"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/>',
  pitch: '<circle cx="12" cy="12" r="5"/><path d="M12 3v18M3 8h3v8H3M21 8h-3v8h3"/>',
  sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',
  moon: '<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8z"/>',
  repeat: '<path d="m17 2 4 4-4 4"/><path d="M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4"/><path d="M21 13v2a3 3 0 0 1-3 3H3"/>',
  instagram: '<rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r=".6" fill="currentColor"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  trophy: '<path d="M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0zM17 5h3v2a3 3 0 0 1-3 3M7 5H4v2a3 3 0 0 0 3 3"/>',
  star: '<path d="m12 2 3.1 6.3 6.9 1-5 4.9 1.2 6.8-6.2-3.3-6.2 3.3 1.2-6.8-5-4.9 6.9-1z"/>'
};
const ico = (n, s = 18) => `<svg class="ico" width="${s}" height="${s}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[n]}</svg>`;

function toast(msg) {
  const t = $("#toast"); t.textContent = msg; t.classList.add("show");
  clearTimeout(toast.t); toast.t = setTimeout(() => t.classList.remove("show"), 3000);
}

/* ---------- "banco de dados" (localStorage) ---------- */
const ls = { get: (k, d) => { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch { return d; } }, set: (k, v) => localStorage.setItem(k, JSON.stringify(v)) };
const db = {
  users: () => ls.get("vt_users", []),
  saveUsers: v => ls.set("vt_users", v),
  rachas: () => ls.get("vt_rachas", []),
  saveRachas: v => ls.set("vt_rachas", v),
  racha: id => db.rachas().find(r => r.id === id),
  salvarRacha(r) { const l = db.rachas(), i = l.findIndex(x => x.id === r.id); i >= 0 ? l[i] = r : l.unshift(r); db.saveRachas(l); },
  salvarUser(u) { db.saveUsers(db.users().map(x => x.username === u.username ? u : x)); }
};
db.avals = () => ls.get("vt_aval", []); db.saveAvals = v => ls.set("vt_aval", v); db.user = un => db.users().find(u => u.username === un);
const me = () => db.users().find(u => u.username === localStorage.getItem("vt_session")) || null;

async function hash(s) { // SHA-256 (protótipo: num sistema real o hash é feito no servidor)
  if (!crypto.subtle) return "p:" + btoa(s);
  const b = await crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  return [...new Uint8Array(b)].map(x => x.toString(16).padStart(2, "0")).join("");
}

function exigirLogin() {
  if (me()) return true;
  location.href = "login.html?next=" + encodeURIComponent(location.pathname.split("/").pop() + location.search);
  return false;
}
function proximo() { const n = new URLSearchParams(location.search).get("next"); return /^[\w-]+\.html(\?.*)?$/.test(n || "") ? n : "index.html"; }

/* quem entra na vaga: lista de espera sobe sozinha quando abre vaga */
function promover(r) { while (ocupadas(r) < r.vagas && r.espera.length) r.jogadores.push(r.espera.shift()); }

/* ---------- dados de demonstração (só na 1ª visita) ---------- */
function seed() {
  if (localStorage.getItem("vt_seed")) return;
  const quando = (d, h) => { const t = new Date(); t.setDate(t.getDate() + d); t.setHours(h, 0, 0, 0); return localISO(t); };
  const nomes = ["Lucas", "Pedro", "Marcos", "João", "Rafa", "Thiago", "Bruno", "Diego", "Caio", "André"];
  const gente = n => nomes.slice(0, n).map((nm, i) => ({ username: "@" + nm.toLowerCase(), nome: nm, posicao: i === 0 ? "Goleiro" : POSICOES[1 + i % 5] }));
  const b = { pedidos: [], espera: [], org: "@demo", orgNome: "Carlos", whatsapp: "11999999999", cep: "", complemento: "", foto: "" };
  db.saveRachas([
    { ...b, id: 1, nome: "Racha dos Amigos", tipo: "Society", privado: false, vagas: 14, preco: 20, arena: "Arena Champions", dataHora: quando(1, 20), endereco: "Rua das Palmeiras", numero: "120", bairro: "Mooca", cidade: "São Paulo/SP", obs: "Traga colete e água.", jogadores: gente(9) },
    { ...b, id: 2, nome: "Futsal de Quinta", tipo: "Futsal", privado: true, vagas: 10, preco: 15, arena: "Ginásio Central", dataHora: quando(2, 21), endereco: "Av. Brasil", numero: "800", bairro: "Pinheiros", cidade: "São Paulo/SP", obs: "", jogadores: gente(10) },
    { ...b, id: 3, nome: "Pelada na Areia", tipo: "Areia", privado: false, vagas: 12, preco: 0, arena: "Quadra do Parque", dataHora: quando(3, 9), endereco: "Rua da Praia", numero: "45", bairro: "Gonzaga", cidade: "Santos/SP", obs: "", jogadores: gente(4) }
  ]);
  localStorage.setItem("vt_seed", "1");
}

/* rachá já encerrado, com notas de demonstração, para ver estatísticas e avaliações funcionando */
function seedPassado() {
  if (localStorage.getItem("vt_seed_p3")) return;
  const js = ["Lucas", "Pedro", "Marcos", "João", "Rafa", "Thiago"].map((nm, i) => ({ username: "@" + nm.toLowerCase(), nome: nm, posicao: i ? POSICOES[1 + i % 5] : "Goleiro" })), av = [];
  const jogos = [[4, "Racha de Domingo", 3, [0, 2, 3, 1, 2, 0], [1, 1, 2, 0, 1, 2]], [5, "Pelada de Sábado", 10, [0, 1, 1, 3, 0, 2], [0, 2, 1, 1, 2, 0]]];
  const novos = jogos.map(([id, nome, dias, g, a]) => {
    const t = new Date(); t.setDate(t.getDate() - dias); t.setHours(20, 0, 0, 0);
    if (id === 4) js.forEach((x, i) => js.forEach((y, k) => { if (x !== y) av.push({ id: `4-${x.username}-${y.username}`, rachaId: 4, de: x.username, para: y.username, notas: { tecnica: 3 + (i + k) % 3, fairplay: 3 + (i * 2 + k) % 3, pontual: 3 + (i + k * 2) % 3 }, comentario: (i + k) % 4 === 0 ? "Joga fácil e não corta ninguém." : "", data: t.getTime() + i * 1000 + k }); }));
    return { id, nome, recorrente: id === 4, tipo: "Society", privado: false, vagas: 12, preco: 20, arena: "Arena Champions", dataHora: localISO(t), endereco: "Rua das Palmeiras", numero: "120", bairro: "Mooca", cidade: "São Paulo/SP", obs: "", cep: "", complemento: "", foto: "", pedidos: [], espera: [], org: "@lucas", orgNome: "Lucas", whatsapp: "11999999999", jogadores: js, stats: Object.fromEntries(js.map((p, i) => [p.username, { g: g[i], a: a[i] }])) };
  });
  db.saveRachas([...db.rachas().filter(r => r.id !== 4 && r.id !== 5), ...novos]);
  db.saveAvals([...db.avals().filter(a => a.rachaId !== 4), ...av]); localStorage.setItem("vt_seed_p3", "1");
}

/* Racha semanal: quando um racha recorrente termina, cria o próximo (+7 dias) com a mesma configuração.
   O organizador entra confirmado; quem jogou fica com a vaga reservada até o prazo (24h antes do jogo).
   No backend isto vira uma tarefa agendada (cron) ou a criação sob demanda ao abrir o racha. */
function gerarRecorrentes() {
  const rs = db.rachas(), agora = new Date(); let mudou = false;
  rs.filter(r => r.recorrente && !r.cancelado && !r.proximoId && new Date(r.dataHora) < agora).forEach((r, k) => {
    const d = new Date(r.dataHora); do d.setDate(d.getDate() + 7); while (d <= agora);
    const prazo = new Date(d); prazo.setHours(prazo.getHours() - 24); if (prazo <= agora) { prazo.setTime(d.getTime()); prazo.setHours(prazo.getHours() - 2); }
    const dono = r.jogadores.find(j => j.username === r.org) || { username: r.org, nome: r.orgNome, posicao: posValida(r.tipo, db.user(r.org)?.posicao) };
    const { jogadores, pedidos, espera, aconfirmar, stats, cancelado, proximoId, ...cfg } = r;
    const novo = { ...cfg, id: Date.now() + k, serieId: r.serieId || r.id, dataHora: localISO(d), prazoConfirmacao: localISO(prazo), jogadores: [dono], pedidos: [], espera: [], aconfirmar: jogadores.filter(j => j.username !== r.org) };
    r.proximoId = novo.id; rs.push(novo); mudou = true;
  });
  if (mudou) db.saveRachas(rs);
}
function expirarConfirmacoes() { // quem não confirmou até o prazo perde a vaga e a lista de espera sobe
  const rs = db.rachas(), agora = new Date(); let mudou = false;
  rs.forEach(r => { if (r.aconfirmar?.length && new Date(r.prazoConfirmacao) <= agora) { r.aconfirmar = []; promover(r); mudou = true; } });
  if (mudou) db.saveRachas(rs);
}

function ajustarPosicoes() { // garante que a posição de cada jogador exista no tipo do racha
  let mudou = false; const rs = db.rachas();
  rs.forEach(r => ["jogadores", "pedidos", "espera", "aconfirmar"].forEach(k => (r[k] || []).forEach(j => { const p = posValida(r.tipo, j.posicao); if (p !== j.posicao) { j.posicao = p; mudou = true; } })));
  if (mudou) db.saveRachas(rs);
}


function avatar(u, s = 40) {
  return u.foto ? `<img class="av" style="--s:${s}px" src="${u.foto}" alt="">` : `<span class="av" style="--s:${s}px">${esc(iniciais(u.nome))}</span>`;
}
function layout() {
  const u = me();
  const pend = u ? db.rachas().filter(r => !r.cancelado && (r.aconfirmar || []).some(j => j.username === u.username)) : [];
  const banner = pend.length ? `<a class="banner" href="${pend.length === 1 ? "racha.html?id=" + pend[0].id : "perfil.html"}">Você tem ${pend.length} ${pend.length === 1 ? "presença" : "presenças"} para confirmar. Toque para responder.</a>` : "";
  document.body.insertAdjacentHTML("afterbegin", `<header class="topbar"><div class="wrap bar">
    <a href="index.html" class="logo" aria-label="Várzea Tech — início"><span class="logo-mark" aria-hidden="true"></span><span class="logo-text">Várzea<b>Tech</b></span></a>
    <nav>
      <a href="index.html#lista" class="btn btn-line btn-sm">${ico("search", 15)}Buscar racha</a>
      <a href="criar.html" class="btn btn-line btn-sm">${ico("plus", 15)}Criar racha</a>
      <button type="button" id="tema" class="btn btn-line btn-sm tema"></button>
      ${u ? `<a href="perfil.html" class="btn btn-line btn-sm">Meus rachas</a><a href="perfil.html" class="user">${avatar(u, 26)}${esc(u.nome.split(" ")[0])}</a>`
          : `<a href="login.html" class="btn btn-solid btn-sm">Entrar</a>`}
    </nav></div></header>${banner}`);
  document.body.insertAdjacentHTML("beforeend", `<footer class="footer">
    <div class="wrap footer-grid">
      <div class="footer-brand">
        <a href="index.html" class="logo" aria-label="Várzea Tech, início"><span class="logo-mark" aria-hidden="true"></span><span class="logo-text">Várzea<b>Tech</b></span></a>
        <p>Encontre um racha, confirme presença e entre em campo.</p>
      </div>
      <nav class="footer-col" aria-label="Atalhos">
        <h4>Atalhos</h4>
        <a href="index.html#lista">Rachas disponíveis</a>
        <a href="criar.html">Criar racha</a>
        <a href="${u ? "perfil.html" : "login.html"}">${u ? "Meus rachas" : "Entrar"}</a>
      </nav>
      <div class="footer-col">
        <h4>Suporte</h4>
        <p>Algum problema no site? Fale com a gente.</p>
        <div class="footer-contatos">
          <a class="pill" href="mailto:${SUPORTE.email}?subject=${encodeURIComponent("Suporte Várzea Tech")}" aria-label="Enviar e-mail para o suporte">${ico("mail", 18)}<span>${SUPORTE.email}</span></a>
          <a class="pill" href="${SUPORTE.instagram}" target="_blank" rel="noopener noreferrer" aria-label="Instagram da Várzea Tech">${ico("instagram", 18)}<span>@${SUPORTE.instagram.split("/").filter(Boolean).pop()}</span></a>
        </div>
      </div>
    </div>
    <div class="wrap footer-base"><p>© 2026 Várzea Tech. Todos os direitos reservados.</p></div>
  </footer><div class="toast" id="toast" role="status"></div>`);
  $$("select[data-opts]").forEach(s => s.insertAdjacentHTML("beforeend", (s.dataset.opts === "tipos" ? TIPOS : POSICOES).map(o => `<option>${o}</option>`).join("")));

  const mq = matchMedia("(prefers-color-scheme: dark)"), escuro = () => (document.documentElement.dataset.theme || (mq.matches ? "dark" : "light")) === "dark";
  const pintaTema = () => {
    const b = $("#tema"), e = escuro(); b.innerHTML = ico(e ? "sun" : "moon", 16); b.title = b.ariaLabel = e ? "Mudar para o tema claro" : "Mudar para o tema escuro";
    $$('meta[name="theme-color"]').forEach(m => m.content = e ? "#030d09" : "#f1f7f3");
  };
  $("#tema").onclick = () => { const t = escuro() ? "light" : "dark"; document.documentElement.dataset.theme = t; try { localStorage.setItem("vt_tema", t); } catch { } pintaTema(); };
  mq.addEventListener("change", pintaTema); pintaTema();
  $$("[data-tel]").forEach(i => i.addEventListener("input", () => i.value = maskTel(i.value)));
  $$(".eye").forEach(b => { b.innerHTML = EYE; b.onclick = () => { const i = b.parentElement.querySelector("input"); i.type = i.type === "password" ? "text" : "password"; b.classList.toggle("on"); }; });
}


function lerFoto(file, max = 160) {
  return new Promise((ok, no) => {
    const img = new Image();
    img.onload = () => {
      const s = Math.min(img.width, img.height), c = document.createElement("canvas");
      c.width = c.height = Math.min(max, s);
      c.getContext("2d").drawImage(img, (img.width - s) / 2, (img.height - s) / 2, s, s, 0, 0, c.width, c.height);
      ok(c.toDataURL("image/jpeg", .8));
    };
    img.onerror = no; img.src = URL.createObjectURL(file);
  });
}

function lerFotoWide(file, max = 900) {
  return new Promise((ok, no) => {
    const img = new Image();
    img.onload = () => {
      const k = Math.min(1, max / Math.max(img.width, img.height)), c = document.createElement("canvas");
      c.width = Math.round(img.width * k); c.height = Math.round(img.height * k);
      c.getContext("2d").drawImage(img, 0, 0, c.width, c.height); URL.revokeObjectURL(img.src);
      ok(c.toDataURL("image/jpeg", .72));
    };
    img.onerror = no; img.src = URL.createObjectURL(file);
  });
}
function seletorCapa(el, atual, onChange) {
  el.innerHTML = `<div class="capa-box" role="button" tabindex="0"></div><input type="file" accept="image/*" hidden><button type="button" class="link-del" hidden>Remover foto</button>`;
  const [box, inp, del] = el.children;
  const pinta = f => { box.style.backgroundImage = f ? `url(${JSON.stringify(f)})` : ""; box.classList.toggle("tem", !!f); box.innerHTML = f ? "" : `${ico("camera", 28)}<span>Adicionar foto</span><small>Aparece no card e no topo do racha</small>`; del.hidden = !f; };
  box.onclick = () => inp.click(); box.onkeydown = e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); inp.click(); } };
  inp.onchange = async () => { if (!inp.files[0]) return; try { const f = await lerFotoWide(inp.files[0]); pinta(f); onChange(f); } catch { toast("Não foi possível ler essa imagem."); } };
  del.onclick = () => { pinta(""); onChange(""); };
  pinta(atual);
}
function seletorFoto(el, atual, onChange) {
  el.innerHTML = `<div class="avatar-picker" title="Escolher foto"></div><input type="file" accept="image/*" hidden><button type="button" class="link-del" hidden>Remover foto</button>`;
  const [pic, inp, del] = el.children;
  const pinta = f => { pic.style.backgroundImage = f ? `url(${f})` : ""; pic.innerHTML = f ? "" : ico("camera", 34); del.hidden = !f; };
  pic.onclick = () => inp.click();
  inp.onchange = async () => { if (!inp.files[0]) return; try { const f = await lerFoto(inp.files[0]); pinta(f); onChange(f); } catch { toast("Não foi possível ler essa imagem."); } };
  del.onclick = () => { pinta(""); onChange(""); };
  pinta(atual);
}


function card(r) {
  const n = r.jogadores.length, cheio = ocupadas(r) >= r.vagas;
  const capa = capaDe(r), nf = (r.fotos || []).length;
  return `<a class="card-proto" href="racha.html?id=${r.id}">
    <div class="card-capa">${capa ? `<img src="${esc(capa)}" alt="" loading="lazy" onerror="this.remove()">` : ""}${r.privado ? `<span class="card-lock" title="Privado (requer aprovação)">${ico("lock", 16)}</span>` : ""}${nf ? `<span class="capa-n">${ico("camera", 13)}${nf}</span>` : ""}</div>
    <div class="card-body">
    <span class="arena-tag">${r.recorrente ? "Semanal, " : ""}${esc(r.tipo)}, ${esc(r.arena)}</span>
    <h3 class="racha-title">${esc(r.nome)}</h3>
    <p class="info">${ico("calendar", 16)}<span>${fmtData(r.dataHora)}</span></p>
    <p class="info">${ico("pin", 16)}<span>${esc(local(r))}</span></p>
    ${n ? `<div class="stack">${r.jogadores.slice(0, 5).map(j => avatar(quem(j), 28)).join("")}${n > 5 ? `<span class="more">+${n - 5}</span>` : ""}</div>` : ""}<div class="vagas"><div class="bar-v"><i style="width:${Math.min(100, n / r.vagas * 100)}%"></i></div><span>${n}/${r.vagas}${cheio ? " · lotado" : ""}</span></div>
    <div class="card-foot"><strong>${dinheiro(r.preco)}</strong><span class="btn btn-line btn-sm">Ver racha</span></div></div></a>`;
}
function home() {
  const q = $("#busca"), tipo = $("#fTipo"), vagas = $("#fVagas"), ord = $("#fOrd");
  const render = () => {
    const t = q.value.toLowerCase().trim(), corte = Date.now() - 3 * 36e5;
    const l = db.rachas()
      .filter(r => !r.cancelado && new Date(r.dataHora) >= corte)
      .filter(r => (!t || [r.nome, r.arena, r.endereco, r.bairro, r.cidade].some(x => (x || "").toLowerCase().includes(t)))
        && (!tipo.value || r.tipo === tipo.value) && (!vagas.checked || ocupadas(r) < r.vagas))
      .sort(ord.value === "vagas" ? (a, b) => (b.vagas - ocupadas(b)) - (a.vagas - ocupadas(a)) : (a, b) => new Date(a.dataHora) - new Date(b.dataHora));
    $("#cards").innerHTML = l.map(card).join("");
    $("#vazio").hidden = l.length > 0;
    $("#contagem").textContent = `${l.length} racha${l.length === 1 ? "" : "s"} encontrado${l.length === 1 ? "" : "s"}`;
  };
  [q, tipo, vagas, ord].forEach(el => el.addEventListener("input", render));
  render();
}


function cadastro() {
  let foto = "";
  seletorFoto($("#fotoCad"), "", f => foto = f);
  const f = $("#formCad"), regras = $$("#rules li");
  f.usuario.addEventListener("input", () => f.usuario.value = f.usuario.value.replace(/[^a-zA-Z0-9._]/g, "").toLowerCase());
  f.senha.addEventListener("input", () => regras.forEach(li => li.classList.toggle("ok", REGRAS[li.dataset.r](f.senha.value))));
  f.onsubmit = async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), username = "@" + d.usuario, email = d.email.trim().toLowerCase(), us = db.users();
    if (d.senha !== d.senha2) return toast("As senhas não conferem.");
    if (!Object.values(REGRAS).every(fn => fn(d.senha))) return toast("A senha não atende aos requisitos.");
    if (digitos(d.whatsapp).length < 10) return toast("Informe um telefone válido com DDD.");
    if (us.some(u => u.username === username)) return toast("Esse nome de usuário já existe.");
    if (us.some(u => u.email === email)) return toast("Esse e-mail já está cadastrado.");
    us.push({ username, nome: d.nome.trim(), email, whatsapp: digitos(d.whatsapp), posicao: d.posicao, foto, senha: await hash(d.senha) });
    db.saveUsers(us); localStorage.setItem("vt_session", username);
    toast("Conta criada com sucesso!"); setTimeout(() => location.href = proximo(), 700);
  };
}


function login() {
  $("#formLogin").onsubmit = async e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(e.target)), id = d.id.trim().toLowerCase(), num = digitos(id), h = await hash(d.senha);
    const u = db.users().find(u => u.senha === h && (u.email === id || u.username === (id.startsWith("@") ? id : "@" + id) || (num.length >= 10 && u.whatsapp === num)));
    if (!u) return toast("Usuário/e-mail/telefone ou senha incorretos.");
    localStorage.setItem("vt_session", u.username);
    toast("Login realizado!"); setTimeout(() => location.href = proximo(), 600);
  };
}


function esqueci() {
  const f1 = $("#formEsqueci"), f2 = $("#formReset"), regras = $$("#rules li"), demo = $("#demoCodigo");
  const pedido = () => { try { return JSON.parse(sessionStorage.getItem("vt_reset")); } catch { return null; } };
  f2.senha.addEventListener("input", () => regras.forEach(li => li.classList.toggle("ok", REGRAS[li.dataset.r](f2.senha.value))));
  f1.onsubmit = async e => {
    e.preventDefault();
    const id = f1.conta.value.trim().toLowerCase(), num = digitos(id);
    const u = db.users().find(u => u.email === id || u.username === (id.startsWith("@") ? id : "@" + id) || (num.length >= 10 && u.whatsapp === num));
    if (u) {
      const cod = String(Math.floor(100000 + Math.random() * 900000));
      sessionStorage.setItem("vt_reset", JSON.stringify({ username: u.username, cod: await hash(cod), exp: Date.now() + 10 * 6e4, tent: 0 }));
      demo.innerHTML = `Modo demonstração: seu código é <b>${cod}</b>. Com o backend, ele chega por e-mail.`; demo.hidden = false;
    } else { sessionStorage.removeItem("vt_reset"); demo.hidden = true; }
    $("#msgEnviado").textContent = "Se existir uma conta com esses dados, enviamos um código de 6 dígitos, válido por 10 minutos.";
    f1.hidden = true; f2.hidden = false; f2.codigo.focus();
  };
  f2.onsubmit = async e => {
    e.preventDefault();
    const p = pedido(), d = Object.fromEntries(new FormData(f2));
    if (!p || Date.now() > p.exp) return toast("Código inválido ou expirado. Peça um novo.");
    if (p.tent >= 5) { sessionStorage.removeItem("vt_reset"); return toast("Muitas tentativas. Peça um novo código."); }
    if (await hash(d.codigo.trim()) !== p.cod) { p.tent++; sessionStorage.setItem("vt_reset", JSON.stringify(p)); return toast("Código incorreto."); }
    if (d.senha !== d.senha2) return toast("As senhas não conferem.");
    if (!Object.values(REGRAS).every(fn => fn(d.senha))) return toast("A senha não atende aos requisitos.");
    const u = db.users().find(x => x.username === p.username); u.senha = await hash(d.senha); db.salvarUser(u);
    sessionStorage.removeItem("vt_reset"); toast("Senha redefinida! Faça login."); setTimeout(() => location.href = "login.html", 900);
  };
  $("#reenviar").onclick = () => { f2.reset(); f2.hidden = true; f1.hidden = false; f1.conta.focus(); };
}


function criar() {
  if (!exigirLogin()) return;
  const u = me(), f = $("#formRacha"), eid = +new URLSearchParams(location.search).get("editar"), ed = eid ? db.racha(eid) : null;
  if (eid && (!ed || ed.org !== u.username)) { toast("Só o organizador pode editar este racha."); return setTimeout(() => location.href = "index.html", 900); }
  if (ed) {
    $("#titulo").textContent = "Editar racha"; $("#lblPos").hidden = true; f.tipo.disabled = true; f.repetir.checked = !!ed.recorrente; f.tipo.title = "O tipo não pode ser alterado depois de criado, pois as posições dependem dele.";
    Object.entries(ed).forEach(([k, v]) => { const el = f.elements[k]; if (el && typeof v !== "object" && typeof v !== "boolean") el.value = v; });
    f.privado.value = ed.privado ? "1" : "0";
  } else {
    f.dataHora.min = localISO(new Date());
    let pref = u.posicao; 
    const atualizaPos = () => { f.posicao.innerHTML = posDe(f.tipo.value).map(p => `<option>${p}</option>`).join(""); f.posicao.value = posValida(f.tipo.value, pref); };
    f.posicao.onchange = () => pref = f.posicao.value; f.tipo.onchange = atualizaPos; atualizaPos();
  }

  let capa = ed?.foto || ""; seletorCapa($("#fotoCapa"), capa, v => capa = v);

  f.cep.oninput = async () => { 
    const d = digitos(f.cep.value).slice(0, 8); f.cep.value = d.length > 5 ? d.slice(0, 5) + "-" + d.slice(5) : d;
    if (d.length < 8) return;
    try {
      const j = await (await fetch(`https://viacep.com.br/ws/${d}/json/`)).json();
      if (!j.erro) { f.endereco.value = j.logradouro || f.endereco.value; f.bairro.value = j.bairro || ""; f.cidade.value = j.localidade ? `${j.localidade}/${j.uf}` : ""; }
    } catch { }
  };
  f.onsubmit = e => {
    e.preventDefault();
    const d = Object.fromEntries(new FormData(f)), vagas = +d.vagas;
    if (ed && vagas < ocupadas(ed)) return toast(`Já existem ${ocupadas(ed)} jogadores confirmados ou com vaga reservada.`);
    const base = { nome: d.nome.trim(), tipo: d.tipo || ed?.tipo, recorrente: d.repetir === "1", privado: d.privado === "1", vagas, preco: +d.preco || 0, arena: d.arena.trim(), dataHora: d.dataHora, cep: d.cep, endereco: d.endereco.trim(), numero: d.numero.trim(), bairro: d.bairro.trim(), cidade: d.cidade.trim(), complemento: d.complemento.trim(), foto: capa, obs: d.obs.trim() };
    const r = ed ? { ...ed, ...base }
      : { ...base, id: Date.now(), org: u.username, orgNome: u.nome, whatsapp: u.whatsapp, jogadores: [{ username: u.username, nome: u.nome, posicao: d.posicao }], pedidos: [], espera: [] };
    promover(r); db.salvarRacha(r);
    toast(ed ? "Racha atualizado!" : "Racha criado!"); setTimeout(() => location.href = `racha.html?id=${r.id}`, 700);
  };
}


function sortearTimes(js) { 
  const A = [], B = [];
  POSICOES.forEach(p => js.filter(j => j.posicao === p).sort(() => Math.random() - .5).forEach(j => (A.length <= B.length ? A : B).push(j)));
  return [A, B];
}
function racha() {
  const id = +new URLSearchParams(location.search).get("id"), box = $("#detalhe");
  let times = null, aba = ["avaliar", "ranking", "sumula", "fotos"].includes(new URLSearchParams(location.search).get("aba")) ? new URLSearchParams(location.search).get("aba") : "detalhes", aval = null, sum = null, rk = "gols", aberta = null;
  const fotosHTML = (r, pode) => {
    const fs = r.fotos || [];
    return `<p class="sub">Fotos da galera, do jogo e do campo. ${pode ? "Adicione as suas." : "Entre no racha para adicionar fotos."}</p>
      ${pode && fs.length < 24 ? `<div class="actions left" style="margin:0 0 var(--sp-4)"><button class="btn btn-solid btn-sm" data-a="foto-add">${ico("camera", 16)}Adicionar fotos</button><input type="file" id="fotoInp" accept="image/*" multiple hidden></div>` : ""}
      ${fs.length ? `<div class="galeria">${fs.map(f => `<button type="button" data-a="foto-abrir" data-u="${f.id}" aria-label="Abrir foto"><img src="${f.src}" alt="Foto enviada por ${esc(f.nome)}" loading="lazy"></button>`).join("")}</div>` : `<p class="empty">Ainda não tem fotos. Que tal registrar a galera?</p>`}`;
  };
  const lightbox = (r, u, souOrg) => {
    const fs = r.fotos || [], i = fs.findIndex(f => String(f.id) === aberta); if (i < 0) return "";
    const f = fs[i], pode = u && (souOrg || f.por === u.username);
    return `<div class="lightbox" data-a="foto-fechar" role="dialog" aria-label="Foto"><button class="lb-x" data-a="foto-fechar" aria-label="Fechar">✕</button>${fs.length > 1 ? `<button class="lb-nav prev" data-a="foto-nav" data-u="-1" aria-label="Anterior">‹</button><button class="lb-nav next" data-a="foto-nav" data-u="1" aria-label="Próxima">›</button>` : ""}<figure onclick="event.stopPropagation()"><img src="${f.src}" alt=""><figcaption>Por ${esc(f.nome)}, ${new Date(f.data).toLocaleDateString("pt-BR")}${pode ? `<button class="btn btn-sm btn-danger" data-a="foto-del" data-u="${f.id}">Excluir</button>` : ""}</figcaption></figure></div>`;
  };


  const rankingHTML = r => {
    const sid = r.serieId || r.id, serie = db.rachas().filter(x => (x.serieId || x.id) === sid && !x.cancelado), ids = serie.map(x => x.id);
    const feitos = serie.filter(x => new Date(x.dataHora) < Date.now()), av = db.avals().filter(a => ids.includes(a.rachaId)), nomes = {};
    serie.forEach(x => x.jogadores.forEach(j => nomes[j.username] = j));
    const lista = Object.values(nomes).map(p => {
      const jg = feitos.filter(x => x.jogadores.some(j => j.username === p.username)), mine = av.filter(a => a.para === p.username);
      return { p, jogos: jg.length, n: mine.length, gols: jg.reduce((s, x) => s + (x.stats?.[p.username]?.g || 0), 0), assist: jg.reduce((s, x) => s + (x.stats?.[p.username]?.a || 0), 0), nota: mine.length ? mine.reduce((s, a) => s + (a.notas.tecnica + a.notas.fairplay + a.notas.pontual) / 3, 0) / mine.length : 0 };
    }).filter(x => x.jogos);
    const ORD = { gols: ["Artilheiros", x => x.gols, v => `${v} gol${v === 1 ? "" : "s"}`], assist: ["Assistências", x => x.assist, v => `${v} assist.`], nota: ["Melhor nota", x => x.nota, fmt1], jogos: ["Presença", x => x.jogos, v => `${v} jogo${v === 1 ? "" : "s"}`] };
    const [, f, fv] = ORD[rk], l = lista.filter(x => rk !== "nota" || x.n).sort((a, b) => f(b) - f(a) || b.gols - a.gols || b.jogos - a.jogos);
    return `<p class="sub">${feitos.length ? `${feitos.length} jogo${feitos.length === 1 ? "" : "s"} disputado${feitos.length === 1 ? "" : "s"} neste racha${serie.length > 1 ? ", somando todas as edições semanais" : ""}.` : "O ranking aparece depois do primeiro jogo."}</p>
      <div class="seg">${Object.entries(ORD).map(([k, [t]]) => `<button type="button" class="${k === rk ? "on" : ""}" data-a="rk" data-u="${k}">${t}</button>`).join("")}</div>
      <ul class="rows">${l.length ? l.map((x, i) => `<li><span class="num${i === 0 ? " top" : ""}">${i + 1}</span>${avatar(quem(x.p), 38)}<div class="grow"><a class="pl" href="jogador.html?u=${encodeURIComponent(x.p.username)}"><b>${esc(x.p.nome)}</b></a><small>${x.jogos} partida${x.jogos === 1 ? "" : "s"}</small></div><b class="val">${fv(f(x))}</b></li>`).join("") : `<li class="empty grow">Sem dados ainda para esta categoria.</li>`}</ul>`;
  };
  const sumulaHTML = (r, org) => {
    const st = r.stats || {}, zero = { g: 0, a: 0 };
    if (org && !sum) sum = Object.fromEntries(r.jogadores.map(j => [j.username, { ...zero, ...st[j.username] }]));
    const v = j => (org ? sum : st)[j.username] || zero, tot = k => r.jogadores.reduce((s, j) => s + v(j)[k], 0);
    const notas = r.jogadores.map(j => { const l = db.avals().filter(a => a.rachaId === r.id && a.para === j.username); return [j.username, l.length > 1 ? l.reduce((s, a) => s + (a.notas.tecnica + a.notas.fairplay + a.notas.pontual) / 3, 0) / l.length : 0]; });
    const top = Math.max(...notas.map(n => n[1])), craque = top > 0 ? notas.find(n => n[1] === top)[0] : null;
    const cel = (j, k) => org ? `<span class="stepper"><button type="button" data-a="sm" data-u="${esc(j.username)}" data-k="${k}" data-d="-1" aria-label="Menos">−</button><b>${v(j)[k]}</b><button type="button" data-a="sm" data-u="${esc(j.username)}" data-k="${k}" data-d="1" aria-label="Mais">+</button></span>` : `<b class="val">${v(j)[k]}</b>`;
    return `<p class="sub">${org ? "Registre os gols e assistências de cada jogador. Os números entram nas estatísticas dos perfis." : "Números registrados pelo organizador."}</p>
      <div class="stats"><div><strong>${tot("g")}</strong><span>Gols</span></div><div><strong>${tot("a")}</strong><span>Assistências</span></div><div><strong>${r.jogadores.length}</strong><span>Jogadores</span></div></div>
      <ul class="rows sum"><li class="sum-head"><span class="grow">Jogador</span><span class="col">Gols</span><span class="col">Assist.</span></li>${r.jogadores.map(j => `<li>${avatar(quem(j), 34)}<div class="grow"><a class="pl" href="jogador.html?u=${encodeURIComponent(j.username)}"><b>${esc(j.nome)}</b></a>${j.username === craque ? ` <span class="chip">${ico("star", 12)}Craque do racha</span>` : ""}<small>${esc(j.posicao)}</small></div><span class="col">${cel(j, "g")}</span><span class="col">${cel(j, "a")}</span></li>`).join("")}</ul>
      ${org ? `<div class="actions left"><button class="btn btn-solid" data-a="sum-salvar">Salvar números</button></div>` : r.stats ? "" : `<p class="muted" style="margin-top:1rem">O organizador ainda não registrou os números.</p>`}`;
  };
  const formAval = () => `<div class="av-form">${CATS.map(([k, l]) => `<div class="av-cat"><span>${l}</span><span class="stars" role="radiogroup" aria-label="${l}">${[1, 2, 3, 4, 5].map(n => `<button type="button" class="star${aval.notas[k] >= n ? " on" : ""}" data-a="nota" data-k="${k}" data-n="${n}" aria-label="${n} de 5">${ico("star", 24)}</button>`).join("")}</span></div>`).join("")}<textarea id="avTxt" maxlength="200" placeholder="Comentário (opcional)">${esc(aval.comentario)}</textarea><div class="actions left"><button class="btn btn-solid btn-sm" data-a="av-salvar">Salvar avaliação</button><button class="btn btn-line btn-sm" data-a="av-cancel">Cancelar</button></div></div>`;
  const avaliarHTML = (r, u) => {
    const feitas = db.avals().filter(a => a.rachaId === r.id && a.de === u.username), outros = r.jogadores.filter(j => j.username !== u.username);
    return `<p class="sub">Avalie quem jogou com você. As notas entram no perfil de cada jogador.</p><ul class="rows">${outros.map(j => {
      const a = feitas.find(x => x.para === j.username), aberto = aval && aval.para === j.username;
      return `<li class="av-li"><div class="av-row">${avatar(quem(j), 38)}<div class="grow"><b>${esc(j.nome)}</b><small>${esc(j.posicao)}</small></div>${a && !aberto ? `<span class="chip">${ico("star", 13)}${mediaN(a.notas)}</span>` : ""}${aberto ? "" : `<button class="btn btn-line btn-sm" data-a="av-abrir" data-u="${esc(j.username)}">${a ? "Editar" : "Avaliar"}</button>`}</div>${aberto ? formAval() : ""}</li>`;
    }).join("") || `<li class="empty grow">Não há outros jogadores para avaliar.</li>`}</ul>`;
  };
  const mudar = fn => { const r = db.racha(id); if (fn(r) === false) return; db.salvarRacha(r); draw(); };
  box.onchange = async e => { 
    if (e.target.id !== "fotoInp") return;
    const u = me(), rr = db.racha(id); if (!u || !(rr.org === u.username || rr.jogadores.some(j => j.username === u.username))) return;
    const files = [...e.target.files].slice(0, Math.min(6, 24 - (rr.fotos || []).length));
    try {
      const novas = []; for (const [i, fl] of files.entries()) novas.push({ id: Date.now() + i, src: await lerFotoWide(fl), por: u.username, nome: u.nome, data: Date.now() });
      mudar(r => { r.fotos = [...(r.fotos || []), ...novas]; toast(novas.length > 1 ? "Fotos adicionadas!" : "Foto adicionada!"); });
    } catch { toast("Não foi possível salvar. Tente fotos menores."); }
  };
  document.addEventListener("keydown", e => { if (e.key === "Escape" && aberta) { aberta = null; draw(); } });
  const tira = (r, un) => { ["jogadores", "pedidos", "espera", "aconfirmar"].forEach(k => r[k] = (r[k] || []).filter(j => j.username !== un)); promover(r); };

  function draw() {
    const r = db.racha(id), u = me();
    if (!r) { box.innerHTML = `<p class="empty">Racha não encontrado. <a class="link" href="index.html">Voltar</a></p>`; return; }
    const sou = k => u && (r[k] || []).find(j => j.username === u.username), souOrg = u && r.org === u.username;
    const jog = sou("jogadores"), ped = sou("pedidos"), esp = sou("espera"), conf = sou("aconfirmar");
    const n = r.jogadores.length, cheio = ocupadas(r) >= r.vagas, passou = new Date(r.dataHora) < Date.now();
    const mapa = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.endereco + " " + (r.numero || "") + " " + (r.cidade || ""))}`;
    const msg = `Bora jogar? ${r.nome} — ${fmtData(r.dataHora)} (${r.arena}). Entre aqui: ${location.href}`;
    const contagem = posDe(r.tipo).map(p => [p, r.jogadores.filter(j => j.posicao === p).length]).filter(x => x[1]).map(x => `${x[0]} ${x[1]}`).join(" · ");

    let acao;
    if (r.cancelado || passou) acao = `<p class="muted">${r.cancelado ? "Inscrições encerradas." : "Este racha já aconteceu."}</p>`;
    else if (jog) acao = `<p>Você está confirmado como <b>${esc(jog.posicao)}</b>.</p>${souOrg ? "" : `<div class="actions left"><button class="btn btn-line" data-a="sair">Sair do racha</button></div>`}`;
    else if (conf) acao = `<p><span class="chip warn">Confirme sua presença</span></p><p class="muted" style="margin:.5rem 0 0">Você jogou o último racha deste grupo e sua vaga está reservada até ${fmtData(r.prazoConfirmacao)}. Depois disso ela vai para a lista de espera.</p><div class="actions left"><button class="btn btn-solid" data-a="vou">Vou jogar</button><button class="btn btn-line" data-a="naovou">Não vou</button></div>`;
    else if (ped) acao = `<p><span class="chip warn">Aguardando aprovação</span></p><div class="actions left"><button class="btn btn-line" data-a="sair">Cancelar solicitação</button></div>`;
    else if (esp) acao = `<p><span class="chip warn">Na lista de espera (${r.espera.indexOf(esp) + 1}º)</span></p><div class="actions left"><button class="btn btn-line" data-a="sair">Sair da espera</button></div>`;
    else acao = `<div class="join"><label>Sua posição<select id="selPos">${posDe(r.tipo).map(p => `<option${posValida(r.tipo, u?.posicao) === p ? " selected" : ""}>${p}</option>`).join("")}</select></label>
      <button class="btn btn-solid" data-a="entrar">${r.privado ? "Solicitar entrada" : cheio ? "Entrar na lista de espera" : "Entrar no racha"}</button></div>`;

    const encerrado = passou && !r.cancelado, podeAvaliar = encerrado && !!jog, abaAv = podeAvaliar && aba === "avaliar", abaSum = encerrado && aba === "sumula", abaRk = aba === "ranking", abaFt = aba === "fotos";
    const faltam = podeAvaliar ? r.jogadores.filter(j => j.username !== u.username && !db.avals().some(a => a.rachaId === r.id && a.de === u.username && a.para === j.username)).length : 0;
    const tabs = `<div class="tabs"><button class="tab${abaAv || abaSum || abaRk || abaFt ? "" : " on"}" data-a="aba" data-u="detalhes">Detalhes</button><button class="tab${abaRk ? " on" : ""}" data-a="aba" data-u="ranking">Ranking</button><button class="tab${abaFt ? " on" : ""}" data-a="aba" data-u="fotos">Fotos${(r.fotos || []).length ? ` (${r.fotos.length})` : ""}</button>${encerrado ? `<button class="tab${abaSum ? " on" : ""}" data-a="aba" data-u="sumula">Gols e assistências</button>` : ""}${podeAvaliar ? `<button class="tab${abaAv ? " on" : ""}" data-a="aba" data-u="avaliar">Avaliar jogadores${faltam ? ` (${faltam})` : ""}</button>` : ""}</div>`;
    if (abaAv || abaSum || abaRk || abaFt) { box.innerHTML = `<div class="panel wide"><div class="row-between"><h2>${esc(r.nome)}</h2></div>${tabs}${abaAv ? avaliarHTML(r, u) : abaSum ? sumulaHTML(r, souOrg) : abaFt ? fotosHTML(r, !!(jog || souOrg)) : rankingHTML(r)}</div>${abaFt ? lightbox(r, u, souOrg) : ""}`; return; }
    box.innerHTML = `<div class="panel wide">
      ${r.cancelado ? `<p class="aviso">Este racha foi cancelado pelo organizador.</p>` : ""}
      ${capaDe(r) ? `<div class="capa-hero"><img src="${esc(capaDe(r))}" alt="Foto do racha" onerror="this.parentNode.remove()"></div>` : ""}<div class="row-between"><h2>${esc(r.nome)}</h2><span class="chips">${r.recorrente ? `<span class="chip">${ico("repeat", 13)}Semanal</span>` : ""}${r.privado ? `<span class="chip">${ico("lock", 13)}Privado</span>` : ""}</span></div>${tabs}
      <div class="info-grid">
        <p><b>Arena</b>${esc(r.arena)} (${esc(r.tipo)})</p><p><b>Quando</b>${fmtData(r.dataHora)}</p>
        <p><b>Onde</b>${esc(local(r))}${r.complemento ? `<br><small>${esc(r.complemento)}</small>` : ""}</p><p><b>Valor por jogador</b>${dinheiro(r.preco)}</p>
        <p><b>Organizador</b><a class="pl" href="jogador.html?u=${encodeURIComponent(r.org)}">${esc(r.orgNome)}</a></p><p><b>Vagas</b>${n}/${r.vagas}${r.aconfirmar?.length ? ` (+${r.aconfirmar.length} reservadas)` : ""}${r.espera.length ? ` · ${r.espera.length} na espera` : ""}</p>
      </div>
      ${r.obs ? `<p class="obs">${esc(r.obs)}</p>` : ""}
      <div class="actions left">
        <a class="btn btn-line btn-sm" href="${mapa}" target="_blank" rel="noopener">${ico("map", 16)}Ver no mapa</a>
        <a class="btn btn-line btn-sm" href="${wa(r.whatsapp)}" target="_blank" rel="noopener">${ico("chat", 16)}Falar com organizador</a>
        <a class="btn btn-line btn-sm" href="https://wa.me/?text=${encodeURIComponent(msg)}" target="_blank" rel="noopener">${ico("send", 16)}Convidar</a>
        <button class="btn btn-line btn-sm" data-a="copiar">${ico("link", 16)}Copiar link</button>
      </div>
      <hr class="divider">${acao}
      <h3>Jogadores (${n}/${r.vagas})</h3>${contagem ? `<p class="info" style="margin-bottom:.6rem">${contagem}</p>` : ""}
      <ul class="rows">${n ? r.jogadores.map((j, i) => `<li>${avatar(quem(j), 38)}<div class="grow"><a class="pl" href="jogador.html?u=${encodeURIComponent(j.username)}"><b>${esc(j.nome)}</b></a> <small>${esc(j.username)}</small></div><span class="chip">${esc(j.posicao)}</span>${souOrg && j.username !== r.org ? `<button class="x" title="Remover" data-a="remover" data-u="${esc(j.username)}">${ico("x", 14)}</button>` : ""}</li>`).join("") : `<li class="empty grow">Ninguém confirmado ainda. Seja o primeiro!</li>`}</ul>
      ${souOrg ? `
        ${r.aconfirmar?.length ? `<h3>Aguardando confirmação (${r.aconfirmar.length})</h3><p class="info" style="margin-bottom:.6rem">Prazo: ${fmtData(r.prazoConfirmacao)}. Quem não responder perde a vaga.</p><ul class="rows">${r.aconfirmar.map(j => `<li>${avatar(quem(j), 38)}<div class="grow"><b>${esc(j.nome)}</b> <small>${esc(j.posicao)}</small></div><button class="x" data-a="remover" data-u="${esc(j.username)}" aria-label="Liberar vaga">✕</button></li>`).join("")}</ul>` : ""}
        ${r.pedidos.length ? `<h3>Solicitações pendentes (${r.pedidos.length})</h3><ul class="rows">${r.pedidos.map(j => `<li class="pend">${avatar(quem(j), 38)}<div class="grow"><b>${esc(j.nome)}</b> <small>${esc(j.username)} · ${esc(j.posicao)}</small></div><button class="btn btn-solid btn-sm" data-a="aprovar" data-u="${esc(j.username)}">Aprovar</button><button class="btn btn-danger btn-sm" data-a="recusar" data-u="${esc(j.username)}">Recusar</button></li>`).join("")}</ul>` : ""}
        ${r.espera.length ? `<h3>Lista de espera</h3><ul class="rows">${r.espera.map(j => `<li>${avatar(quem(j), 38)}<div class="grow"><b>${esc(j.nome)}</b> <small>${esc(j.posicao)}</small></div><button class="x" data-a="remover" data-u="${esc(j.username)}">${ico("x", 14)}</button></li>`).join("")}</ul>` : ""}
        ${times ? `<h3>Times sorteados</h3><div class="teams">${times.map((t, i) => `<div><h4>Time ${"AB"[i]} (${t.length})</h4><ul>${t.map(j => `<li>${avatar(quem(j), 24)}<span>${esc(j.nome)}</span> <small>${esc(j.posicao)}</small></li>`).join("")}</ul></div>`).join("")}</div>` : ""}
        <div class="actions left">
          ${n >= 2 ? `<button class="btn btn-line" data-a="sortear">${ico("shuffle", 16)}${times ? "Sortear de novo" : "Sortear times"}</button>` : ""}
          ${r.cancelado ? "" : `<a class="btn btn-line" href="criar.html?editar=${r.id}">Editar racha</a><button class="btn btn-danger" data-a="cancelar">Cancelar racha</button>`}
        </div>` : ""}
    </div>`;
  }

  box.onclick = e => {
    const b = e.target.closest("[data-a]"); if (!b) return;
    const a = b.dataset.a, un = b.dataset.u, u = me();
    if (a === "aba") { aba = un; aval = null; sum = null; aberta = null; return draw(); }
    if (a === "foto-add") return $("#fotoInp")?.click();
    if (a === "foto-abrir") { aberta = un; return draw(); }
    if (a === "foto-fechar") { aberta = null; return draw(); }
    if (a === "foto-nav") { const fs = db.racha(id).fotos || [], i = fs.findIndex(f => String(f.id) === aberta); if (i < 0) return; aberta = String(fs[(i + +un + fs.length) % fs.length].id); return draw(); }
    if (a === "foto-del") {
      const rr = db.racha(id), f = (rr.fotos || []).find(x => String(x.id) === un);
      if (!f || !u || !(rr.org === u.username || f.por === u.username) || !confirm("Excluir esta foto?")) return;
      aberta = null; return mudar(r => { r.fotos = r.fotos.filter(x => String(x.id) !== un); toast("Foto excluída."); });
    }
    if (a === "rk") { rk = un; return draw(); }
    if (a === "sm" || a === "sum-salvar") { const rr = db.racha(id); if (!u || rr.org !== u.username || new Date(rr.dataHora) > Date.now()) return; }
    if (a === "sm") { const o = sum[un], k = b.dataset.k; o[k] = Math.max(0, Math.min(30, o[k] + +b.dataset.d)); return draw(); }
    if (a === "sum-salvar") return mudar(r => { r.stats = sum; sum = null; toast("Números salvos!"); });
    if (/^av-|^nota$/.test(a)) { const rr = db.racha(id); if (!u || !rr.jogadores.some(j => j.username === u.username) || new Date(rr.dataHora) > Date.now()) return; }
    if (a === "av-abrir") { const ex = db.avals().find(x => x.rachaId === id && x.de === u.username && x.para === un); aval = { para: un, notas: ex ? { ...ex.notas } : { tecnica: 0, fairplay: 0, pontual: 0 }, comentario: ex?.comentario || "" }; return draw(); }
    if (a === "nota") { aval.comentario = $("#avTxt")?.value ?? aval.comentario; aval.notas[b.dataset.k] = +b.dataset.n; return draw(); }
    if (a === "av-cancel") { aval = null; return draw(); }
    if (a === "av-salvar") {
      aval.comentario = $("#avTxt").value.trim();
      if (Object.values(aval.notas).some(v => !v)) return toast("Dê uma nota de 1 a 5 em cada categoria.");
      const l = db.avals().filter(x => !(x.rachaId === id && x.de === u.username && x.para === aval.para));
      l.push({ id: `${id}-${u.username}-${aval.para}`, rachaId: id, de: u.username, para: aval.para, notas: aval.notas, comentario: aval.comentario, data: Date.now() });
      db.saveAvals(l); aval = null; toast("Avaliação salva!"); return draw();
    }
    if (a === "copiar") return navigator.clipboard?.writeText(location.href).then(() => toast("Link copiado!"), () => toast("Copie o endereço da barra do navegador."));
    if (a === "sortear") { times = sortearTimes(db.racha(id).jogadores); return draw(); }
    if (a === "entrar") {
      if (!exigirLogin()) return;
      const p = { username: u.username, nome: u.nome, posicao: $("#selPos").value };
      return mudar(r => {
        if (r.privado && r.org !== u.username) { r.pedidos.push(p); toast("Solicitação enviada ao organizador!"); }
        else if (ocupadas(r) >= r.vagas) { r.espera.push(p); toast("Racha lotado: você entrou na lista de espera."); }
        else { r.jogadores.push(p); toast("Presença confirmada!"); }
      });
    }
    if (a === "vou") return mudar(r => { const p = (r.aconfirmar || []).find(j => j.username === u.username); if (!p) return false; r.aconfirmar = r.aconfirmar.filter(j => j !== p); r.jogadores.push(p); toast("Presença confirmada!"); });
    if (a === "naovou") return mudar(r => { tira(r, u.username); toast("Tudo certo, sua vaga foi liberada."); });
    if (a === "sair") { if (db.racha(id).jogadores.some(j => j.username === u.username) && !confirm("Sair deste racha?")) return; return mudar(r => { tira(r, u.username); toast("Você saiu do racha."); }); }
    if (a === "aprovar") return mudar(r => { const p = r.pedidos.find(j => j.username === un); r.pedidos = r.pedidos.filter(j => j.username !== un); (ocupadas(r) < r.vagas ? r.jogadores : r.espera).push(p); toast(`${p.nome} aprovado!`); });
    if (a === "recusar") return mudar(r => { r.pedidos = r.pedidos.filter(j => j.username !== un); toast("Solicitação recusada."); });
    if (a === "remover") { if (!confirm("Remover este jogador?")) return; return mudar(r => tira(r, un)); }
    if (a === "cancelar") { if (!confirm("Cancelar este racha? Isso avisa todo mundo que ele não vai rolar.")) return; return mudar(r => { r.cancelado = true; toast("Racha cancelado."); }); }
  };
  draw();
}


function perfil() {
  if (!exigirLogin()) return;
  let u = me();
  seletorFoto($("#fotoPerfil"), u.foto, f => { u.foto = f; db.salvarUser(u); location.reload(); });
  $("#pNome").textContent = u.nome; $("#pSub").textContent = `${u.username} · ${u.email}`;
  const fp = $("#formPerfil"); fp.nome.value = u.nome; fp.whatsapp.value = maskTel(u.whatsapp); fp.posicao.value = u.posicao || "Meia";
  fp.onsubmit = e => { e.preventDefault(); u = { ...u, nome: fp.nome.value.trim(), whatsapp: digitos(fp.whatsapp.value), posicao: fp.posicao.value }; db.salvarUser(u); toast("Perfil atualizado!"); setTimeout(() => location.reload(), 600); };
  $("#pPublico").href = "jogador.html?u=" + encodeURIComponent(u.username);
  $("#sair").onclick = () => { localStorage.removeItem("vt_session"); location.href = "index.html"; };

  const todos = db.rachas(), tem = (r, k) => (r[k] || []).some(j => j.username === u.username);
  const abas = { jogar: todos.filter(r => tem(r, "jogadores")), organizo: todos.filter(r => r.org === u.username), pendentes: todos.filter(r => !r.cancelado && new Date(r.dataHora) > Date.now() && (tem(r, "pedidos") || tem(r, "espera") || tem(r, "aconfirmar"))), avaliar: todos.filter(r => !r.cancelado && new Date(r.dataHora) < Date.now() && tem(r, "jogadores")) };
  const faltam = r => r.jogadores.filter(j => j.username !== u.username && !db.avals().some(a => a.rachaId === r.id && a.de === u.username && a.para === j.username)).length;
  const status = (r, k) => k === "avaliar" ? (faltam(r) ? `Faltam ${faltam(r)}` : "Tudo avaliado") : r.cancelado ? "Cancelado" : new Date(r.dataHora) < Date.now() ? "Encerrado"
    : k === "pendentes" ? (tem(r, "aconfirmar") ? "Confirmar presença" : tem(r, "pedidos") ? "Aguardando aprovação" : "Lista de espera")
    : k === "organizo" ? `${r.jogadores.length}/${r.vagas} jogadores` : r.jogadores.find(j => j.username === u.username).posicao;
  let aba = abas.pendentes.some(r => tem(r, "aconfirmar")) ? "pendentes" : "jogar";
  const draw = () => {
    $$(".tab").forEach(t => { t.classList.toggle("on", t.dataset.t === aba); t.textContent = t.dataset.l + ` (${abas[t.dataset.t].length})`; });
    const l = abas[aba];
    $("#pLista").innerHTML = l.length ? l.map(r => `<li><a class="grow" href="racha.html?id=${r.id}${aba === "avaliar" ? "&aba=avaliar" : ""}"><b>${esc(r.nome)}</b><small>${fmtData(r.dataHora)}, ${esc(r.arena)}</small></a><span class="chip ${aba === "pendentes" || (aba === "avaliar" && faltam(r)) ? "warn" : ""}">${esc(status(r, aba))}</span></li>`).join("") : `<li class="empty grow">Nada por aqui ainda.</li>`;
  };
  $$(".tab").forEach(t => t.onclick = () => { aba = t.dataset.t; draw(); });
  draw();
}


function estat(un, rs = db.rachas()) {
  const jogou = rs.filter(r => !r.cancelado && new Date(r.dataHora) < Date.now() && r.jogadores.some(j => j.username === un)).sort((a, b) => new Date(b.dataHora) - new Date(a.dataHora));
  const av = db.avals().filter(a => a.para === un).sort((a, b) => b.data - a.data), m = k => av.length ? av.reduce((s, a) => s + a.notas[k], 0) / av.length : 0;
  return { jogou, av, m, jogos: jogou.length, gols: jogou.reduce((s, r) => s + (r.stats?.[un]?.g || 0), 0), assist: jogou.reduce((s, r) => s + (r.stats?.[un]?.a || 0), 0), org: rs.filter(r => r.org === un && !r.cancelado).length, nota: av.length ? CATS.reduce((s, [k]) => s + m(k), 0) / CATS.length : 0 };
}
const fmt1 = n => n.toLocaleString("pt-BR", { minimumFractionDigits: 1, maximumFractionDigits: 1 });


function jogador() {
  const box = $("#jogador"), un = new URLSearchParams(location.search).get("u") || me()?.username, rs = db.rachas();
  const base = db.user(un) || rs.flatMap(r => r.jogadores).find(j => j.username === un);
  if (!base) { box.innerHTML = `<p class="empty">Jogador não encontrado. <a class="link" href="index.html">Voltar</a></p>`; return; }
  const e = estat(un, rs), { jogou, av, m } = e;
  const pos = {}; rs.forEach(r => r.jogadores.filter(j => j.username === un).forEach(j => pos[j.posicao] = (pos[j.posicao] || 0) + 1));
  const autor = a => quem({ username: a, nome: (db.user(a) || rs.flatMap(r => r.jogadores).find(j => j.username === a) || { nome: a }).nome });
  const coment = av.filter(a => a.comentario).slice(0, 5), tile = (v, l) => `<div><strong>${v}</strong><span>${l}</span></div>`;
  document.title = `Várzea Tech - ${base.nome}`;
  box.innerHTML = `<div class="panel wide">
    <div class="profile-head">${avatar(quem(base), 96)}<div class="grow"><h2>${esc(base.nome)}</h2><p class="muted">${esc(un)}</p><p style="margin-top:.5rem"><span class="chip">${esc(base.posicao || "Sem posição")}</span></p></div>${me()?.username === un ? `<a class="btn btn-line btn-sm" href="perfil.html">Editar perfil</a>` : ""}</div>
    <div class="stats">${tile(e.jogos, "Partidas")}${tile(e.gols, "Gols")}${tile(e.assist, "Assistências")}${tile(e.jogos ? fmt1(e.gols / e.jogos) : "-", "Gols por jogo")}${tile(av.length ? fmt1(e.nota) : "-", "Nota média")}${tile(e.org, "Rachas organizados")}</div>
    <h3>Avaliação por categoria</h3>
    ${av.length ? `<div class="cats">${CATS.map(([k, l]) => `<div class="cat"><span>${l}</span><div class="bar-v"><i style="width:${m(k) / 5 * 100}%"></i></div><b>${fmt1(m(k))}</b></div>`).join("")}</div><p class="muted" style="margin-top:.6rem;font-size:.85rem">${av.length} avaliações recebidas</p>` : `<p class="muted">Ainda sem avaliações. Elas aparecem depois dos rachas.</p>`}
    ${Object.keys(pos).length ? `<h3>Posições jogadas</h3><p class="chips">${Object.entries(pos).sort((a, b) => b[1] - a[1]).map(([p, n]) => `<span class="chip">${esc(p)} ${n}x</span>`).join("")}</p>` : ""}
    ${coment.length ? `<h3>O que dizem</h3><ul class="rows">${coment.map(a => { const p = autor(a.de); return `<li>${avatar(p, 34)}<div class="grow"><a class="pl" href="jogador.html?u=${encodeURIComponent(a.de)}"><b>${esc(p.nome)}</b></a><small>${esc(a.comentario)}</small></div><span class="chip">${ico("star", 13)}${mediaN(a.notas)}</span></li>`; }).join("")}</ul>` : ""}
    <h3>Últimos rachas</h3>
    ${jogou.length ? `<ul class="rows">${jogou.slice(0, 5).map(r => { const s = r.stats?.[un]; return `<li><a class="grow" href="racha.html?id=${r.id}"><b>${esc(r.nome)}</b><small>${fmtData(r.dataHora)}, ${esc(r.arena)}</small></a>${s ? `<span class="chip">${s.g} gol${s.g === 1 ? "" : "s"}, ${s.a} assist.</span>` : ""}</li>`; }).join("")}</ul>` : `<p class="muted">Nenhum racha jogado ainda.</p>`}
  </div>`;
}

document.addEventListener("DOMContentLoaded", function() {
    const formulario = document.getElementById("formCad");
    

    if (formulario) {
        formulario.addEventListener("submit", async function(event) {
            event.preventDefault();
            
            const dadosJogador = {
                usuario: document.querySelector('input[name="usuario"]').value,
                nome: document.querySelector('input[name="nome"]').value,
                telefone: document.querySelector('input[name="whatsapp"]').value,
                posicao: document.querySelector('select[name="posicao"]').value,
                email: document.querySelector('input[name="email"]').value,
                senha: document.querySelector('input[name="senha"]').value
            };

            try {
                const resposta = await fetch("http://192.168.56.1:8080/usuarios", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(dadosJogador)
                });

                if (resposta.ok) {
                    alert("Sucesso! Jogador gravado no banco.");
                    window.location.href = "login.html"; 
                } else {
                    const erroApi = await resposta.text();
                    console.error("O Spring Boot rejeitou os dados:", erroApi);
                    alert("Erro na API. Verifica a Consola para ver o motivo.");
                }
            } catch (erro) {
                console.error("Servidor Spring Boot inacessível:", erro);
            }
        });
    }
});


const PAGINAS = { home, cadastro, login, esqueci, criar, racha, perfil, jogador };
document.addEventListener("DOMContentLoaded", () => { seed(); seedPassado(); gerarRecorrentes(); expirarConfirmacoes(); ajustarPosicoes(); layout(); PAGINAS[document.body.dataset.page]?.(); });