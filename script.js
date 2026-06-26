let currentDeclPt = 0;
let hasPhoto = false;
let declareCount = 0;
const DECL_MAX = 3;

function loadDeclareCount() {
  const raw = storeLoad('declareData', { date: '', count: 0 });
  const today = new Date().toISOString().slice(0, 10);
  if (raw.date !== today) {
    declareCount = 0;
    storeSave('declareData', { date: today, count: 0 });
  } else {
    declareCount = raw.count;
  }
}

function saveDeclareCount() {
  const today = new Date().toISOString().slice(0, 10);
  storeSave('declareData', { date: today, count: declareCount });
}

function renderDeclarations() {
  loadDeclareCount();
  const countEl = document.getElementById('decl-count');
  if (countEl) countEl.textContent = declareCount;
  // Toggle limit state
  const list = document.getElementById('decl-full-list');
  const limitMsg = document.getElementById('decl-limit-msg');
  const intro = document.querySelector('.decl-intro');
  if (declareCount >= DECL_MAX) {
    if (!limitMsg) {
      const msg = document.createElement('div');
      msg.id = 'decl-limit-msg';
      msg.className = 'empty-state';
      msg.innerHTML = '<div class="empty-icon">\u2705</div><div class="empty-title">Dzisiejszy limit wykorzystany</div><div class="empty-desc">Wykorzysta\u0142e\u015B ju\u017C 3 eko-deklaracje dzisiaj. Wr\u00F3\u0107 jutro po wi\u0119cej!</div>';
      list.parentNode.insertBefore(msg, list.nextSibling);
    }
    limitMsg.style.display = 'flex';
    list.style.display = 'none';
    document.querySelectorAll('.decl-full-item').forEach(el => el.style.pointerEvents = 'none');
  } else {
    if (limitMsg) limitMsg.style.display = 'none';
    list.style.display = '';
    document.querySelectorAll('.decl-full-item').forEach(el => el.style.pointerEvents = '');
  }
  // Update badge dots
  const dot = document.getElementById('notif-dot');
  if (dot && dot.style.display !== 'none') { }
}

// ─── STORAGE ───
function storeSave(key, val) {
  try { localStorage.setItem(key, JSON.stringify(val)); return true; }
  catch (e) { console.warn('Storage save failed:', e); return false; }
}
function storeLoad(key, fallback) {
  try {
    const v = localStorage.getItem(key);
    if (v === null) return fallback;
    const parsed = JSON.parse(v);
    // Validate types
    if (key === 'balance' && typeof parsed !== 'number') return fallback;
    if (key === 'actLog' && !Array.isArray(parsed)) return fallback;
    if (key === 'txHistory' && !Array.isArray(parsed)) return fallback;
    return parsed;
  } catch (e) { console.warn('Storage load failed for ' + key + ':', e); return fallback; }
}

// ─── HAPTICS ───
function haptic(pattern) {
  try { if (navigator.vibrate) navigator.vibrate(pattern || 10); } catch (e) { /* noop */ }
}

function navigate(screenId) {
  haptic(6);
  const current = document.querySelector('.screen.active');
  const target = document.getElementById(screenId);
  if (!target || current === target) return;

  if (current) {
    current.classList.remove('active', 'screen-enter');
    current.classList.add('screen-exit');
    setTimeout(() => current.classList.remove('screen-exit'), 250);
  }

  target.classList.remove('screen-exit');
  target.classList.add('active', 'screen-enter');
  setTimeout(() => target.classList.remove('screen-enter'), 400);

  document.querySelectorAll('.tab-item').forEach(t => {
    t.classList.toggle('active', t.dataset.tab === screenId);
  });
  moveTabIndicator(screenId);

  setTimeout(() => {
    target.querySelectorAll('.stagger > *').forEach(el => {
      el.style.animation = 'none';
      void el.offsetHeight;
      el.style.animation = '';
    });
    const pf = target.querySelector('.progress-fill');
    if (pf) {
      const w = pf.style.width || '78%';
      pf.classList.add('animate');
      pf.classList.add('animating');
      setTimeout(() => { pf.style.width = w; pf.classList.remove('animate'); }, 50);
      setTimeout(() => pf.classList.remove('animating'), 1050);
    }
  }, 100);
}

function moveTabIndicator(screenId) {
  const el = document.getElementById('tab-indicator');
  const active = document.querySelector(`.tab-item[data-tab="${screenId}"]`);
  if (active && el) {
    el.style.width = active.offsetWidth + 'px';
    el.style.left = active.offsetLeft + 'px';
  }
}

document.addEventListener('DOMContentLoaded', () => moveTabIndicator('screen-home'));
window.addEventListener('resize', () => {
  const active = document.querySelector('.tab-item.active');
  if (active) moveTabIndicator(active.dataset.tab);
});

function switchRankTab(btn, view) {
  btn.closest('.rank-tabs').querySelectorAll('.rank-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('rank-team').style.display = view === 'team' ? 'block' : 'none';
  document.getElementById('rank-individual').style.display = view === 'individual' ? 'block' : 'none';
}

document.querySelectorAll('.tab-item').forEach(tab => {
  tab.addEventListener('click', () => navigate(tab.dataset.tab));
});

// ─── MODAL ───
function openModal(emoji, name, pts) {
  haptic();
  loadDeclareCount();
  if (declareCount >= DECL_MAX) {
    renderDeclarations();
    return;
  }
  currentDeclPt = pts;
  hasPhoto = false;
  document.getElementById('modal-form').style.display = 'block';
  document.getElementById('modal-success').style.display = 'none';
  document.querySelector('#modal-form .modal-title').textContent = emoji + ' ' + name;
  document.querySelector('#modal-form .modal-pts-badge span').textContent = '+' + pts;
  document.getElementById('modal-confirm').textContent = 'Potwierd\u017A i zdob\u0105d\u017A +' + pts + ' EC';
  document.getElementById('decl-desc').value = '';
  document.getElementById('photo-area').className = 'photo-area';
  document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83D\uDCF7</div><div class="photo-label">Dodaj zdj\u0119cie (opcjonalnie)</div><div class="photo-sub">Zr\u00F3b zdj\u0119cie lub wybierz z galerii</div>';
  document.getElementById('modal-decl').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-decl').classList.remove('open');
  renderDeclarations();
}

function togglePhoto() {
  hasPhoto = true;
  const el = document.getElementById('photo-area');
  el.className = 'photo-area has-photo';
  el.innerHTML = '<div class="photo-icon">\u2705</div><div class="photo-label">Zdj\u0119cie dodane</div><div class="photo-sub">Tapnij, aby zmieni\u0107</div>';
}

function confirmDecl() {
  document.getElementById('modal-form').style.display = 'none';
  document.getElementById('modal-success').style.display = 'block';
  document.querySelector('#modal-success .pts-added').textContent = '+' + currentDeclPt;
  // Award EC and track count
  declareCount++;
  saveDeclareCount();
  earnBalance(currentDeclPt);
  const name = document.querySelector('#modal-form .modal-title').textContent;
  addToTxHistory('\uD83C\uDF31', name, currentDeclPt, userBalance, 'earned');
}

// ─── REWARD DETAIL ───
function openReward(icon, title, merchant, cost, bgColor, desc, code) {
  document.getElementById('rd-icon').textContent = icon;
  document.getElementById('rd-icon').style.background = bgColor;
  document.getElementById('rd-title').textContent = title;
  document.getElementById('rd-merchant').textContent = merchant;
  document.getElementById('rd-cost').textContent = cost + ' EC';
  document.getElementById('rd-cost-btn').textContent = cost;
  document.getElementById('rd-desc').textContent = desc;
  document.getElementById('rd-code').textContent = code;
  document.getElementById('rd-info').style.display = 'block';
  document.getElementById('rd-redeemed').classList.remove('active');
  document.getElementById('rd-redeemed').style.display = 'none';
  document.getElementById('screen-reward').classList.add('active');
}

function hideDetail() {
  document.getElementById('screen-reward').classList.remove('active');
}

function redeemReward() {
  haptic();
  // Read cost
  const costText = document.getElementById('rd-cost-btn').textContent;
  const cost = parseInt(costText) || 0;
  // Check balance
  if (userBalance < cost) {
    const btn = document.getElementById('rd-info').querySelector('.rd-btn.primary');
    btn.textContent = 'Za ma\u0142o EC!';
    btn.style.background = 'var(--error)';
    setTimeout(() => { btn.textContent = 'Wymie\u0144 za ' + cost + ' EC'; btn.style.background = ''; }, 1500);
    return;
  }
  // Deduct
  const icon = document.getElementById('rd-icon').textContent;
  const title = document.getElementById('rd-title').textContent;
  deductBalance(cost);
  addToTxHistory(icon, title, cost, userBalance, 'spent');
  // Show redeemed view
  document.getElementById('rd-info').style.display = 'none';
  document.getElementById('rd-redeemed').style.display = 'block';
  document.getElementById('rd-redeemed').classList.add('active');
  document.querySelectorAll('.screen.active').forEach(s => s.classList.remove('active'));
  document.getElementById('screen-reward').classList.add('active');
  const code = document.getElementById('rd-code').textContent;
  const img = document.getElementById('rd-qr-img');
  const fallback = document.getElementById('rd-qr-fallback');
  img.onload = function() {
    img.style.display = 'block';
    fallback.style.display = 'none';
  };
  img.onerror = function() {
    fallback.innerHTML = '<div style="font-size:32px;margin-bottom:4px;">\uD83D\uDCF1</div><div style="font-size:11px;color:var(--slate-600);">' + code + '</div><div style="font-size:10px;color:var(--slate-400);">QR niedost\u0119pny \u2014 poka\u017C kod r\u0119cznie</div>';
  };
  img.src = 'https://chart.googleapis.com/chart?chs=140x140&cht=qr&chl=' + encodeURIComponent('ROOT:' + code) + '&choe=UTF-8&chld=L|0';
  generateFallbackQR(code);
}

function generateFallbackQR(code) {
  const img = document.getElementById('rd-qr-img');
  const fallback = document.getElementById('rd-qr-fallback');
  // Wait for onload/onerror; if neither fires in 3s, show fallback
  const timer = setTimeout(function() {
    if (img.style.display !== 'block') {
      img.style.display = 'none';
      fallback.style.display = 'flex';
      fallback.innerHTML = '<div style="font-size:32px;margin-bottom:4px;">\uD83D\uDCF1</div><div style="font-size:11px;color:var(--slate-600);">' + code + '</div><div style="font-size:10px;color:var(--slate-400);">Poka\u017C kasjerowi ten kod</div>';
    }
  }, 3000);
  img.onload = function() { clearTimeout(timer); img.style.display = 'block'; fallback.style.display = 'none'; };
  img.onerror = function() { clearTimeout(timer); img.style.display = 'none'; fallback.style.display = 'flex';
    fallback.innerHTML = '<div style="font-size:32px;margin-bottom:4px;">\uD83D\uDCF1</div><div style="font-size:11px;color:var(--slate-600);">' + code + '</div><div style="font-size:10px;color:var(--slate-400);">Poka\u017C kasjerowi ten kod</div>';
  };
}


// ─── PASSWORD RESET ───
function openResetPw() {
  haptic();
  document.getElementById('reset-form').style.display = 'block';
  document.getElementById('reset-success').style.display = 'none';
  document.getElementById('modal-reset').classList.add('open');
}

function closeResetPw() {
  document.getElementById('modal-reset').classList.remove('open');
}

function sendResetLink() {
  haptic();
  const email = document.getElementById('reset-email').value.trim();
  if (!email || !email.includes('@')) {
    const btn = document.querySelector('#reset-form .btn-primary');
    btn.textContent = 'Podaj poprawny e-mail';
    btn.style.background = 'var(--error)';
    setTimeout(() => { btn.textContent = 'Wy\u015Blij link'; btn.style.background = ''; }, 1500);
    return;
  }
  document.getElementById('reset-form').style.display = 'none';
  document.getElementById('reset-success').style.display = 'block';
}

// Close reset modal on overlay click
document.getElementById('modal-reset').addEventListener('click', function(e) {
  if (e.target === this) closeResetPw();
});
// Close modal on overlay click
document.getElementById('modal-decl').addEventListener('click', function(e) {
  if (e.target === this) closeModal();
});

// ─── AUTH ───

// ─── BALANCE ───
let userBalance = storeLoad('balance', 450);

function updateBalanceDisplay() {
  document.querySelectorAll('#dash-balance, #hist-balance').forEach(el => {
    if (el) el.textContent = userBalance;
  });
}

function deductBalance(amount) {
  if (userBalance < amount) return false;
  userBalance -= amount;
  storeSave('balance', userBalance);
  updateBalanceDisplay();
  return true;
}

function earnBalance(amount) {
  userBalance += amount;
  storeSave('balance', userBalance);
  updateBalanceDisplay();
}

function addToTxHistory(icon, name, pts, bal, type) {
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  const date = 'Dzi\u015B';
  txHistory.unshift({ date, time, icon, name, pts: type === 'spent' ? -Math.abs(pts) : Math.abs(pts), bal, type });
  storeSave('txHistory', txHistory);
}

// ─── PARTNER ───
let currentPartner = storeLoad('partner', 'intel');

function switchPartner(name) {
  haptic();
  currentPartner = name;
  storeSave('partner', name);
  document.querySelectorAll('.partner-btn').forEach(b => b.classList.remove('active'));
  document.getElementById('partner-' + name).classList.add('active');
  // Update invite code
  const inv = document.getElementById('invite-code');
  if (inv) inv.value = name === 'intel' ? 'INTEL-2025' : 'ERGO-2025';
  // Update email placeholder
  const domain = name === 'intel' ? 'intel.com' : 'hestia.pl';
  document.querySelectorAll('.auth-input[type=email]').forEach(el => {
    el.value = name === 'ergo' ? 'jan@hestia.pl' : 'jan@intel.com';
    el.placeholder = 'jan@' + domain;
  });
  // Update challenge banners
  const teamName = name === 'intel' ? 'Zesp\u00F3\u0142 Intel Poland' : 'Zesp\u00F3\u0142 ERGO Hestia';
  document.querySelectorAll('.challenge-banner-badge, .ch-badge').forEach(el => el.textContent = teamName);
  // Update profile email
  const profileEmail = document.querySelector('.profile-email');
  if (profileEmail) profileEmail.textContent = name === 'intel' ? 'jan@intel.com' : 'jan@hestia.pl';
}
function switchAuth(btn, view) {
  btn.closest('.auth-tabs').querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('auth-login').style.display = view === 'login' ? 'flex' : 'none';
  document.getElementById('auth-register').style.display = view === 'register' ? 'flex' : 'none';
}

function authLogin() {
  haptic();
  document.getElementById('auth').classList.remove('active');
  document.getElementById('auth').classList.add('hidden');
  const ob = document.getElementById('onboarding');
  ob.classList.remove('hidden');
  ob.classList.add('active');
  renderOnboarding();
}

function authRegister() {
  haptic();
  document.getElementById('auth').classList.remove('active');
  document.getElementById('auth').classList.add('hidden');
  const ob = document.getElementById('onboarding');
  ob.classList.remove('hidden');
  ob.classList.add('active');
  renderOnboarding();
}

// ─── ONBOARDING ───
let onbStep = 0;
const onbSteps = [
  { title: 'Witaj w Root! \uD83C\uDF31', desc: 'Ka\u017Cdy krok, ka\u017Cda eko-deklaracja i ka\u017Cda aktywno\u015B\u0107 fizyczna przybli\u017Ca Ci\u0119 do lepszej wersji siebie \u2014 i zdrowszej planety.' },
  { title: 'Twoje dane s\u0105 bezpieczne', desc: 'Przetwarzamy tylko kroki i eko-deklaracje. \u017Cadnych danych medycznych. Zawsze mo\u017Cesz zarz\u0105dza\u0107 zgodami w ustawieniach.' },
  { title: 'Tw\u00F3j pierwszy cel', desc: 'Zacznij od 8 000 kroków dziennie i pierwszej eko-deklaracji. Nagrody czekaj\u0105!' },
];

function renderOnboarding() {
  onbStep = 0;
  document.getElementById('ob-1').classList.add('active');
  document.getElementById('ob-2').classList.remove('active');
  document.getElementById('ob-3').classList.remove('active');
  document.querySelectorAll('.ob-dot').forEach((d, i) => d.classList.toggle('active', i === 0));
  document.getElementById('ob-2-btn').disabled = true;
  document.getElementById('rodo-check').checked = false;
  document.getElementById('rodo-health').checked = false;
}

function nextOb() {
  haptic();
  const current = document.querySelector('.ob-step.active');
  const next = current.nextElementSibling;
  if (!next || !next.classList.contains('ob-step')) return;
  current.classList.remove('active');
  next.classList.add('active');
  onbStep++;
  document.querySelectorAll('.ob-dot').forEach((d, i) => d.classList.toggle('active', i === onbStep));
}

function finishOnboarding() {
  haptic();
  document.getElementById('onboarding').classList.add('hidden');
  document.getElementById('screen-home').classList.add('active');
  // Simulate auto-navigate to home tab
  navigate('screen-home');
}

// ─── TRANSACTION HISTORY ───
let defaultTxHistory = [
  { date: 'Dzi\u015B', time: '14:30', icon: '\uD83D\uDCAA', name: 'Kroki (6 200)', pts: 25, bal: 450, type: 'earned' },
  { date: 'Wczoraj', time: '18:15', icon: '\u267B\uFE0F', name: 'Segregacja odpad\u00F3w', pts: 30, bal: 425, type: 'earned' },
  { date: '2 dni temu', time: '12:00', icon: '\uD83D\uDCAA', name: 'Kroki (7 100)', pts: 35, bal: 395, type: 'earned' },
  { date: '2 dni temu', time: '08:00', icon: '\uD83D\uDD25', name: 'Streak bonus +20%', pts: 7, bal: 360, type: 'earned' },
  { date: '3 dni temu', time: '17:40', icon: '\uD83D\uDEB4', name: 'Rower zamiast auta', pts: 60, bal: 353, type: 'earned' },
  { date: '4 dni temu', time: '09:20', icon: '\u2615', name: 'Kawa w sieci\u00F3wce', pts: -200, bal: 293, type: 'spent' },
  { date: '5 dni temu', time: '20:00', icon: '\uD83D\uDCAA', name: 'Kroki (8 200)', pts: 40, bal: 493, type: 'earned' },
  { date: '6 dni temu', time: '11:30', icon: '\uD83D\uDECD\uFE0F', name: 'W\u0142asna torba na zakupy', pts: 20, bal: 453, type: 'earned' },
  { date: '6 dni temu', time: '19:45', icon: '\uD83D\uDCAA', name: 'Kroki (6 800)', pts: 30, bal: 433, type: 'earned' },
  { date: '7 dni temu', time: '22:10', icon: '\uD83D\uDEC1', name: 'Prysznic < 5 min', pts: 25, bal: 403, type: 'earned' },
  { date: '7 dni temu', time: '13:00', icon: '\uD83D\uDCC5', name: 'Lunch ze znajomymi', pts: -350, bal: 378, type: 'spent' },
  { date: '8 dni temu', time: '14:00', icon: '\uD83D\uDCAA', name: 'Kroki (5 400)', pts: 20, bal: 728, type: 'earned' },
  { date: '8 dni temu', time: '09:00', icon: '\uD83D\uDCA1', name: 'Wy\u0142\u0105czanie \u015Bwiate\u0142', pts: 15, bal: 708, type: 'earned' },
  { date: '9 dni temu', time: '17:30', icon: '\uD83D\uDCAA', name: 'Kroki (9 300)', pts: 45, bal: 693, type: 'earned' },
  { date: '10 dni temu', time: '08:45', icon: '\uD83D\uDCA7', name: 'Oszcz\u0119dzanie wody', pts: 25, bal: 648, type: 'earned' },
  { date: '11 dni temu', time: '10:30', icon: '\uD83C\uDFE0', name: 'Zni\u017Cka w sklepie osiedlowym', pts: -120, bal: 623, type: 'spent' },
];
let txHistory = storeLoad('txHistory', defaultTxHistory);

function openHistory() {
  document.getElementById('hist-balance').textContent = userBalance;
  renderTx('all');
  navigate('screen-history');
}

function renderTx(filter) {
  const list = document.getElementById('hist-list');
  const items = filter === 'all' ? txHistory : txHistory.filter(t => t.type === filter);
  if (items.length === 0) {
    const label = filter === 'earned' ? 'zdobytych' : 'wydanych';
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">\uD83D\uDCCB</div><div class="empty-title">Brak transakcji</div><div class="empty-desc">Nie masz jeszcze ' + label + ' transakcji w tym okresie.</div></div>';
    return;
  }
  list.innerHTML = items.map(t => `
    <div class="hist-item">
      <div class="hist-icon">${t.icon}</div>
      <div class="hist-info">
        <div class="hist-name">${t.name}</div>
        <div class="hist-date">${t.date} \u2022 ${t.time}</div>
      </div>
      <div class="hist-pts ${t.pts > 0 ? 'earned' : 'spent'}">${t.pts > 0 ? '+' : ''}${t.pts}</div>
      <div class="hist-bal">${t.bal} EC</div>
    </div>
  `).join('');
}

function filterTx(btn, filter) {
  btn.closest('.hist-filter').querySelectorAll('.mf-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderTx(filter);
}

// ─── NOTIFICATIONS ───
let notifs = [
  { date: 'Dzi\u015B', icon: '\uD83C\uDF31', title: 'Nowe wyzwanie dost\u0119pne!', desc: 'Tydzie\u0144 bez plastiku \u2014 do\u0142\u0105cz i zdobywaj 2x Eco-Coins.', time: '14:30', unread: true },
  { date: 'Dzi\u015B', icon: '\uD83D\uDD25', title: 'Passa 7 dni!', desc: 'Utrzymujesz pass\u0119 przez 7 dni z rz\u0119du. Otrzymujesz +20% bonusu.', time: '08:00', unread: true },
  { date: 'Dzi\u015B', icon: '\uD83C\uDFC3', title: 'Cel krok\u00F3w osi\u0105gni\u0119ty', desc: 'Przekroczy\u0142e\u015B 8 000 krok\u00F3w. +40 EC dodane do salda.', time: '07:45', unread: true },
  { date: 'Wczoraj', icon: '\uD83D\uDCC5', title: 'Eko-deklaracja potwierdzona', desc: 'Segregacja odpad\u00F3w \u2014 +30 EC. \u015Awietna robota!', time: '18:20', unread: false },
  { date: 'Wczoraj', icon: '\uD83D\uDCAA', title: 'Tylko 1 200 krok\u00F3w do celu', desc: 'Masz jeszcze czas \u2014 wieczorny spacer zalicza si\u0119 do p\u00F3\u0142nocy.', time: '20:15', unread: false },
  { date: '2 dni temu', icon: '\uD83C\uDFE0', title: 'Nowa nagroda w katalogu', desc: 'Zni\u017Cka 15% w sklepie osiedlowym \u2014 sprawd\u017A w Rynku nagr\u00F3d.', time: '12:00', unread: false },
  { date: '2 dni temu', icon: '\uD83D\uDC65', title: 'Micha\u0142 K. do\u0142\u0105czy\u0142 do wyzwania', desc: 'Twoi znajomi s\u0105 aktywni. Rywalizacja ro\u015Bnie!', time: '10:30', unread: false },
  { date: '3 dni temu', icon: '\uD83D\uDCCB', title: 'Kod nagrody wykorzystany', desc: 'Kawa w sieci\u00F3wce \u2014 kod K4W4-2B8X zosta\u0142 aktywowany.', time: '09:15', unread: false },
  { date: '5 dni temu', icon: '\uD83D\uDD25', title: 'Raport tygodniowy', desc: 'Ten tydzie\u0144: 45 200 krok\u00F3w, 6 eko-deklaracji, 320 EC zdobytych.', time: '08:00', unread: false },
];

function openNotifications() {
  renderNotifications();
  navigate('screen-notifications');
}

function renderNotifications() {
  const list = document.getElementById('notif-list');
  if (notifs.length === 0) {
    list.innerHTML = '<div class="empty-state"><div class="empty-icon">\uD83D\uDCED</div><div class="empty-title">Brak powiadomie\u0144</div><div class="empty-desc">Wszystkie powiadomienia s\u0105 przeczytane. Wr\u00F3\u0107 p\u00F3\u017Aniej!</div></div>';
    const dot = document.getElementById('notif-dot');
    if (dot) dot.style.display = 'none';
    return;
  }
  list.innerHTML = notifs.map((n, i) => `
    <div class="notif-item ${n.unread ? 'unread' : ''}" onclick="markNotifRead(${i})">
      ${n.unread ? '<div class="notif-dot"></div>' : ''}
      <div class="notif-icon">${n.icon}</div>
      <div class="notif-content">
        <div class="notif-title">${n.title}</div>
        <div class="notif-desc">${n.desc}</div>
        <div class="notif-time">${n.time}</div>
      </div>
    </div>
  `).join('');
  const dot = document.getElementById('notif-dot');
  if (dot) dot.style.display = notifs.some(n => n.unread) ? 'block' : 'none';
}

function markNotifRead(idx) {
  notifs[idx].unread = false;
  renderNotifications();
}

function clearAllNotifs() {
  notifs.forEach(n => n.unread = false);
  renderNotifications();
}

// ─── EDIT PROFILE ───
let avatarIdx = 2;
const avatarLetters = 'JAKMPTREWS';
const avatarGradients = [
  'linear-gradient(135deg,#1B4332,#2D6A4F)',
  'linear-gradient(135deg,#2D6A4F,#95D5B2)',
  'linear-gradient(135deg,#D4A373,#E07A5F)',
  'linear-gradient(135deg,#6366F1,#818CF8)',
  'linear-gradient(135deg,#DC2626,#F87171)',
  'linear-gradient(135deg,#7C3AED,#A78BFA)',
];

function cycleAvatar(idx) {
  avatarIdx = idx;
  const letter = avatarLetters[idx % avatarLetters.length];
  document.getElementById('edit-avatar-preview').textContent = letter;
  document.getElementById('edit-avatar-preview').style.background = avatarGradients[idx % avatarGradients.length];
  document.getElementById('profile-avatar').querySelector('.avatar-big').textContent = letter;
  document.getElementById('profile-avatar').querySelector('.avatar-big').style.background = avatarGradients[idx % avatarGradients.length];
}

function saveProfile() {
  haptic();
  const name = document.getElementById('edit-name').value || 'Jan Kowalski';
  document.querySelector('.profile-name').textContent = name;
  document.querySelector('.dash-greeting strong').textContent = name.split(' ')[0];
  const stepGoal = document.getElementById('edit-step-goal').value || 8000;
  document.querySelector('.progress-stats span:last-child').textContent = '... do celu';
  const btn = document.querySelector('#screen-edit .btn-primary');
  btn.textContent = '\u2705 Zapisano!';
  btn.style.background = 'var(--success)';
  setTimeout(() => { btn.textContent = 'Zapisz zmiany'; btn.style.background = ''; }, 1500);
  navigate('screen-profile');
}

function clearNotifications() {
  clearAllNotifs();
}



// ─── SETTINGS ───
function openSettings() {
  const partnerEl = document.getElementById('settings-partner');
  if (partnerEl) partnerEl.textContent = currentPartner === 'intel' ? 'Intel Poland' : 'ERGO Hestia';
  navigate('screen-settings');
}

function logoutApp() {
  haptic();
  if (confirm('Czy na pewno chcesz się wylogować?')) {
    document.querySelectorAll('.screen.active').forEach(s => s.classList.remove('active'));
    document.getElementById('auth').classList.remove('hidden');
    document.getElementById('auth').classList.add('active');
    document.getElementById('onboarding').classList.add('hidden');
    document.querySelectorAll('.tab-item').forEach(t => t.classList.remove('active'));
  }
}
// ─── ACHIEVEMENTS ───
const achData = [
  { icon: '\uD83D\uDCAA', title: 'Pierwszy krok', desc: 'Zr\u00F3b 8 000 kroków w jeden dzie\u0144', id: 'first' },
  { icon: '\uD83D\uDD25', title: 'Passa 3 dni', desc: '3 dni z rzędu powy\u017Cej 6 000 krok\u00F3w', id: 'streak3' },
  { icon: '\uD83D\uDD25', title: 'Passa 7 dni', desc: 'Tydzie\u0144 bez przerwy', id: 'streak7' },
  { icon: '\uD83C\uDFC3', title: 'Marato\u0144czyk', desc: '\u0141\u0105cznie 42 195 krok\u00F3w w tydzie\u0144', id: 'marathon' },
  { icon: '\uD83C\uDF31', title: 'Eko-wojownik', desc: '10 eko-deklaracji', id: 'eco10' },
  { icon: '\u267B\uFE0F', title: 'Mistrz recyklingu', desc: '5 deklaracji segregacji', id: 'recycle' },
  { icon: '\uD83D\uDEB4', title: 'Rowerzysta', desc: 'Dojazd rowerem 5 razy', id: 'bike' },
  { icon: '\uD83E\uDDD8', title: 'Zen master', desc: '10 sesji jogi', id: 'yoga' },
  { icon: '\uD83D\uDC65', title: 'Team player', desc: 'Do\u0142\u0105cz do wyzwania zespo\u0142owego', id: 'team' },
  { icon: '\uD83C\uDFC6', title: 'Zwyci\u0119zca', desc: 'B\u0105d\u017A w top 3 rankingu', id: 'winner' },
  { icon: '\uD83D\uDEF5', title: 'Pieszy', desc: '\u0141\u0105cznie 100 000 krok\u00F3w', id: 'walker' },
  { icon: '\uD83C\uDF1F', title: 'Pe\u0142nia', desc: 'Wszystkie cele w jednym tygodniu', id: 'full' },
];

function getAchStatus() {
  const saved = storeLoad('achievements', {});
  return achData.map(a => ({
    ...a,
    unlocked: !!saved[a.id],
    date: saved[a.id] || null,
    isNew: saved[a.id] === 'new',
  }));
}

function openAchievements() {
  renderAchievements();
  navigate('screen-achievements');
}

function renderAchievements() {
  const list = achData.map(a => {
    const saved = storeLoad('achievements', {});
    const unlocked = !!saved[a.id];
    const date = saved[a.id];
    const cls = unlocked ? 'unlocked' : 'locked';
    return '<div class="ach-item ' + cls + '">' +
      '<div class="ach-item-icon">' + a.icon + '</div>' +
      '<div class="ach-item-title">' + a.title + '</div>' +
      '<div class="ach-item-desc">' + a.desc + '</div>' +
      (unlocked && date && date !== 'new' ? '<div class="ach-item-date">' + date + '</div>' : '') +
      (!unlocked ? '<div class="ach-lock-icon">\uD83D\uDD12</div>' : '') +
    '</div>';
  }).join('');
  document.getElementById('ach-grid').innerHTML = list;
  const unlocked = achData.filter(a => { const s = storeLoad('achievements', {}); return !!s[a.id]; }).length;
  document.getElementById('ach-unlocked').textContent = unlocked;
  document.getElementById('ach-total').textContent = achData.length;
  document.getElementById('ach-pct').textContent = Math.round(unlocked / achData.length * 100) + '%';
}
// ─── EKO-DEKLARACJE ───
function openDeclarations() {
  renderDeclarations();
  navigate('screen-declarations');
}

// ─── CHALLENGE ───
function openChallenge() {
  navigate('screen-challenge');
}

// ─── MARKET FILTER ───
function filterMarket(btn, filter) {
  btn.closest('#market-filter').querySelectorAll('.mf-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  let visible = 0;
  document.querySelectorAll('.market-item').forEach(item => {
    if (filter === 'all') { item.style.display = ''; visible++; return; }
    const match = item.classList.contains('mf-' + filter);
    item.style.display = match ? '' : 'none';
    if (match) visible++;
  });
  // Show/hide empty state
  let empty = document.getElementById('market-empty');
  if (visible === 0) {
    if (!empty) {
      empty = document.createElement('div');
      empty.id = 'market-empty';
      empty.className = 'empty-state';
      empty.innerHTML = '<div class="empty-icon">\uD83D\uDCED</div><div class="empty-title">Brak nagr\u00F3d</div><div class="empty-desc">W tej kategorii nie ma jeszcze dost\u0119pnych nagr\u00F3d. Sprawd\u017A p\u00F3\u017Aniej!</div>';
      document.getElementById('market-grid').after(empty);
    }
    empty.style.display = 'flex';
  } else if (empty) {
    empty.style.display = 'none';
  }
}

function filterHistory(btn, filter) {
  btn.closest('.hist-filter').querySelectorAll('.mf-pill').forEach(p => p.classList.remove('active'));
  btn.classList.add('active');
  renderTx(filter);
}

// ─── NOTIFICATION HELPERS (for inline onclick) ───
function markNotifRead(idx) {
  notifs[idx].unread = false;
  renderNotifications();
}

function clearAllNotifs() {
  notifs.forEach(n => n.unread = false);
  renderNotifications();
}

// ─── ACTIVITY LOG ───
const activityRates = {
  walking: { rate: 120, icon: '\uD83D\uDEB6', name: 'Spacer' },
  running: { rate: 200, icon: '\uD83C\uDFC3', name: 'Bieganie' },
  cycling: { rate: 150, icon: '\uD83D\uDEB4', name: 'Rower' },
  swimming: { rate: 180, icon: '\uD83C\uDFCA', name: 'P\u0142ywanie' },
  yoga: { rate: 50, icon: '\uD83E\uDDD8', name: 'Joga' },
  gym: { rate: 100, icon: '\uD83C\uDFCB', name: 'Si\u0142ownia' },
};
const pedometerTypes = ['walking', 'running', 'cycling'];
let currentActivity = 'walking';
let activityLog = storeLoad('actLog', []);
let actPhotoData = null;

function selectActivity(el, type) {
  document.querySelectorAll('.act-type').forEach(a => a.classList.remove('selected'));
  el.classList.add('selected');
  currentActivity = type;
  const isPed = pedometerTypes.includes(type);
  document.getElementById('act-connect-section').style.display = isPed ? 'block' : 'none';
  document.getElementById('act-manual-section').style.display = isPed ? 'none' : 'block';
  document.getElementById('act-manual-fields').classList.remove('show');
  document.getElementById('act-manual-toggle').textContent = '\u2795 Dodaj r\u0119cznie czas i dystans';
  calcEstimate();
}

function toggleApp(el, appId) {
  const connected = el.classList.toggle('connected');
  const btn = document.getElementById('btn-' + appId);
  const status = document.getElementById('status-' + appId);
  if (connected) {
    btn.textContent = 'Roz\u0142\u0105cz';
    status.textContent = 'Po\u0142\u0105czono';
    el.classList.add('connected');
  } else {
    btn.textContent = 'Po\u0142\u0105cz';
    status.textContent = 'Roz\u0142\u0105czone';
    el.classList.remove('connected');
  }
}

function toggleManual() {
  const fields = document.getElementById('act-manual-fields');
  const tog = document.getElementById('act-manual-toggle');
  const isOpen = fields.classList.toggle('show');
  tog.textContent = isOpen ? '\u2715 Ukryj r\u0119czne wprowadzanie' : '\u2795 Dodaj r\u0119cznie czas i dystans';
  calcEstimate();
}

function toggleActPhoto() {
  const area = document.getElementById('act-photo-area');
  if (actPhotoData) {
    actPhotoData = null;
    area.classList.remove('has-photo');
    area.innerHTML = '<div class="photo-placeholder">\uD83D\uDCF7</div><div class="photo-label">Dodaj zdj\u0119cie biletu lub paragonu</div><div class="photo-sub">Bilet wst\u0119pu, karnet, paragon \u2014 potwierd\u017A aktywno\u015B\u0107</div>';
    return;
  }
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = 'image/*';
  input.onchange = function(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(ev) {
      actPhotoData = ev.target.result;
      area.classList.add('has-photo');
      area.innerHTML = '<div style="font-size:28px">\u2705</div><div class="photo-label">Zdj\u0119cie dodane</div><div class="photo-sub">Kliknij, aby zmieni\u0107 lub usun\u0105\u0107</div>';
    };
    reader.readAsDataURL(file);
  };
  input.click();
}

function getDuration() {
  const isPed = pedometerTypes.includes(currentActivity);
  const manualOpen = document.getElementById('act-manual-fields').classList.contains('show');
  if (isPed && manualOpen) {
    return parseInt(document.getElementById('act-duration').value) || 0;
  }
  if (!isPed) {
    return parseInt(document.getElementById('act-duration2').value) || 0;
  }
  return 30;
}

function calcEstimate() {
  const dur = getDuration();
  const rate = activityRates[currentActivity].rate;
  const steps = dur * rate;
  const ec = Math.min(Math.floor(steps / 200), 40);
  document.getElementById('act-est-steps').textContent = steps.toLocaleString();
  document.querySelector('.act-estimate').classList.toggle('show', dur > 0);
  document.querySelector('.act-estimate .est-sub').textContent = `+${ec} EC (przy dziennym limicie)`;
  document.getElementById('act-log-btn').disabled = dur < 1;
}

function logActivity() {
  haptic();
  const dur = getDuration();
  if (dur < 1) return;
  const act = activityRates[currentActivity];
  const steps = dur * act.rate;
  const ec = Math.min(Math.floor(steps / 200), 40);
  const now = new Date();
  const time = now.getHours().toString().padStart(2,'0') + ':' + now.getMinutes().toString().padStart(2,'0');
  activityLog.unshift({
    type: currentActivity,
    icon: act.icon,
    name: act.name,
    duration: dur,
    steps: steps,
    ec: ec,
    time: time,
    hasPhoto: !!actPhotoData,
  });
  storeSave('actLog', activityLog);
  renderActivityLog();
  updateDashboardSteps();
  // Add earned EC to balance
  if (ec > 0) {
    earnBalance(ec);
    addToTxHistory(act.icon, act.name + ' (' + dur + ' min)', ec, userBalance, 'earned');
  }
  actPhotoData = null;
  document.getElementById('act-photo-area').innerHTML = '<div class="photo-placeholder">\uD83D\uDCF7</div><div class="photo-label">Dodaj zdj\u0119cie biletu lub paragonu</div><div class="photo-sub">Bilet wst\u0119pu, karnet, paragon \u2014 potwierd\u017A aktywno\u015B\u0107</div>';
  document.getElementById('act-photo-area').classList.remove('has-photo');
  const btn = document.getElementById('act-log-btn');
  btn.textContent = '\u2705 Dodano!';
  setTimeout(() => { btn.textContent = '\u2795 Dodaj do dzisiejszego dnia'; }, 1500);
}

function renderActivityLog() {
  const list = document.getElementById('act-history');
  if (activityLog.length === 0) {
    list.innerHTML = '<div class="act-empty">Brak aktywno\u015Bci dodanych dzisiaj</div>';
    return;
  }
  list.innerHTML = activityLog.map((a, i) => `
    <div class="act-history-item">
      <div class="act-hi-icon">${a.icon}</div>
      <div class="act-hi-info">
        <div class="act-hi-name">${a.name} \u00B7 ${a.duration} min ${a.hasPhoto ? '\uD83D\uDCF8' : ''}</div>
        <div class="act-hi-time">${a.time}</div>
      </div>
      <div class="act-hi-steps">+${a.steps.toLocaleString()}</div>
      <div class="act-hi-actions">
        <button class="act-hi-edit" onclick="editActivity(${i})">\u270F\uFE0F</button>
        <button class="act-hi-delete" onclick="deleteActivity(${i})">\u2715</button>
      </div>
    </div>
  `).join('');
}

function editActivity(idx) {
  haptic();
  const a = activityLog[idx];
  if (!a) return;
  const modal = document.getElementById('edit-activity-modal');
  document.getElementById('edit-act-name').textContent = a.name;
  document.getElementById('edit-act-icon').textContent = a.icon;
  const slider = document.getElementById('edit-act-slider');
  const valEl = document.getElementById('edit-act-value');
  slider.value = a.duration;
  valEl.textContent = a.duration + ' min';
  slider.oninput = function() { valEl.textContent = this.value + ' min'; };
  modal.dataset.idx = idx;
  modal.classList.add('show');
}

function saveEditActivity() {
  haptic();
  const modal = document.getElementById('edit-activity-modal');
  const idx = parseInt(modal.dataset.idx);
  const a = activityLog[idx];
  if (!a) return;
  const newDur = parseInt(document.getElementById('edit-act-slider').value) || 5;
  const rates = { walking:120, running:200, cycling:150, swimming:180, yoga:50, gym:100 };
  const rate = rates[a.type] || 100;
  const oldEc = a.ec || 0;
  a.duration = newDur;
  a.steps = newDur * rate;
  a.ec = Math.min(Math.floor(a.steps / 200), 40);
  const diff = a.ec - oldEc;
  if (diff !== 0) {
    let balance = storeLoad('userBalance', 450);
    balance += diff;
    storeSave('userBalance', Math.max(0, balance));
    updateBalanceDisplay();
  }
  activityLog[idx] = a;
  storeSave('actLog', activityLog);
  renderActivityLog();
  updateDashboardSteps();
  modal.classList.remove('show');
}

function cancelEditActivity() {
  document.getElementById('edit-activity-modal').classList.remove('show');
}

function deleteActivity(idx) {
  haptic();
  const a = activityLog[idx];
  if (!a) return;
  const ecLost = a.ec || 0;
  activityLog.splice(idx, 1);
  storeSave('actLog', activityLog);
  if (ecLost > 0) {
    let balance = storeLoad('userBalance', 450);
    balance = Math.max(0, balance - ecLost);
    storeSave('userBalance', balance);
    updateBalanceDisplay();
  }
  renderActivityLog();
  updateDashboardSteps();
}

function updateDashboardSteps() {
  const totalManual = activityLog.reduce((sum, a) => sum + a.steps, 0);
  const baseSteps = 6200;
  const total = baseSteps + totalManual;
  const el = document.querySelector('.steps-number');
  if (el) {
    const old = parseInt(el.textContent.replace(/\s/g,''));
    el.textContent = total.toLocaleString();
    const earned = document.querySelector('.eco-earned strong');
    if (earned) earned.textContent = '+' + Math.min(Math.floor(total / 200), 40);
    const fill = document.querySelector('.progress-fill');
    const pct = Math.min(Math.round(total / 8000 * 100), 100);
    if (fill) {
      fill.style.width = pct + '%';
      fill.classList.add('animating');
      setTimeout(() => fill.classList.remove('animating'), 1050);
    }
    const stat = document.querySelector('.progress-stats');
    if (stat) {
      const remaining = Math.max(8000 - total, 0);
      stat.innerHTML = `<span>Post\u0119p: <strong>${pct}%</strong></span><span>${remaining.toLocaleString()} krok\u00F3w do celu</span>`;
    }
  }
}

// Init activity screen sections
document.getElementById('act-manual-section').style.display = 'none';
renderActivityLog();
calcEstimate();


// Init offline detection
function updateOfflineBanner() {
  const banner = document.getElementById('offline-banner');
  if (banner) banner.style.display = navigator.onLine ? 'none' : 'flex';
}
window.addEventListener('online', updateOfflineBanner);
window.addEventListener('offline', updateOfflineBanner);
updateOfflineBanner();

// Init balance display
updateBalanceDisplay();

// Init partner on load
switchPartner(currentPartner);
// Init declarations
renderDeclarations();
document.querySelectorAll('.decl-full-item').forEach((item) => {
  item.addEventListener('click', function() {
    if (this.classList.contains('done')) return;
    const emoji = this.querySelector('.decl-emoji').textContent.trim();
    const name = this.querySelector('.decl-name').textContent.trim();
    const ptsText = this.querySelector('.decl-pts').textContent.trim();
    const pts = parseInt(ptsText) || 0;
    openModal(emoji, name, pts);
  });
});
