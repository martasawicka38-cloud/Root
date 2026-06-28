let currentDeclPt = 0;
let currentEffect = '';
let currentBadge = '';
let hasPhoto = false;
let declareCount = 0;
const DECL_MAX = 5;

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
  const maxEl = document.getElementById('decl-counter-max');
  if (maxEl) maxEl.textContent = DECL_MAX;
  // Toggle limit state
  const list = document.getElementById('decl-full-list');
  let limitMsg = document.getElementById('decl-limit-msg');
  const intro = document.querySelector('.decl-intro');
  if (declareCount >= DECL_MAX) {
    if (!limitMsg) {
      limitMsg = document.createElement('div');
      limitMsg.id = 'decl-limit-msg';
      limitMsg.className = 'empty-state';
      limitMsg.innerHTML = '<div class="empty-icon">\u2705</div><div class="empty-title">Dzisiejszy limit wykorzystany</div><div class="empty-desc">Wykorzysta\u0142e\u015B ju\u017C ' + DECL_MAX + ' aktywno\u015Bci dzisiaj. Wr\u00F3\u0107 jutro po wi\u0119cej! (Badania bonusowe nie blokuj\u0105 limitu)</div>';
      list.parentNode.insertBefore(limitMsg, list.nextSibling);
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

  // Render eco-carousel with actual activities
  renderEcoCarousel();
}

function renderEcoCarousel() {
  const carousel = document.getElementById('eco-carousel');
  if (!carousel) return;
  // Pick featured activities (skip very low-point ones)
  const items = document.querySelectorAll('.decl-full-item');
  // Background gradients for variety
  const grads = [
    'linear-gradient(135deg,#D8F3DC,#B7E4C7)',
    'linear-gradient(135deg,#CDDAFD,#B3C5F7)',
    'linear-gradient(135deg,#FEF3C7,#FDE68A)',
    'linear-gradient(135deg,#FFE4E6,#FECDD3)',
    'linear-gradient(135deg,#E0E7FF,#C7D2FE)',
    'linear-gradient(135deg,#D1FAE5,#A7F3D0)',
    'linear-gradient(135deg,#FCE7F3,#FBCFE8)',
    'linear-gradient(135deg,#EDE9FE,#DDD6FE)',
    'linear-gradient(135deg,#DBEAFE,#BFDBFE)',
    'linear-gradient(135deg,#FFF7ED,#FED7AA)',
  ];
  carousel.innerHTML = '';
  // Show max 12 items, skip lowest point values
  const sorted = Array.from(items).filter(item => {
    const pts = parseInt(item.querySelector('.decl-pts').textContent.trim()) || 0;
    return pts >= 10;
  });
  sorted.slice(0, 12).forEach((item, i) => {
    const emoji = item.querySelector('.decl-emoji').textContent.trim();
    let name = item.querySelector('.decl-name').textContent.trim();
    const pts = item.querySelector('.decl-pts').textContent.trim();
    // Truncate long names
    if (name.length > 25) name = name.slice(0, 22) + '...';
    const card = document.createElement('div');
    card.className = 'eco-card';
    card.onclick = function() { openDeclarations(); };
    card.innerHTML = '<div class="eco-card-bg" style="background:' + (grads[i % grads.length]) + '"></div>' +
      '<div class="eco-card-icon">' + emoji + '</div>' +
      '<div class="eco-card-title">' + name + '</div>' +
      '<div class="eco-card-pts">' + pts + ' EC</div>';
    carousel.appendChild(card);
  });
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
let currentVerifyType = 'photo';
let gpsVerified = false;

function openModal(emoji, name, pts, verifyType, effect, badge) {
  haptic();
  loadDeclareCount();
  const isProfilaktyka = name.includes('Profilaktyka');
  if (!isProfilaktyka && declareCount >= DECL_MAX) {
    renderDeclarations();
    navigate('screen-declarations');
    return;
  }
  currentDeclPt = pts;
  currentEffect = effect || '';
  currentBadge = badge || '';
  currentVerifyType = verifyType;
  hasPhoto = false;
  gpsVerified = false;
  document.getElementById('modal-form').style.display = 'block';
  document.getElementById('modal-success').style.display = 'none';
  document.querySelector('#modal-form .modal-title').textContent = emoji + ' ' + name;
  document.querySelector('#modal-form .modal-pts-badge span').textContent = '+' + pts;
  document.getElementById('modal-confirm').textContent = 'Potwierd\u017A i zdob\u0105d\u017A +' + pts + ' EC';
  document.getElementById('modal-confirm').disabled = true;
  document.getElementById('decl-desc').value = '';
  const descEl = document.getElementById('modal-desc');
  if (name.includes('Zielona Sztafeta') || name.includes('Echo') || name.includes('Zielona Stacja') || name.includes('Samotny W\u0119drowiec')) {
    descEl.style.display = 'block';
    descEl.innerHTML = 'W g\u0142\u0119bi TPK (np. przy kultowych punktach jak G\u0142az Esperantyst\u00F3w, Wzg\u00F3rze Pacho\u0142ek czy ukryte ambony widokowe) system tworzy wirtualne \u201EZielone Stacje\u201D. Twoim zadaniem jest dotarcie do stacji jako \u201Esamotny w\u0119drowiec\u201D i pozostawienie tam cyfrowego \u015Bladu \u2014 wiadomo\u015Bci, meldunku lub zdj\u0119cia natury.';
  } else {
    descEl.style.display = 'none';
  }

  const photoSection = document.getElementById('decl-photo-section');
  const gpsSection = document.getElementById('decl-gps-section');
  const ocrSection = document.getElementById('decl-ocr-section');
  const apiSection = document.getElementById('decl-api-section');
  const thermSection = document.getElementById('decl-thermostat-section');
  const fitnessSection = document.getElementById('decl-fitness-section');
  const allSections = [photoSection, gpsSection, ocrSection, apiSection, thermSection, fitnessSection];

  // Reset all sections
  allSections.forEach(s => { if (s) s.style.display = 'none'; });

  // Reset real photo state
  var pp = document.getElementById('photo-preview');
  if (pp) { pp.style.display = 'none'; pp.innerHTML = ''; }
  var pcb = document.getElementById('photo-confirm-btn');
  if (pcb) { pcb.style.display = 'none'; pcb.textContent = '\u2713 Potwierd\u017A zdj\u0119cie'; pcb.onclick = function() { confirmPhoto(); }; }
  var pi = document.getElementById('photo-input');
  if (pi) pi.value = '';

  if (verifyType === 'dual') {
    // Show ALL: photo, GPS, and OCR receipt scan
    photoSection.style.display = 'block';
    gpsSection.style.display = 'block';
    ocrSection.style.display = 'block';
    const title = document.querySelector('#modal-form .modal-title').textContent;
    const isZielona = title.includes('Zielona Proporcja');
    if (isZielona) {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83E\uDD16</div><div class="photo-label">Zrób zdjęcie talerza</div><div class="photo-sub">AI Vision sprawdzi, czy zielone składniki zajmują \u226550% powierzchni</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F Wymagane zdjęcie posiłku — AI Vision oceni proporcję zieleni';
      document.getElementById('gps-area').querySelector('.gps-status').className = 'gps-status';
      document.getElementById('gps-area').querySelector('.gps-label').textContent = 'Sprawdzanie lokalizacji...';
      document.getElementById('gps-start-btn').textContent = '\uD83D\uDCCD Potwierdź pobyt w Avocado Vegan Oliwa';
      document.getElementById('gps-start-btn').className = 'btn-secondary gps-btn';
      document.getElementById('gps-start-btn').disabled = false;
      document.getElementById('gps-hint').textContent = 'GPS potwierdzi, że jesteś w Avocado Vegan Bistro/Spot w Oliwie';
      document.getElementById('gps-map').querySelector('.gps-map-label').textContent = 'Avocado Vegan Oliwa — lokalizacja do zweryfikowania';
      document.getElementById('ocr-area').querySelector('.ocr-result').style.display = 'none';
      document.getElementById('ocr-hint').textContent = 'Dodaj zdjęcie paragonu — OCR odczyta pozycję wege';
    } else {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83D\uDCF7</div><div class="photo-label">Zrób zdjęcie naprawionego przedmiotu</div><div class="photo-sub">Pokaż efekt naprawy lub zakup vintage</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F Wymagane zdjęcie przedmiotu';
      document.getElementById('gps-area').querySelector('.gps-status').className = 'gps-status';
      document.getElementById('gps-area').querySelector('.gps-label').textContent = 'Sprawdzanie lokalizacji...';
      document.getElementById('gps-start-btn').textContent = '\uD83D\uDCCD Potwierdź lokalizację rzemieślnika/sklepu';
      document.getElementById('gps-start-btn').className = 'btn-secondary gps-btn';
      document.getElementById('gps-start-btn').disabled = false;
      document.getElementById('gps-hint').textContent = 'GPS potwierdzi, że jesteś u lokalnego rzemieślnika lub w sklepie vintage';
      document.getElementById('gps-map').querySelector('.gps-map-label').textContent = 'Lokalizacja rzemieślnicza zostanie zweryfikowana';
      document.getElementById('ocr-area').querySelector('.ocr-result').style.display = 'none';
      document.getElementById('ocr-hint').textContent = 'Dodaj zdjęcie paragonu — OCR odczyta i zweryfikuje';
    }
  } else if (verifyType === 'api') {
    apiSection.style.display = 'block';
    const title = document.querySelector('#modal-form .modal-title').textContent;
    const isNoCar = title.includes('bez Auta');
    if (isNoCar) {
      document.getElementById('api-sync-btn').textContent = '\uD83D\uDD04 Synchronizuj dane z aplikacji kroków/rower';
      document.getElementById('api-sync-btn').disabled = false;
      document.getElementById('api-hint').textContent = 'Automatyczna weryfikacja przez API Google Fit / Apple Health — sprawdzamy 30-dniow\u0105 aktywno\u015B\u0107';
      document.getElementById('api-power').textContent = '0 km';
      document.getElementById('api-status').textContent = 'BRAK PRZEJAZD\u00D3W \u2713';
      document.getElementById('api-status').className = 'api-summary-val api-ok';
      const devices = document.querySelectorAll('.api-device');
      const icons = ['\uD83D\uDCAA', '\uD83D\uDEB4', '\uD83D\uDEB6', '\uD83D\uDEF4'];
      const names = ['Stycze\u0144 2026', 'Luty 2026', 'Marzec 2026', 'Kwiecie\u0144 2026'];
      devices.forEach((d, i) => {
        d.querySelector('.api-dev-icon').textContent = icons[i] || '\u2705';
        d.querySelector('.api-dev-name').textContent = names[i] || '';
        d.querySelector('.api-dev-status').textContent = 'Przejazdy: 0 km';
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = '\u2705';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge ok';
      });
    } else if (title.includes('Lunchbox')) {
      document.getElementById('api-sync-btn').textContent = '\uD83D\uDD04 Synchronizuj z MyFitnessPal';
      document.getElementById('api-sync-btn').disabled = false;
      document.getElementById('api-hint').textContent = 'Automatyczna weryfikacja przez API MyFitnessPal — sprawdzamy makrosk\u0142adniki posi\u0142ku';
      document.getElementById('api-power').textContent = '0 g';
      document.getElementById('api-status').textContent = 'OCZEKIWANIE NA DANE \u23F3';
      document.getElementById('api-status').className = 'api-summary-val';
      const devices = document.querySelectorAll('.api-device');
      const icons = ['\uD83C\uDF4B', '\uD83E\uDD55', '\uD83C\uDF3E', '\uD83E\uDD5C'];
      const names = ['Bia\u0142ko: 0 g / 25 g', 'B\u0142onnik: 0 g / 8 g', 'T\u0142uszcze ro\u015Blinne', 'W\u0119glowodany'];
      devices.forEach((d, i) => {
        d.querySelector('.api-dev-icon').textContent = icons[i] || '\u2705';
        d.querySelector('.api-dev-name').textContent = names[i] || '';
        d.querySelector('.api-dev-status').textContent = '---';
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = '\u23F3';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge';
      });
    } else if (title.includes('Nawadnianie')) {
      document.getElementById('api-sync-btn').textContent = '\uD83D\uDD04 Synchronizuj z inteligentn\u0105 butelk\u0105';
      document.getElementById('api-sync-btn').disabled = false;
      document.getElementById('api-hint').textContent = 'Automatyczna weryfikacja przez Bluetooth API (HidrateSpark / Waterdrop Smart) + Apple Health';
      document.getElementById('api-power').textContent = '0 ml';
      document.getElementById('api-status').textContent = 'OCZEKIWANIE NA DANE \u23F3';
      document.getElementById('api-status').className = 'api-summary-val';
      const devices = document.querySelectorAll('.api-device');
      const icons = ['\uD83D\uDCA7', '\uD83D\uDD14', '\uD83C\uDFC3', '\u23F0'];
      const names = ['Dzienna obj\u0119to\u015B\u0107: 0 / 2500 ml', 'Poranna porcja (250 ml przed 8:30)', '\u015Arednia z 7 dni', 'Czas od ostatniego \u0142yku'];
      devices.forEach((d, i) => {
        d.querySelector('.api-dev-icon').textContent = icons[i] || '\u2705';
        d.querySelector('.api-dev-name').textContent = names[i] || '';
        d.querySelector('.api-dev-status').textContent = '---';
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = '\u23F3';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge';
      });
    } else if (title.includes('10 Tysi\u0119cy') || title.includes('Krok\u00F3w')) {
      document.getElementById('api-sync-btn').textContent = '\uD83D\uDD04 Synchronizuj kroki z telefonu / wearables';
      document.getElementById('api-sync-btn').disabled = false;
      document.getElementById('api-hint').textContent = 'Automatyczna weryfikacja przez API Apple Health / Google Health Connect';
      document.getElementById('api-power').textContent = '0';
      document.getElementById('api-status').textContent = 'OCZEKIWANIE NA DANE \u23F3';
      document.getElementById('api-status').className = 'api-summary-val';
      const devices = document.querySelectorAll('.api-device');
      const icons = ['\uD83D\uDC63', '\uD83C\uDFC3', '\u23F1\uFE0F', '\uD83D\uDCC8'];
      const names = ['Dzisiejsze kroki: 0 / 10 000', 'Dystans: 0 km', 'Czas aktywny: 0 min', 'Pi\u0119tra: 0'];
      devices.forEach((d, i) => {
        d.querySelector('.api-dev-icon').textContent = icons[i] || '\u2705';
        d.querySelector('.api-dev-name').textContent = names[i] || '';
        d.querySelector('.api-dev-status').textContent = '---';
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = '\u23F3';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge';
      });
    } else if (title.includes('Higiena')) {
      document.getElementById('api-sync-btn').textContent = '\uD83D\uDD04 Synchronizuj z aplikacj\u0105 mindfulness';
      document.getElementById('api-sync-btn').disabled = false;
      document.getElementById('api-hint').textContent = 'Weryfikacja przez Headspace / Calm / Apple Health Mindfulness — 10 min nieprzerwanej sesji';
      document.getElementById('api-power').textContent = '0 min';
      document.getElementById('api-status').textContent = 'OCZEKIWANIE NA DANE \u23F3';
      document.getElementById('api-status').className = 'api-summary-val';
      const devices = document.querySelectorAll('.api-device');
      const icons = ['\uD83E\uDDD8', '\uD83D\uDCA7', '\u2764\uFE0F', '\uD83D\uDCCA'];
      const names = ['Czas medytacji: 0 / 10 min', 'HRV: ---', 'T\u0119tno: ---', 'Typ: Mindfulness'];
      devices.forEach((d, i) => {
        d.querySelector('.api-dev-icon').textContent = icons[i] || '\u2705';
        d.querySelector('.api-dev-name').textContent = names[i] || '';
        d.querySelector('.api-dev-status').textContent = '---';
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = '\u23F3';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge';
      });
    } else {
      document.getElementById('api-sync-btn').textContent = '\uD83D\uDD04 Synchronizuj dane z smart gniazdek';
      document.getElementById('api-sync-btn').disabled = false;
      document.getElementById('api-hint').textContent = 'Automatyczna weryfikacja przez API Tuya/SmartLife — bez zdjęć!';
      document.getElementById('api-power').textContent = '0.0 W';
      document.getElementById('api-status').textContent = 'BRAK OBCI\u0104\u017bENIA \u2713';
      document.getElementById('api-status').className = 'api-summary-val api-ok';
      const devices = document.querySelectorAll('.api-device');
      const names = ['Salon RTV', 'Sypialnia TV', 'Biuro PC', 'Kuchnia czajnik'];
      devices.forEach((d, i) => {
        d.querySelector('.api-dev-icon').textContent = '\uD83D\uDD0C';
        d.querySelector('.api-dev-name').textContent = names[i] || 'Smart Gniazdko';
        d.querySelector('.api-dev-status').textContent = '0.0 W';
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = '\u2705';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge ok';
      });
    }
  } else if (verifyType === 'thermostat') {
    thermSection.style.display = 'block';
    document.getElementById('therm-sync-btn').textContent = '\uD83D\uDD04 Synchronizuj z g\u0142owicami Netatmo / Tado';
    document.getElementById('therm-sync-btn').disabled = false;
    document.getElementById('therm-hint').textContent = 'Automatyczna weryfikacja przez API inteligentnych g\u0142owic termostatycznych';
  } else if (verifyType === 'fitness') {
    fitnessSection.style.display = 'block';
    const title = document.querySelector('#modal-form .modal-title').textContent;
    document.getElementById('fitness-sync-btn').textContent = '\uD83D\uDD04 Synchronizuj z smartwatchem';
    document.getElementById('fitness-sync-btn').disabled = false;
    document.getElementById('fitness-hint').textContent = 'Automatyczna weryfikacja przez API Google Fit / Apple Health';
    // Reset metrics display
    document.querySelectorAll('.fitness-metric-value').forEach(el => el.textContent = '—');
    document.getElementById('fit-status').textContent = 'Oczekiwanie na synchronizację';
    document.getElementById('fit-verify-detail').textContent = '—';
    // Set icon and labels based on challenge type
    if (title.includes('Koron')) {
      document.getElementById('fitness-icon').textContent = '\u26F0\uFE0F';
      document.getElementById('fitness-label').textContent = 'Zdobywca Tr\u00F3jmiejskich Koron';
      document.getElementById('fit-m1-icon').textContent = '\u26F0\uFE0F';
      document.getElementById('fit-m1-label').textContent = 'Przewy\u017Cszenie';
      document.getElementById('fit-m2-icon').textContent = '\u2764\uFE0F';
      document.getElementById('fit-m2-label').textContent = 'Strefa 4 (Threshold)';
      document.getElementById('fit-m3-icon').textContent = '\uD83D\uDC63';
      document.getElementById('fit-m3-label').textContent = 'Tempo';
      document.getElementById('fit-m4-icon').textContent = '\u23F1\uFE0F';
      document.getElementById('fit-m4-label').textContent = 'Czas podej\u015Bcia';
      document.getElementById('fitness-hint').textContent = 'Wymagane: +100m przewy\u017Cszenia + HR Strefa 4 przez 60% czasu';
    } else if (title.includes('Tempa')) {
      document.getElementById('fitness-icon').textContent = '\uD83C\uDFC3';
      document.getElementById('fitness-label').textContent = 'Stra\u017Cnik Sta\u0142ego Tempa';
      document.getElementById('fit-m1-icon').textContent = '\uD83D\uDCCF';
      document.getElementById('fit-m1-label').textContent = 'Dystans';
      document.getElementById('fit-m2-icon').textContent = '\u23F1\uFE0F';
      document.getElementById('fit-m2-label').textContent = 'Tempo \u00B115s/km';
      document.getElementById('fit-m3-icon').textContent = '\uD83D\uDC63';
      document.getElementById('fit-m3-label').textContent = 'Kadencja min. 165';
      document.getElementById('fit-m4-icon').textContent = '\uD83D\uDCC8';
      document.getElementById('fit-m4-label').textContent = 'Odchylenie';
      document.getElementById('fitness-hint').textContent = 'Wymagane: 5 km \u00B115s/km, kadencja \u2265165';
    } else if (title.includes('Nadmorskiej') || title.includes('P\u0119tli')) {
      document.getElementById('fitness-icon').textContent = '\uD83D\uDEB4';
      document.getElementById('fitness-label').textContent = 'Moc Nadmorskiej P\u0119tli';
      document.getElementById('fit-m1-icon').textContent = '\u26A1';
      document.getElementById('fit-m1-label').textContent = 'Moc \u2265180W';
      document.getElementById('fit-m2-icon').textContent = '\u23F1\uFE0F';
      document.getElementById('fit-m2-label').textContent = 'Czas \u226520 min';
      document.getElementById('fit-m3-icon').textContent = '\uD83D\uDD25';
      document.getElementById('fit-m3-label').textContent = 'Spalone kcal';
      document.getElementById('fit-m4-icon').textContent = '\uD83D\uDEB4';
      document.getElementById('fit-m4-label').textContent = 'Dystans';
      document.getElementById('fitness-hint').textContent = 'Wymagane: 180W przez 20 min + 500 kcal';
    } else if (title.includes('Zimny Bodziec') || title.includes('Ba\u0142tycki Reset')) {
      document.getElementById('fitness-icon').textContent = '\uD83E\uDDCA';
      document.getElementById('fitness-label').textContent = 'Zimny Bodziec – Ba\u0142tycki Reset';
      document.getElementById('fit-m1-icon').textContent = '\u2764\uFE0F';
      document.getElementById('fit-m1-label').textContent = 'HR po wej\u015Bciu do wody';
      document.getElementById('fit-m2-icon').textContent = '\uD83D\uDCA7';
      document.getElementById('fit-m2-label').textContent = 'Czas w wodzie \u22652 min';
      document.getElementById('fit-m3-icon').textContent = '\uD83C\uDFCA';
      document.getElementById('fit-m3-label').textContent = 'Typ aktywno\u015Bci: woda /  morsowanie';
      document.getElementById('fit-m4-icon').textContent = '\uD83D\uDCCD';
      document.getElementById('fit-m4-label').textContent = 'Lokalizacja: pla\u017Ba Tr\u00F3jmiasto';
      document.getElementById('fitness-hint').textContent = 'Wymagane: 2 min w wodzie Ba\u0142tyku + lokalizacja na pla\u017Cy + smartwatch wykrywa aktywno\u015B\u0107 wodn\u0105';
      gpsSection.style.display = 'block';
      document.getElementById('gps-area').querySelector('.gps-status').className = 'gps-status';
      document.getElementById('gps-area').querySelector('.gps-label').textContent = 'Sprawdzanie lokalizacji...';
      document.getElementById('gps-start-btn').textContent = '\uD83D\uDCCD Potwierdź pobyt na pla\u017Cy';
      document.getElementById('gps-start-btn').className = 'btn-secondary gps-btn';
      document.getElementById('gps-start-btn').disabled = false;
      document.getElementById('gps-hint').textContent = 'GPS potwierdzi, że jeste\u015B na trójmiejskiej pla\u017Cy (Brzeźno, Jelitkowo, Orłowo, Sopot)';
      document.getElementById('gps-map').querySelector('.gps-map-label').textContent = 'Wybrze\u017Ce Ba\u0142tyku — pla\u017Ba do zweryfikowania';
    } else if (title.includes('Sen') || title.includes('Regeneracyjny')) {
      document.getElementById('fitness-icon').textContent = '\uD83D\uDE34';
      document.getElementById('fitness-label').textContent = 'Sen Regeneracyjny 7-8h';
      document.getElementById('fit-m1-icon').textContent = '\u23F0';
      document.getElementById('fit-m1-label').textContent = 'D\u0142ugo\u015B\u0107 snu';
      document.getElementById('fit-m2-icon').textContent = '\uD83D\uDD14';
      document.getElementById('fit-m2-label').textContent = 'Detoks cyfrowy: 60 min bez ekranu';
      document.getElementById('fit-m3-icon').textContent = '\uD83D\uDCC5';
      document.getElementById('fit-m3-label').textContent = 'Sta\u0142a pora pobudki \u00B120 min';
      document.getElementById('fit-m4-icon').textContent = '\uD83D\uDCCA';
      document.getElementById('fit-m4-label').textContent = 'Wynik regeneracji';
      document.getElementById('fitness-hint').textContent = 'Wymagane: 7-8h snu + 60 min bez telefonu przed snem + sta\u0142a pobudka \u00B120 min';
    } else if (title.includes('Azyl') || title.includes('K\u0105piel Le\u015Bna')) {
      document.getElementById('fitness-icon').textContent = '\uD83C\uDF32';
      document.getElementById('fitness-label').textContent = 'Samotny Azyl – K\u0105piel Le\u015Bna';
      document.getElementById('fit-m1-icon').textContent = '\uD83D\uDCCD';
      document.getElementById('fit-m1-label').textContent = 'Strefa g\u0142\u0119bokiego lasu \u22651.5 km od drogi';
      document.getElementById('fit-m2-icon').textContent = '\uD83D\uDCAA';
      document.getElementById('fit-m2-label').textContent = 'Czas bezruchu \u226520 min';
      document.getElementById('fit-m3-icon').textContent = '\u2764\uFE0F';
      document.getElementById('fit-m3-label').textContent = 'Spadek HR spoczynkowego';
      document.getElementById('fit-m4-icon').textContent = '\uD83D\uDCF1';
      document.getElementById('fit-m4-label').textContent = 'Ekran zablokowany 20 min';
      document.getElementById('fitness-hint').textContent = 'Wymagane: GPS strefa TPK + 20 min bezruchu + HR drop + ekran zablokowany';
      gpsSection.style.display = 'block';
      document.getElementById('gps-area').querySelector('.gps-status').className = 'gps-status';
      document.getElementById('gps-area').querySelector('.gps-label').textContent = 'Sprawdzanie lokalizacji...';
      document.getElementById('gps-start-btn').textContent = '\uD83D\uDCCD Potwierdź stref\u0119 g\u0142\u0119bokiego lasu';
      document.getElementById('gps-start-btn').className = 'btn-secondary gps-btn';
      document.getElementById('gps-start-btn').disabled = false;
      document.getElementById('gps-hint').textContent = 'GPS sprawdzi czy jeste\u015B w strefie buforowej TPK \u22651.5 km od drogi g\u0142\u00F3wnej';
      document.getElementById('gps-map').querySelector('.gps-map-label').textContent = 'TPK — Dolina Rado\u015Bci / Zaj\u0119cze Wzg\u00F3rze / Lasy Sopockie';
    }
  } else if (verifyType === 'gps') {
    gpsSection.style.display = 'block';
    document.getElementById('gps-area').querySelector('.gps-status').className = 'gps-status';
    document.getElementById('gps-area').querySelector('.gps-label').textContent = 'Sprawdzanie lokalizacji...';
    document.getElementById('gps-start-btn').textContent = '\uD83D\uDCCD Rozpocznij weryfikację GPS';
    document.getElementById('gps-start-btn').className = 'btn-secondary gps-btn';
    document.getElementById('gps-start-btn').disabled = false;
    document.getElementById('gps-map').querySelector('.gps-map-label').textContent = 'Trasa zostanie zweryfikowana';
    document.getElementById('gps-hint').textContent = 'System GPS sprawdzi Twoj\u0105 lokalizacj\u0119';
    const gpsTitle = document.querySelector('#modal-form .modal-title').textContent;
    if (gpsTitle.includes('Zielona Sztafeta') || gpsTitle.includes('Zielona Stacja') || gpsTitle.includes('Samotny W\u0119drowiec')) {
      document.getElementById('gps-hint').textContent = 'Udaj si\u0119 do najbli\u017Cszej Zielonej Stacji (G\u0142az Esperantyst\u00F3w, ambona widokowa, pomnik przyrody) i wykonaj check-in';
      document.getElementById('gps-map').querySelector('.gps-map-label').textContent = 'TPK — Zielona Stacja do potwierdzenia';
      document.getElementById('gps-start-btn').textContent = '\uD83D\uDCCD Check-in w Zielonej Stacji';
      photoSection.style.display = 'block';
      document.getElementById('photo-area').className = 'photo-area';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83D\uDCDD</div><div class="photo-label">Zostaw cyfrowy \u015Blad</div><div class="photo-sub">Napisz krótk\u0105 refleksj\u0119 lub wy\u015Blij zdj\u0119cie natury do wspólnego feedu spo\u0142eczno\u015Bci</div>';
      document.getElementById('photo-hint').textContent = 'Wymagany wpis tekstowy lub zdj\u0119cie — Tw\u00F3j \u015Blad w Zielonej Sztafecie';
      document.getElementById('photo-area').insertAdjacentHTML('beforeend', '<textarea id="forest-trace" placeholder="Twoja refleksja..." oninput="checkTraceInput()" style="width:100%;margin-top:8px;padding:10px 12px;border:1px solid var(--slate-300);border-radius:12px;font-family:Inter,sans-serif;font-size:13px;resize:vertical;min-height:60px;box-sizing:border-box"></textarea>');
      var _up = document.getElementById('photo-upload'); if (_up) _up.style.display = 'none';
      document.getElementById('modal-confirm').disabled = true;
    }
  } else if (verifyType === 'ai') {
    photoSection.style.display = 'block';
    const title = document.querySelector('#modal-form .modal-title').textContent;
    if (title.includes('Cytrynowy')) {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83E\uDD16</div><div class="photo-label">Zrób zdjęcie szklanki wody z cytryną</div><div class="photo-sub">AI Vision sprawdzi obecność plasterka cytryny w przezroczystym naczyniu</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F Wymagane zdjęcie — AI Vision wykryje cytrynę w przezroczystym naczyniu';
    } else if (title.includes('Talerza') || title.includes('Zr\u00F3wnowa\u017Cona')) {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83E\uDD16</div><div class="photo-label">Zrób zdjęcie talerza przed posiłkiem</div><div class="photo-sub">AI Vision: segmentacja obrazu — obliczy % powierzchni warzyw/owoców</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F Wymagane zdjęcie — AI Vision sprawdzi, czy \u226550% talerza to warzywa/owoce';
    } else if (title.includes('Balkon') || title.includes('Taras')) {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83E\uDD16</div><div class="photo-label">Zrób zdjęcie balkonu/tarasu</div><div class="photo-sub">AI Vision: kadr zamknięty — wykryje barierkę, donice i gatunki roślin</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F Zdjęcie balkonu z żywymi roślinami miododajnymi (sztuczne odrzucone)';
    } else if (title.includes('Ogr\u00F3d') || title.includes('Stra\u017Cnik')) {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83E\uDD16</div><div class="photo-label">Zrób zdjęcie ogrodu</div><div class="photo-sub">AI Vision: kadr szerokokątny — sprawdzi naturalną glebę, dziką trawę i schronienie</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F Wymagane zdjęcie ogrodu z naturalną glebą/trawnikiem (beton odrzucony)';
    } else {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83E\uDD16</div><div class="photo-label">Zrób zdjęcie urządzeń</div><div class="photo-sub">AI Vision zeskanuje i potwierdzi wyłączenie standby</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F AI Vision wymaga zdjęcia wyłączonych urządzeń';
    }
  } else {
    photoSection.style.display = 'block';
    const title = document.querySelector('#modal-form .modal-title').textContent;
    if (title.includes('Profilaktyka')) {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83D\uDCC4</div><div class="photo-label">Dodaj dokument lub potwierdzenie z systemu</div><div class="photo-sub">Dokument potwierdzający wykonanie badań albo wydruk/system e-zdrowie — OCR weryfikuje nagłówek "Profilaktyka 40 Plus" i datę</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F Wymagane zdjęcie dokumentu badań lub potwierdzenia — OCR (RODO safe) odczyta tylko nagłówek, pieczątkę i datę';
    } else {
      document.getElementById('photo-area').className = 'photo-area required';
      document.getElementById('photo-area').innerHTML = '<div class="photo-icon">\uD83D\uDCF7</div><div class="photo-label">Dodaj zdjęcie dowodu</div><div class="photo-sub">Paragon, produkt lub etykieta — wymagane do weryfikacji</div>';
      document.getElementById('photo-hint').textContent = '\u26A0\uFE0F Wymagane zdjęcie do potwierdzenia aktywności';
    }
  }

  document.getElementById('modal-decl').classList.add('open');
}

function closeModal() {
  document.getElementById('modal-decl').classList.remove('open');
  renderDeclarations();
}

function togglePhoto() {
  var input = document.getElementById('photo-input');
  if (input) input.click();
}

function handlePhotoSelect(ev) {
  var file = ev.target.files && ev.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function(e) {
    showPhotoPreview(e.target.result);
  };
  reader.readAsDataURL(file);
}

function showPhotoPreview(dataUrl) {
  var el = document.getElementById('photo-area');
  var preview = document.getElementById('photo-preview');
  var confirmBtn = document.getElementById('photo-confirm-btn');
  var hint = document.getElementById('photo-hint');
  el.style.display = 'none';
  preview.style.display = 'block';
  preview.innerHTML = '<img src="' + dataUrl + '" style="width:100%;border-radius:12px;display:block">';
  confirmBtn.style.display = 'block';
  hint.textContent = 'Sprawdź czy zdjęcie jest wyraźne, zatwierdź lub zrób nowe';
  window._pendingPhoto = dataUrl;
}

function confirmPhoto() {
  hasPhoto = true;
  var el = document.getElementById('photo-area');
  var preview = document.getElementById('photo-preview');
  var confirmBtn = document.getElementById('photo-confirm-btn');
  var hint = document.getElementById('photo-hint');
  preview.innerHTML = '<div style="display:flex;align-items:center;gap:8px;padding:8px 12px;background:#D1FAE5;border-radius:12px"><span style="font-size:20px">\u2705</span><span style="font-size:13px;color:#065F46;font-weight:600">Zdj\u0119cie zatwierdzone</span></div>';
  confirmBtn.textContent = 'Zmiana zdj\u0119cia';
  confirmBtn.onclick = function() { retakePhoto(); };
  hint.textContent = '\u2705 Zdj\u0119cie zatwierdzone';
  var title = document.querySelector('#modal-form .modal-title').textContent;
  if (title.includes('Cytrynowy') || title.includes('Talerza') || title.includes('Zr\u00F3wnowa\u017Cona') || title.includes('Profilaktyka')) {
    simulateAiCheck(title);
  } else if (title.includes('\u017Bywno\u015B\u0107 bio') || title.includes('certyfikowana')) {
    runOcrOnPhoto(window._pendingPhoto, 'bio');
  } else if (currentVerifyType === 'photo' || currentVerifyType === 'ai') {
    document.getElementById('modal-confirm').disabled = false;
  } else if (currentVerifyType === 'dual') {
    checkDualConfirm();
  }
}

function retakePhoto() {
  hasPhoto = false;
  var el = document.getElementById('photo-area');
  var preview = document.getElementById('photo-preview');
  var confirmBtn = document.getElementById('photo-confirm-btn');
  var hint = document.getElementById('photo-hint');
  el.style.display = 'block';
  preview.style.display = 'none';
  preview.innerHTML = '';
  confirmBtn.style.display = 'none';
  confirmBtn.textContent = '\u2713 Potwierd\u017A zdj\u0119cie';
  confirmBtn.onclick = function() { confirmPhoto(); };
  hint.textContent = 'Zr\u00F3b zdj\u0119cie, aby potwierdzi\u0107';
  document.getElementById('modal-confirm').disabled = true;
  document.getElementById('photo-input').value = '';
}

function simulateAiCheck(title) {
  var hint = document.getElementById('photo-hint');
  var confirmBtn = document.getElementById('modal-confirm');
  hasPhoto = true;
  if (title.includes('Cytrynowy')) {
    hint.textContent = '\u2705 AI Vision: plasterek cytryny w przezroczystej szklance potwierdzony \u2014 +20 EC';
  } else if (title.includes('Talerza') || title.includes('Zr\u00F3wnowa\u017Cona')) {
    hint.textContent = '\u2705 AI Vision: \u226554% powierzchni to warzywa i owoce \u2014 Zasada Talerza potwierdzona';
  } else if (title.includes('Profilaktyka')) {
    hint.textContent = '\u2705 OCR: dokument bada\u0144 Profilaktyka 40 Plus zweryfikowany, dane wra\u017Cliwe maskowane';
  }
  confirmBtn.disabled = false;
}

function syncSmartHome() {
  const btn = document.getElementById('api-sync-btn');
  const hint = document.getElementById('api-hint');
  const title = document.querySelector('#modal-form .modal-title').textContent;
  const isNoCar = title.includes('bez Auta');
  const isLunchbox = title.includes('Lunchbox');
  const isNawadnianie = title.includes('Nawadnianie');
  const isRuch = title.includes('Krok') || title.includes('10 Tysi\u0119cy');
  const isHigiena = title.includes('Higiena');
  btn.disabled = true;

  if (isNoCar) {
    btn.textContent = '\u23F3 \u0141\u0105czenie z Google Fit / Apple Health...';
    hint.textContent = '\u23F3 Pobieranie historii aktywno\u015Bci z ostatnich 30 dni...';

    setTimeout(() => {
      btn.textContent = '\u23F3 Analiza \u015Brodk\u00F3w transportu...';
      hint.textContent = '\u23F3 Sprawdzanie przejazd\u00F3w samochodem vs rower/pieszo...';
    }, 1500);

    setTimeout(() => {
      btn.textContent = '\u23F3 Weryfikacja 30-dniowej passy bez auta...';
      hint.textContent = '\u23F3 \u0141\u0105czna liczba przejazd\u00F3w samochodem: 0';
    }, 3000);

    setTimeout(() => {
      document.querySelectorAll('.api-device').forEach(d => {
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = '\u2705 0 km';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge ok';
      });
      document.getElementById('api-power').textContent = '0 km';
      document.getElementById('api-status').textContent = 'ZERO EMISJI \u2713';
      document.getElementById('api-summary').className = 'api-summary';
      btn.textContent = '\u2705 30 dni bez auta — potwierdzone';
      btn.style.opacity = '0.6';
      btn.style.pointerEvents = 'none';
      hint.textContent = '\u2705 Zero przejazd\u00F3w samochodem przez 30 dni — +150 EC';
      document.getElementById('modal-confirm').disabled = false;
    }, 5000);
  } else if (isLunchbox) {
    btn.textContent = '\u23F3 \u0141\u0105czenie z MyFitnessPal...';
    hint.textContent = '\u23F3 Pobieranie danych makrosk\u0142adnik\u00F3w ostatniego posi\u0142ku...';

    setTimeout(() => {
      btn.textContent = '\u23F3 Analiza bia\u0142ka i b\u0142onnika...';
      hint.textContent = '\u23F3 Sprawdzanie: bia\u0142ko ro\u015Blinne \u226525g, b\u0142onnik \u22658g...';
    }, 1500);

    setTimeout(() => {
      document.querySelectorAll('.api-device').forEach((d, i) => {
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = i < 2 ? '\u2705' : '\u2139\uFE0F';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge ok';
      });
      document.querySelectorAll('.api-device')[0].querySelector('.api-dev-status').textContent = '28 g \u2705';
      document.querySelectorAll('.api-device')[1].querySelector('.api-dev-status').textContent = '9 g \u2705';
      document.querySelectorAll('.api-device')[2].querySelector('.api-dev-status').textContent = 'OK';
      document.querySelectorAll('.api-device')[3].querySelector('.api-dev-status').textContent = '45 g';
      document.getElementById('api-power').textContent = '28 g';
      document.getElementById('api-status').textContent = 'MAKRO ZALICZONE \u2713';
      document.getElementById('api-status').className = 'api-summary-val api-ok';
      btn.textContent = '\u2705 Posi\u0142ek spe\u0142nia normy — +40 EC';
      btn.style.opacity = '0.6';
      btn.style.pointerEvents = 'none';
      hint.textContent = '\u2705 Bia\u0142ko ro\u015Blinne 28g \u226525g, b\u0142onnik 9g \u22658g — wszystko OK!';
      document.getElementById('modal-confirm').disabled = false;
    }, 3000);
  } else if (isNawadnianie) {
    btn.textContent = '\u23F3 \u0141\u0105czenie z inteligentn\u0105 butelk\u0105 (Bluetooth LE)...';
    hint.textContent = '\u23F3 Synchronizacja z HidrateSpark / Waterdrop Smart...';
    setTimeout(() => {
      btn.textContent = '\u23F3 Odczyt dziennej obj\u0119to\u015Bci...';
      hint.textContent = '\u23F3 Sprawdzanie: 2500 ml dziennie + 250 ml przed 8:30...';
    }, 1500);
    setTimeout(() => {
      document.querySelectorAll('.api-device').forEach((d, i) => {
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = i < 2 ? '\u2705' : '\u2139\uFE0F';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge ok';
      });
      document.querySelectorAll('.api-device')[0].querySelector('.api-dev-status').textContent = '2 450 / 2500 ml \u2705';
      document.querySelectorAll('.api-device')[1].querySelector('.api-dev-status').textContent = '250 ml o 7:34 \u2705';
      document.querySelectorAll('.api-device')[2].querySelector('.api-dev-status').textContent = '2.1 L';
      document.querySelectorAll('.api-device')[3].querySelector('.api-dev-status').textContent = '45 min temu';
      document.getElementById('api-power').textContent = '2 450 ml';
      document.getElementById('api-status').textContent = 'NAWODNIENIE ZALICZONE \u2713';
      document.getElementById('api-status').className = 'api-summary-val api-ok';
      btn.textContent = '\u2705 Nawodnienie dzienne potwierdzone — +15 EC';
      btn.style.opacity = '0.6';
      btn.style.pointerEvents = 'none';
      hint.textContent = '\u2705 2450/2500 ml, pierwsza porcja 250 ml o 7:34 \u2014 wszystko OK!';
      document.getElementById('modal-confirm').disabled = false;
    }, 3000);
  } else if (isRuch) {
    btn.textContent = '\u23F3 \u0141\u0105czenie z krokomierzem / Apple Health...';
    hint.textContent = '\u23F3 Pobieranie dzisiejszej liczby kroków...';
    setTimeout(() => {
      btn.textContent = '\u23F3 Analiza aktywno\u015Bci dziennej...';
      hint.textContent = '\u23F3 Sprawdzanie: 10 000 kroków, dystans, pi\u0119tra...';
    }, 1500);
    setTimeout(() => {
      document.querySelectorAll('.api-device').forEach((d, i) => {
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = i < 1 ? '\u2705' : '\u2139\uFE0F';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge ok';
      });
      document.querySelectorAll('.api-device')[0].querySelector('.api-dev-status').textContent = '10 342 \u2705';
      document.querySelectorAll('.api-device')[1].querySelector('.api-dev-status').textContent = '7.2 km';
      document.querySelectorAll('.api-device')[2].querySelector('.api-dev-status').textContent = '78 min';
      document.querySelectorAll('.api-device')[3].querySelector('.api-dev-status').textContent = '6';
      document.getElementById('api-power').textContent = '10 342';
      document.getElementById('api-status').textContent = 'CEL KROK\u00D3W OSI\u0104GNI\u0118TY \u2713';
      document.getElementById('api-status').className = 'api-summary-val api-ok';
      btn.textContent = '\u2705 10 342 kroki — dzienny cel zaliczony! +20 EC';
      btn.style.opacity = '0.6';
      btn.style.pointerEvents = 'none';
      hint.textContent = '\u2705 10 342 kroki, 7.2 km, 78 min aktywny — wszystko OK!';
      document.getElementById('modal-confirm').disabled = false;
    }, 3000);
  } else if (isHigiena) {
    btn.textContent = '\u23F3 \u0141\u0105czenie z Headspace / Calm / Apple Health...';
    hint.textContent = '\u23F3 Pobieranie danych sesji mindfulness...';
    setTimeout(() => {
      btn.textContent = '\u23F3 Analiza HRV i d\u0142ugo\u015Bci sesji...';
      hint.textContent = '\u23F3 Sprawdzanie: 10 min medytacji, spadek t\u0119tna, wzrost HRV...';
    }, 1500);
    setTimeout(() => {
      document.querySelectorAll('.api-device').forEach((d, i) => {
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = i < 1 ? '\u2705' : '\u2139\uFE0F';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge ok';
      });
      document.querySelectorAll('.api-device')[0].querySelector('.api-dev-status').textContent = '12 min \u226510 min \u2705';
      document.querySelectorAll('.api-device')[1].querySelector('.api-dev-status').textContent = '+18 ms \u2705';
      document.querySelectorAll('.api-device')[2].querySelector('.api-dev-status').textContent = '72 \u2192 62 BPM';
      document.querySelectorAll('.api-device')[3].querySelector('.api-dev-status').textContent = 'Mindfulness \u2713';
      document.getElementById('api-power').textContent = '12 min';
      document.getElementById('api-status').textContent = 'REDUKCJA STRESU POTWIERDZONA \u2713';
      document.getElementById('api-status').className = 'api-summary-val api-ok';
      btn.textContent = '\u2705 Sesja mindfulness 12 min — +15 EC';
      btn.style.opacity = '0.6';
      btn.style.pointerEvents = 'none';
      hint.textContent = '\u2705 12 min medytacji, HR 72\u219262 BPM, HRV +18 ms — regeneracja potwierdzona!';
      document.getElementById('modal-confirm').disabled = false;
    }, 3000);
  } else {
    btn.textContent = '\u23F3 \u0141\u0105czenie z API Tuya...';
    hint.textContent = '\u23F3 Synchronizacja danych z inteligentnych gniazdek...';

    setTimeout(() => {
      btn.textContent = '\u23F3 Sprawdzanie poboru mocy w oknie 23:00\u201306:00...';
      hint.textContent = '\u23F3 Odczyt zu\u017Cycia energii z 4 gniazdek...';
    }, 1000);

    setTimeout(() => {
      document.querySelectorAll('.api-device').forEach(d => {
        d.className = 'api-device connected';
        d.querySelector('.api-dev-badge').textContent = '\u2705 0W';
        d.querySelector('.api-dev-badge').className = 'api-dev-badge ok';
      });
      document.getElementById('api-power').textContent = '0.0 W';
      document.getElementById('api-status').textContent = 'ZERO PHANTOM LOAD \u2713';
      document.getElementById('api-summary').className = 'api-summary';
      btn.className = 'api-sync-btn';
      btn.textContent = '\u2705 Zsynchronizowano — 0W poboru';
      btn.style.opacity = '0.6';
      btn.style.pointerEvents = 'none';
      hint.textContent = '\u2705 Automatyczna weryfikacja zako\u0144czona — brak obci\u0105\u017Cenia w oknie 23:00\u201306:00';
      document.getElementById('modal-confirm').disabled = false;
    }, 3000);
  }
}

function syncThermostat() {
  const btn = document.getElementById('therm-sync-btn');
  const hint = document.getElementById('therm-hint');
  btn.disabled = true;
  btn.textContent = '\u23F3 \u0141\u0105czenie z API Netatmo...';
  hint.textContent = '\u23F3 Odczyt historii temperatur z g\u0142owic...';

  let step = 0;
  const steps = [
    { text: '\u23F3 Pobieranie danych z 4 termostat\u00F3w...', hint: '\u23F3 Odczyt temperatury: Salon, Sypialnia, Dziecko, Biuro' },
    { text: '\u23F3 Analiza wykresu dobowego (ostatnie 24h)...', hint: '\u23F3 Sprawdzanie prog\u00F3w: dzie\u0144 \u226421\u00B0C / noc \u226418\u00B0C' },
    { text: '\u23F3 Weryfikacja danych za 7 dni...', hint: '\u23F3 Ci\u0105g\u0142o\u015B\u0107 tygodniowa — sprawdzanie wszystkich pomiar\u00F3w' },
  ];

  const interval = setInterval(() => {
    if (step < steps.length) {
      btn.textContent = steps[step].text;
      hint.textContent = steps[step].hint;
      step++;
    }
  }, 1500);

  setTimeout(() => {
    clearInterval(interval);
    document.querySelectorAll('.therm-room').forEach(r => {
      r.className = 'therm-room ok';
      r.querySelector('.therm-room-badge').textContent = '\u2705';
    });
    document.getElementById('therm-bar-fill').style.width = '100%';
    document.getElementById('therm-days').textContent = 'Dzie\u0144 7 / 7';
    document.getElementById('therm-avg-day').textContent = '21.1\u00B0C \u2705';
    document.getElementById('therm-avg-night').textContent = '18.0\u00B0C \u2705';
    document.getElementById('therm-saved').textContent = '~84 z\u0142 / msc';
    btn.textContent = '\u2705 Misja Grzewcza zaliczona — 7/7 dni';
    btn.style.opacity = '0.6';
    btn.style.pointerEvents = 'none';
    hint.textContent = '\u2705 Wszystkie pomiary w normie — nagroda 120 EC przyznana automatycznie';
    document.getElementById('modal-confirm').disabled = false;
  }, 5000);
}

function syncFitness() {
  const btn = document.getElementById('fitness-sync-btn');
  const hint = document.getElementById('fitness-hint');
  const title = document.querySelector('#modal-form .modal-title').textContent;
  btn.disabled = true;
  btn.textContent = '\u23F3 \u0141\u0105czenie z smartwatchem...';
  hint.textContent = '\u23F3 Pobieranie danych treningowych z Google Fit / Apple Health...';

  setTimeout(() => {
    btn.textContent = '\u23F3 Odczyt parametr\u00F3w wysi\u0142ku...';
    hint.textContent = '\u23F3 Analiza metric treningowych...';
  }, 1500);

  setTimeout(() => {
    btn.textContent = '\u23F3 Weryfikacja prog\u00F3w...';
    if (title.includes('Koron')) {
      hint.textContent = '\u23F3 Sprawdzanie: przewy\u017Cszenie +100m, HR Strefa 4, tempo...';
      document.getElementById('fit-m1-val').textContent = '+124 m \u2713';
      document.getElementById('fit-m2-val').textContent = 'Strefa 4 (87%) \u2713';
      document.getElementById('fit-m3-val').textContent = '4:52/km';
      document.getElementById('fit-m4-val').textContent = '18:40 min';
    } else if (title.includes('Tempa')) {
      hint.textContent = '\u23F3 Sprawdzanie: dystans 5 km, tempo \u00B115s, kadencja...';
      document.getElementById('fit-m1-val').textContent = '5.02 km \u2713';
      document.getElementById('fit-m2-val').textContent = '4:30/km \u00B18s \u2713';
      document.getElementById('fit-m3-val').textContent = '172 spm \u2713';
      document.getElementById('fit-m4-val').textContent = '\u00B18s \u2713';
    } else if (title.includes('Nadmorskiej') || title.includes('P\u0119tli')) {
      hint.textContent = '\u23F3 Sprawdzanie: moc 180W, 20 min, 500 kcal...';
      document.getElementById('fit-m1-val').textContent = '195 W \u2713';
      document.getElementById('fit-m2-val').textContent = '24:10 min \u2713';
      document.getElementById('fit-m3-val').textContent = '620 kcal \u2713';
      document.getElementById('fit-m4-val').textContent = '18.4 km';
    } else if (title.includes('Zimny Bodziec') || title.includes('Ba\u0142tycki Reset')) {
      hint.textContent = '\u23F3 Sprawdzanie: HR water, czas w wodzie, typ aktywno\u015Bci wodnej...';
      document.getElementById('fit-m1-val').textContent = '98 BPM \u2192 54 BPM \u2713';
      document.getElementById('fit-m2-val').textContent = '3:12 min \u22652 min \u2713';
      document.getElementById('fit-m3-val').textContent = 'Morsowanie / Swimming (cold)';
      document.getElementById('fit-m4-val').textContent = 'Pla\u017Ca Sopot \u2713';
    } else if (title.includes('Sen') || title.includes('Regeneracyjny')) {
      hint.textContent = '\u23F3 Sprawdzanie: d\u0142ugo\u015B\u0107 snu, detoks cyfrowy, sta\u0142o\u015B\u0107 pobudki...';
      document.getElementById('fit-m1-val').textContent = '7:52 h \u2713';
      document.getElementById('fit-m2-val').textContent = '62 min bez ekranu \u2713';
      document.getElementById('fit-m3-val').textContent = '6:32 \u00B112 min \u2713';
      document.getElementById('fit-m4-val').textContent = '85/100 \u2713';
    } else if (title.includes('Azyl') || title.includes('K\u0105piel Le\u015Bna')) {
      hint.textContent = '\u23F3 Sprawdzanie: strefa le\u015Bna, bezruch 20 min, HR drop, ekran zablokowany...';
      document.getElementById('fit-m1-val').textContent = 'TPK Dolina Rado\u015Bci \u2713';
      document.getElementById('fit-m2-val').textContent = '22:15 min \u226520 min \u2713';
      document.getElementById('fit-m3-val').textContent = '78 \u2192 62 BPM (-16) \u2713';
      document.getElementById('fit-m4-val').textContent = 'Ekran zablokowany 20:18 min \u2713';
    }
  }, 3000);

  setTimeout(() => {
    document.getElementById('fitness-watch-status').textContent = 'Dane treningowe pobrane';
    document.getElementById('fitness-watch-badge').textContent = '\u2705';
    document.getElementById('fit-status').textContent = 'WSZYSTKIE PARAMETRY ZALICZONE \u2713';
    document.getElementById('fit-status').className = 'fitness-summary-val';
    document.getElementById('fit-status').style.color = 'var(--moss-green)';
    if (title.includes('Koron')) {
      document.getElementById('fit-verify-detail').textContent = 'Przewy\u017Cszenie 124m \u2265100m \u2713 | HR Strefa 4: 87% czasu \u2713';
    } else if (title.includes('Tempa')) {
      document.getElementById('fit-verify-detail').textContent = '5.02 km \u2713 | Tempo 4:30 \u00B18s \u2713 | Kadencja 172 \u2713';
    } else if (title.includes('Nadmorskiej') || title.includes('P\u0119tli')) {
      document.getElementById('fit-verify-detail').textContent = '195W \u2265180W \u2713 | 24 min \u226520 min \u2713 | 620 kcal \u2265500 \u2713';
    } else if (title.includes('Zimny Bodziec') || title.includes('Ba\u0142tycki Reset')) {
      document.getElementById('fit-verify-detail').textContent = 'HR: 98\u219254 BPM (cold shock) | Czas w wodzie: 3:12 min | Lokalizacja: Sopot';
    } else if (title.includes('Sen') || title.includes('Regeneracyjny')) {
      document.getElementById('fit-verify-detail').textContent = 'Sen: 7h 52min | Detoks cyfrowy: 62 min | Pobudka: 6:32 \u00B112 min';
    }
    btn.textContent = '\u2705 Trening zweryfikowany';
    btn.style.opacity = '0.6';
    btn.style.pointerEvents = 'none';
    hint.textContent = '\u2705 Wszystkie parametry potwierdzone przez smartwatch';
    const isZimny = title.includes('Zimny Bodziec') || title.includes('Ba\u0142tycki Reset');
    if (isZimny) {
      if (gpsVerified) {
        document.getElementById('modal-confirm').disabled = false;
      }
    } else {
      document.getElementById('modal-confirm').disabled = false;
    }
  }, 5000);
}

function toggleOcrPhoto() {
  document.getElementById('ocr-input').click();
}

function handleOcrSelect(ev) {
  var file = ev.target.files && ev.target.files[0];
  if (!file) return;
  var area = document.getElementById('ocr-photo-area');
  var preview = document.getElementById('ocr-preview');
  var hint = document.getElementById('ocr-hint');
  area.style.display = 'none';
  preview.style.display = 'block';
  preview.innerHTML = '<img src="" id="ocr-img" style="width:100%;border-radius:12px;display:block"><div style="text-align:center;padding:12px;font-size:13px;color:var(--slate-600)"><span class="spinner" style="display:inline-block;animation:spin 1s linear infinite;margin-right:6px">\u23F3</span> Tesseract.js odczytuje tekst z paragonu...</div>';
  hint.textContent = '\u23F3 OCR w trakcie analizy...';
  var reader = new FileReader();
  reader.onload = function(e) {
    document.getElementById('ocr-img').src = e.target.result;
    runOcr(e.target.result);
  };
  reader.readAsDataURL(file);
}

function runOcr(dataUrl) {
  var resultDiv = document.getElementById('ocr-result');
  var rawDiv = document.getElementById('ocr-raw');
  var hint = document.getElementById('ocr-hint');
  var title = document.querySelector('#modal-form .modal-title').textContent;
  var isZielona = title.includes('Zielona Proporcja');
  Tesseract.recognize(dataUrl, 'pol+eng', { logger: function(m) { if (m.status === 'recognizing text') hint.textContent = '\u23F3 OCR: ' + Math.round(m.progress * 100) + '%'; } })
    .then(function(out) {
      var text = out.data.text;
      rawDiv.style.display = 'block';
      rawDiv.textContent = text || '(brak tekstu)';
      resultDiv.style.display = 'block';
      var shop = extractOcrField(text, ['sklep', 'shop', 'restauracja', 'bistro', 'bar', 'company', 'nip'], 2);
      var date = extractOcrField(text, ['data', 'date', '202'], 1) || extractDate(text);
      var amount = extractOcrField(text, ['suma', 'total', 'kwota', 'amount', 'zapłata', 'pln', 'zł'], 0) || extractAmount(text);
      document.getElementById('ocr-shop').textContent = shop || (isZielona ? 'Avocado Vegan Bistro' : 'Krawiec Gdańsk Wrzeszcz');
      document.getElementById('ocr-date').textContent = date || new Date().toLocaleDateString('pl-PL');
      document.getElementById('ocr-amount').textContent = amount || (isZielona ? '42,00 PLN' : '49,90 PLN');
      if (text.length > 10) {
        document.getElementById('ocr-status').textContent = isZielona ? 'Pozycja wege rozpoznana \u2713' : 'Autentyczny \u2713';
        hint.textContent = '\u2705 OCR zako\u0144czony — ' + text.length + ' znak\u00F3w odczytanych';
        checkDualConfirm();
      } else {
        document.getElementById('ocr-status').textContent = 'S\u0142aba jako\u017C \u2014 spr\u00F3buj ponownie';
        hint.textContent = '\u26A0\uFE0F Za ma\u0142o tekstu — zr\u00F3b zdj\u0119cie bli\u017Cej, w lepszym \u015Bwietle';
      }
    })
    .catch(function(err) {
      hint.textContent = '\u274C OCR failed: ' + err.message + ' — u\u017Cyto symulacji';
      fallbackOcr(isZielona);
    });
}

function extractOcrField(text, keywords, offset) {
  var lines = text.split('\n');
  for (var i = 0; i < lines.length; i++) {
    var line = lines[i].toLowerCase().trim();
    for (var k = 0; k < keywords.length; k++) {
      if (line.includes(keywords[k])) {
        var idx = i + offset;
        if (idx < lines.length) return lines[idx].trim();
      }
    }
  }
  return null;
}

function extractDate(text) {
  var m = text.match(/(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{2,4})/);
  if (m) return m[0];
  return null;
}

function extractAmount(text) {
  var m = text.match(/(\d+[,\s]?\d*[,\.]\d{2})\s*(?:PLN|zł|zlotych)?/i);
  if (m) return m[1] + ' PLN';
  m = text.match(/(?:suma|total|kwota|zapłata|do\s*zapłaty)[:\s]*(\d+[,\s]?\d*[,\.]\d{2})/i);
  if (m) return m[1] + ' PLN';
  return null;
}

function fallbackOcr(isZielona) {
  var resultDiv = document.getElementById('ocr-result');
  resultDiv.style.display = 'block';
  document.getElementById('ocr-shop').textContent = isZielona ? 'Avocado Vegan Bistro, Oliwa' : 'Krawiec Gda\u0144sk Wrzeszcz';
  document.getElementById('ocr-date').textContent = new Date().toLocaleDateString('pl-PL');
  document.getElementById('ocr-amount').textContent = isZielona ? '42,00 PLN' : '49,90 PLN';
  document.getElementById('ocr-status').textContent = isZielona ? 'Pozycja wege: Buddha Bowl \u2713' : 'Autentyczny \u2713';
  checkDualConfirm();
}

function runOcrOnPhoto(dataUrl, type) {
  var hint = document.getElementById('photo-hint');
  var confirmBtn = document.getElementById('modal-confirm');
  hint.textContent = '\u23F3 OCR sprawdza certyfikat...';
  Tesseract.recognize(dataUrl, 'pol+eng', { logger: function(m) { if (m.status === 'recognizing text') hint.textContent = '\u23F3 OCR: ' + Math.round(m.progress * 100) + '%'; } })
    .then(function(out) {
      var text = out.data.text.toLowerCase();
      if (text.includes('bio') || text.includes('eko') || text.includes('organic') || text.includes('certified') || text.includes('certyfikat') || text.includes('rolnictwo') || text.includes('bez pestycyd')) {
        hint.textContent = '\u2705 Certyfikat bio / eko potwierdzony przez OCR! +10 EC';
      } else {
        hint.textContent = '\u26A0\uFE0F Tekst nie zawiera certyfikatu bio \u2014 ale aktywno\u015B\u0107 zaliczona (symulacja)';
      }
      confirmBtn.disabled = false;
    })
    .catch(function() {
      hint.textContent = '\u2705 Aktywno\u015B\u0107 bio zaliczona (OCR niedost\u0119pny)';
      confirmBtn.disabled = false;
    });
}

function checkDualConfirm() {
  if (currentVerifyType !== 'dual') return;
  const photoOk = hasPhoto;
  const gpsOk = gpsVerified;
  const ocrDone = document.getElementById('ocr-result').style.display === 'block';
  document.getElementById('modal-confirm').disabled = !(photoOk && gpsOk && ocrDone);
}

function startGps() {
  const status = document.getElementById('gps-area').querySelector('.gps-status');
  const label = document.getElementById('gps-area').querySelector('.gps-label');
  const btn = document.getElementById('gps-start-btn');
  const hint = document.getElementById('gps-hint');
  const mapLabel = document.getElementById('gps-map').querySelector('.gps-map-label');
  const title = document.querySelector('#modal-form .modal-title').textContent;
  const isGreenZone = title.includes('Zielonej Strefie');
  const isBalans = title.includes('Balans');
  const isZielona = title.includes('Zielona Proporcja');
  const isZimny = title.includes('Zimny Bodziec') || title.includes('Ba\u0142tycki Reset') || title.includes('Mors');
  const isDual = currentVerifyType === 'dual';
  const isAzyl = title.includes('Azyl') || title.includes('K\u0105piel Le\u015Bna');
  const isEcho = title.includes('Echo') || title.includes('Zielona Sztafeta') || title.includes('Zielona Stacja') || title.includes('Samotny W\u0119drowiec');

  status.className = 'gps-status active';
  label.textContent = '\uD83D\uDCBB Szukam sygna\u0142u GPS...';
  btn.disabled = true;
  btn.textContent = '\u23F3 Sprawdzanie...';

  setTimeout(() => {
    status.className = 'gps-status active';
    if (isGreenZone) {
      label.textContent = '\uD83D\uDDFA\uFE0F Geofencing: Park Oliwski im. A. Mickiewicza \u2014 jeste\u015B w zielonej strefie';
    } else if (isBalans) {
      label.textContent = '\uD83D\uDDFA\uFE0F Geofencing: Las Dolny Sopot \u2014 pas nadmorski, poranny spacer potwierdzony';
    } else if (isZielona) {
      label.textContent = '\uD83D\uDDFA\uFE0F Geofencing: Avocado Vegan Bistro, ul. Polanki 124, Oliwa \u2014 jeste\u015B w restauracji';
    } else if (isZimny) {
      label.textContent = '\uD83D\uDDFA\uFE0F Geofencing: Wybrze\u017Ce Ba\u0142tyku \u2014 pla\u017Ca Sopot, jeste\u015B na morsowanie';
    } else if (isAzyl) {
      label.textContent = '\uD83D\uDDFA\uFE0F Geofencing: TPK Dolina Rado\u015Bci \u2014 strefa g\u0142\u0119bokiego lasu, \u22651.5 km od drogi g\u0142\u00F3wnej';
    } else if (isEcho) {
      label.textContent = '\uD83D\uDDFA\uFE0F Geofencing: G\u0142az Esperantyst\u00F3w \u2014 szukam Zielonej Stacji...';
    } else if (isDual) {
      label.textContent = '\uD83D\uDDFA\uFE0F Lokalizacja: ul. Wajdeloty 12, Gda\u0144sk Wrzeszcz \u2014 Zak\u0142ad Krawiecki \u201eAnna\u201D';
    } else {
      label.textContent = '\uD83D\uDDFA\uFE0F Trasa: Gda\u0144sk Wrzeszcz \u2192 Oliwa (3,2 km)';
    }
  }, 1000);

  setTimeout(() => {
    status.className = 'gps-status verified';
    if (isGreenZone) {
      label.textContent = '\u2705 32 minuty w Parku Oliwskim potwierdzone! Strefa zielona zaliczona.';
      btn.className = 'gps-btn verified';
      btn.textContent = '\u2705 Pobyt w zielonej strefie potwierdzony';
      hint.textContent = '\u2705 Geofencing: 32 min w Parku Oliwskim \u2014 +40 EC';
      mapLabel.textContent = '\u2705 Park Oliwski \u2022 Strefa zielona: 32 min';
    } else if (isBalans) {
      label.textContent = '\u2705 Spacer w pasie nadmorskim potwierdzony! Kod QR zeskanowany w Las Dolny Sopot.';
      btn.className = 'gps-btn verified';
      btn.textContent = '\u2705 Geofencing i QR potwierdzone';
      hint.textContent = '\u2705 Sopocki Balans: spacer + zielony koktajl \u2014 +30 EC';
      mapLabel.textContent = '\u2705 Las Dolny Sopot \u2022 Pas nadmorski \u2022 QR zweryfikowany';
    } else if (isZielona) {
      label.textContent = '\u2705 Pobyt w Avocado Vegan Oliwa potwierdzony! Teraz dodaj zdj\u0119cie talerza.';
      btn.className = 'gps-btn verified';
      btn.textContent = '\u2705 GPS Avocado potwierdzony';
      hint.textContent = '\u2705 Lokalizacja Avocado Vegan Bistro zweryfikowana \u2014 przejd\u017A do zdj\u0119cia';
      mapLabel.textContent = '\u2705 Avocado Vegan, ul. Polanki 124, Oliwa \u2022 GPS OK';
    } else if (isZimny) {
      label.textContent = '\u2705 Pla\u017Ca Sopot potwierdzona! Smartwatch wykry\u0142 aktywno\u015B\u0107 wodn\u0105: 3 min.';
      btn.className = 'gps-btn verified';
      btn.textContent = '\u2705 GPS pla\u017Cy potwierdzony';
      hint.textContent = '\u2705 Zimny Bodziec: morsowanie na pla\u017Cy Sopot \u2014 3 min w wodzie Ba\u0142tyku \u2014 +25 EC';
      mapLabel.textContent = '\u2705 Pla\u017Ba Sopot \u2022 Ba\u0142tyk \u2022 GPS + smartwatch OK';
    } else if (isAzyl) {
      label.textContent = '\u2705 Strefa g\u0142\u0119bokiego lasu TPK potwierdzona! Odleg\u0142o\u015B\u0107 od drogi: 2.1 km.';
      btn.className = 'gps-btn verified';
      btn.textContent = '\u2705 GPS strefy le\u015Bnej potwierdzony';
      hint.textContent = '\u2705 TPK Dolina Rado\u015Bci \u2014 2.1 km od drogi g\u0142\u00F3wnej \u2014 przejd\u017A do smartwatcha';
      mapLabel.textContent = '\u2705 TPK \u2022 Dolina Rado\u015Bci \u2022 2.1 km od aglomeracji \u2022 GPS OK';
    } else if (isEcho) {
      label.textContent = '\u2705 Zielona Stacja potwierdzona! Jeste\u015B przy G\u0142azie Esperantyst\u00F3w.';
      btn.className = 'gps-btn verified';
      btn.textContent = '\u2705 Check-in w Zielonej Stacji';
      hint.textContent = '\u2705 G\u0142az Esperantyst\u00F3w \u2014 dodaj cyfrowy \u015Blad poni\u017Cej';
      mapLabel.textContent = '\u2705 TPK \u2022 G\u0142az Esperantyst\u00F3w \u2022 Zielona Stacja';
    } else if (isDual) {
      label.textContent = '\u2705 Lokalizacja potwierdzona: Zak\u0142ad Krawiecki \u201eAnna\u201D, Wrzeszcz';
      btn.className = 'gps-btn verified';
      btn.textContent = '\u2705 GPS potwierdzony';
      hint.textContent = '\u2705 Lokalizacja rzemie\u015Blnicza zweryfikowana';
      mapLabel.textContent = '\u2705 ul. Wajdeloty 12, Gda\u0144sk \u2022 Krawiec rzemie\u015Blnik';
    } else {
      label.textContent = '\u2705 Trasa zweryfikowana \u2014 dojazd rowerem potwierdzony!';
      btn.className = 'gps-btn verified';
      btn.textContent = '\u2705 GPS zatwierdzony';
      hint.textContent = '\u2705 Weryfikacja GPS zako\u0144czona sukcesem';
      mapLabel.textContent = '\u2705 Trasa: Gda\u0144sk Wrzeszcz \u2192 Oliwa (3,2 km)';
    }
    gpsVerified = true;
    if (isDual) {
      checkDualConfirm();
    } else if (isEcho) {
      document.getElementById('modal-confirm').disabled = false;
    } else {
      document.getElementById('modal-confirm').disabled = false;
    }
  }, 2500);
}

function checkTraceInput() {
  var trace = document.getElementById('forest-trace');
  if (trace && gpsVerified) {
    document.getElementById('modal-confirm').disabled = false;
  }
}

function confirmDecl() {
  document.getElementById('modal-form').style.display = 'none';
  document.getElementById('modal-success').style.display = 'block';
  document.querySelector('#modal-success .pts-added').textContent = '+' + currentDeclPt;
  const verifyLabel = currentVerifyType === 'gps' ? 'GPS' : currentVerifyType === 'ai' ? 'AI Vision' : currentVerifyType === 'dual' ? 'GPS + zdj\u0119cia + OCR' : currentVerifyType === 'api' ? 'Smart Home API' : currentVerifyType === 'thermostat' ? 'Smart Thermostat API' : currentVerifyType === 'fitness' ? 'Wearable API (smartwatch)' : 'zdj\u0119cia';
  const title = document.querySelector('#modal-form .modal-title').textContent;
  let successMsg = '';
  if (currentVerifyType === 'fitness' && (title.includes('Koron'))) {
    successMsg = 'Zdobywca Tr\u00F3jmiejskich Koron! Przewy\u017Cszenie +124m, t\u0119tno w Strefie 4 przez 87% czasu. +55 EC.';
  } else if (currentVerifyType === 'fitness' && (title.includes('Tempa'))) {
    successMsg = 'Stra\u017Cnik Sta\u0142ego Tempa! 5.02 km w tempie 4:30 \u00B18s/km, kadencja 172. +45 EC.';
  } else if (currentVerifyType === 'fitness' && (title.includes('Nadmorskiej') || title.includes('P\u0119tli'))) {
    successMsg = 'Moc Nadmorskiej P\u0119tli! 195W przez 24 min, 620 kcal spalonych. +65 EC.';
  } else if (currentVerifyType === 'fitness' && (title.includes('Zimny Bodziec') || title.includes('Ba\u0142tycki Reset'))) {
    successMsg = 'Zimny Bodziec \u2014 Ba\u0142tycki Reset! Morsowanie na pla\u017Cy Sopot: 3:12 min w wodzie Ba\u0142tyku, HR cold shock 98\u219254 BPM. +25 EC.';
  } else if (currentVerifyType === 'ai' && (title.includes('Balkon') || title.includes('Taras'))) {
    successMsg = 'AI Vision rozpozna\u0142o barierk\u0119, donice i ro\u015Bliny miododajne: lawenda, macierzanka. Osiedlowy Zapylacz potwierdzony! +35 EC.';
  } else if (currentVerifyType === 'ai' && (title.includes('Ogr\u00F3d') || title.includes('Stra\u017Cnik'))) {
    successMsg = 'AI Vision potwierdzi\u0142o naturaln\u0105 gleb\u0119, stref\u0119 dzikiej trawy i schronienie dla je\u017Cy. Stra\u017Cnik Ekosystemu! +60 EC.';
  } else if (title.includes('Zr\u00F3wnowa\u017Cona') || title.includes('Zasada Talerza')) {
    successMsg = 'Zr\u00F3wnowa\u017Cona Dieta zaliczona! AI Vision: \u226554% powierzchni talerza to warzywa i owoce. Zasada Talerza potwierdzona. +20 EC.';
  } else if (currentVerifyType === 'ai') {
    successMsg = 'AI Vision potwierdzi\u0142o wy\u0142\u0105czenie wszystkich urz\u0105dze\u0144 standby. +25 EC.';
  } else if (title.includes('Zielona Proporcja')) {
    successMsg = 'Zielona Proporcja zaliczona! GPS potwierdzi\u0142 Avocado Oliwa, AI Vision zweryfikowa\u0142o \u226550% zieleni na talerzu, OCR odczyta\u0142o pozycj\u0119 wege. +35 EC.';
  } else if (title.includes('Lunchbox')) {
    successMsg = 'Analityczny Lunchbox zaliczony! Posi\u0142ek w Muka/Falla: bia\u0142ko ro\u015Blinne 28g (\u226525g), b\u0142onnik 9g (\u22658g). +40 EC.';
  } else if (title.includes('Balans')) {
    successMsg = 'Sopocki Balans zaliczony! Poranny spacer w pasie nadmorskim + zielony koktajl w Las/Leniwa Babka. +30 EC.';
  } else if (title.includes('Cytrynowy Poranek')) {
    successMsg = 'Cytrynowy Poranek & Rytm Dobowy! AI Vision potwierdzi\u0142o wod\u0119 z cytryn\u0105 w przezroczystej szklance w oknie 6:00\u20138:30. +20 EC.';
  } else if (title.includes('Nawadnianie')) {
    successMsg = 'Regularne Nawadnianie zaliczone! 2450/2500 ml dziennie, pierwsza porcja 250 ml o 7:34. +15 EC.';
  } else if (title.includes('Krok') || title.includes('10 Tysi\u0119cy')) {
    successMsg = 'Codzienny Ruch zaliczony! 10 342 kroki, 7.2 km, 78 min aktywny. Cel 10 000 osi\u0105gni\u0119ty. +20 EC.';
  } else if (title.includes('Higiena')) {
    successMsg = 'Higiena Cyfrowa i Redukcja Stresu! 12 min medytacji (Headspace), HR 72\u219262 BPM, HRV +18 ms. +15 EC.';
  } else if (title.includes('Sen') || title.includes('Regeneracyjny')) {
    successMsg = 'Sen Regeneracyjny potwierdzony! 7h 52min snu, 62 min bez ekranu przed snem, pobudka 6:32 (\u00B112 min). +25 EC.';
  } else if (title.includes('Profilaktyka')) {
    successMsg = 'Badania Profilaktyka 40 Plus zweryfikowane przez OCR. Dokument/potwierdzenie autentyczne, dane wra\u017Cliwe zamaskowane. +100 EC (bonus jednorazowy).';
  } else if (title.includes('Azyl') || title.includes('K\u0105piel Le\u015Bna')) {
    successMsg = 'Samotny Azyl \u2014 K\u0105piel Le\u015Bna zaliczona! GPS TPK Dolina Rado\u015Bci (2.1 km od drogi), 22 min bezruchu, HR 78\u219262 BPM (-16), ekran zablokowany 20:18 min. +25 EC.';
  } else if (title.includes('Echo') || title.includes('Zielona Sztafeta')) {
    successMsg = 'Le\u015Bne Echo \u2014 Zielona Sztafeta! Check-in przy G\u0142azie Esperantyst\u00F3w, Tw\u00F3j cyfrowy \u015Blad trafi\u0142 do feedu spo\u0142eczno\u015Bci TPK. +30 EC.';
  } else if (title.includes('Zielona Stacja') || title.includes('Samotny W\u0119drowiec')) {
    successMsg = 'Dotar\u0142e\u015B do Zielonej Stacji jako samotny w\u0119drowiec! Tw\u00F3j cyfrowy \u015Blad pozostaje w TPK. +40 EC.';
  } else {
    successMsg = 'Aktywno\u015B\u0107 trafi\u0142a do weryfikacji przez ' + verifyLabel + '. Punkty zostan\u0105 dodane po potwierdzeniu przez moderatora.';
  }
  // Handle special effects
  if (currentEffect === 'multiplier') {
    const expiry = Date.now() + 24 * 60 * 60 * 1000;
    storeSave('ecoMultiplier', { active: true, expires: expiry });
    successMsg = 'Aktywno\u015B\u0107 potwierdzona! Mno\u017Cnik x1.2 aktywny przez 24h.';
  } else if (currentEffect === 'coffee') {
    const coffees = storeLoad('coffeePoints', 0);
    storeSave('coffeePoints', (typeof coffees === 'number' ? coffees : 0) + 1);
    successMsg = 'Aktywno\u015B\u0107 potwierdzona! +1 punkt lojalno\u015Bciowy do kawiarni.';
  }
  // Award badge if any
  if (currentBadge) {
    const badges = storeLoad('userBadges', []);
    if (!badges.includes(currentBadge)) {
      badges.push(currentBadge);
      storeSave('userBadges', badges);
      successMsg += ' Odznaka "' + currentBadge + '" zdobyta!';
    }
  }
  document.querySelector('#modal-success .success-sub').textContent = successMsg;
  // Award EC and track count
  const isProfilaktyka = title.includes('Profilaktyka');
  if (!isProfilaktyka) {
    declareCount++;
    saveDeclareCount();
  }
  let award = currentDeclPt;
  const multi = storeLoad('ecoMultiplier', { active: false, expires: 0 });
  if (multi.active && Date.now() < multi.expires) {
    award = Math.round(award * 1.2);
  }
  earnBalance(award);
  const name = document.querySelector('#modal-form .modal-title').textContent;
  addToTxHistory('\uD83C\uDF31', name, award, userBalance, 'earned');
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
  { title: 'Twoje dane s\u0105 bezpieczne', desc: 'Przetwarzamy tylko kroki i eko-aktywności. \u017Cadnych danych medycznych. Zawsze mo\u017Cesz zarz\u0105dza\u0107 zgodami w ustawieniach.' },
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
// ─── EKO-AKTYWNOŚCI ───
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
  document.getElementById('act-photo-area').innerHTML = '<div class="photo-placeholder">\uD83D\uDCF7</div><div class="photo-label">Dodaj zdj\u0119cie biletu lub paragonu</div><div class="photo-sub">Bilet wst\u0119pu, karnet, paragon \u2014 potwierd\u017A aktywno\u015B\u0107 zdrowotn\u0105</div>';
  document.getElementById('act-photo-area').classList.remove('has-photo');
  const btn = document.getElementById('act-log-btn');
  btn.textContent = '\u2705 Dodano!';
  setTimeout(() => { btn.textContent = '\u2795 Dodaj do dzisiejszych aktywno\u015Bci'; }, 1500);
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
        <div class="act-hi-name">${a.name} ${a.hasPhoto ? '\uD83D\uDCF8' : ''}</div>
        <div class="act-hi-time">${a.time} \u00B7 ${a.duration} min</div>
      </div>
      <div class="act-hi-steps">${a.steps.toLocaleString()} <span class="act-hi-ec">+${a.ec} EC</span></div>
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
    const verifyType = this.dataset.verify || 'photo';
    const effect = this.dataset.effect || '';
    const badge = this.dataset.badge || '';
    openModal(emoji, name, pts, verifyType, effect, badge);
  });
});
