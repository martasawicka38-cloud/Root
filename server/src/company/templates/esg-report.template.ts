interface ESGReportData {
  company: { id: string; name: string; slug: string };
  period: { from: string; to: string };
  employees: { total: number; active: number };
  activities: {
    total: number;
    totalSteps: number;
    totalMinutes: number;
    breakdown: Record<string, number>;
  };
  declarations: {
    total: number;
    items: { name: string; points: number; userName: string }[];
  };
  ecoActivities: {
    total: number;
    breakdown: Record<string, number>;
    totalPoints: number;
  };
  transactions: {
    totalEarned: number;
    totalSpent: number;
    netBalance: number;
  };
  generatedAt: string;
}

const activityLabels: Record<string, string> = {
  walking: "Chodzenie",
  running: "Bieganie",
  cycling: "Jazda na rowerze",
  swimming: "Pływanie",
  yoga: "Joga",
  gym: "Siłownia",
};

const ecoCategoryLabels: Record<string, string> = {
  MOBILITY: "Mobilność",
  CIRCULARITY: "Gospodarka obiegu zamkniętego",
  LOCAL_CONSUMPTION: "Konsumpcja lokalna",
  NATURE_ACTIVITY: "Aktywności na łonie natury",
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pl-PL", { year: "numeric", month: "long", day: "numeric" });
}

function svgClipboard(color: string): string {
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M16 4H18C19.1046 4 20 4.89543 20 6V20C20 21.1046 19.1046 22 18 22H6C4.89543 22 4 21.1046 4 20V6C4 4.89543 4.89543 4 6 4H8" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <rect x="8" y="2" width="8" height="4" rx="1" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
    <line x1="8" y1="12" x2="16" y2="12" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    <line x1="8" y1="16" x2="12" y2="16" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
  </svg>`;
}

function svgLeaf(color: string): string {
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 22C12 22 4 16 4 10C4 6 7 3 11 3C15 3 18 6 18 10C18 14 15 17 12 17" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="2"/>
    <path d="M12 22V10" stroke="${color}" stroke-width="2"/>
    <path d="M12 14C9 11 7 9 7 7" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M12 12C15 9 16 7 16 5" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

function svgPeople(color: string): string {
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="9" cy="7" r="3" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
    <path d="M3 20C3 16.6863 5.68629 14 9 14C12.3137 14 15 16.6863 15 20" stroke="${color}" stroke-width="2" fill="none"/>
    <circle cx="17" cy="8" r="2.5" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="1.5"/>
    <path d="M17 13C19.7614 13 22 15.2386 22 18" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

function svgScale(color: string): string {
  return `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12 3V21" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 3L6 9" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 3L18 9" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="6" cy="12" r="3" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
    <circle cx="18" cy="12" r="3" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
    <rect x="8" y="20" width="8" height="2" rx="1" fill="${color}" fill-opacity="0.3"/>
  </svg>`;
}

function buildActivityBreakdownRows(breakdown: Record<string, number>): string {
  return Object.entries(breakdown)
    .map(([type, count]) => `<tr><td>${activityLabels[type] ?? type}</td><td class="num">${count}</td></tr>`)
    .join("\n");
}

function buildEcoBreakdownRows(breakdown: Record<string, number>): string {
  return Object.entries(breakdown)
    .map(([cat, count]) => `<tr><td>${ecoCategoryLabels[cat] ?? cat}</td><td class="num">${count}</td></tr>`)
    .join("\n");
}

export function generateESGReportHTML(data: ESGReportData): string {
  const periodLabel = `${formatDate(data.period.from)} \u2013 ${formatDate(data.period.to)}`;
  const generatedLabel = formatDate(data.generatedAt);
  const activePercent = data.employees.total > 0
    ? Math.round((data.employees.active / data.employees.total) * 100)
    : 0;
  const avgStepsPerEmployee = data.employees.total > 0
    ? Math.round(data.activities.totalSteps / data.employees.total)
    : 0;
  const avgMinutesPerEmployee = data.employees.total > 0
    ? Math.round(data.activities.totalMinutes / data.employees.total)
    : 0;
  const estimatedCO2Kg = Math.round(data.activities.totalSteps * 0.00004 * 100) / 100;

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Raport ESG \u2013 ${data.company.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');

  :root {
    --primary: #16a34a;
    --primary-dark: #15803d;
    --primary-light: #dcfce7;
    --accent: #0ea5e9;
    --accent-light: #e0f2fe;
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-400: #94a3b8;
    --slate-500: #64748b;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;
    --amber: #f59e0b;
    --amber-light: #fef3c7;
    --red: #ef4444;
    --radius: 12px;
    --shadow: 0 1px 3px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.06);
    --shadow-md: 0 4px 6px rgba(0,0,0,0.07), 0 2px 4px rgba(0,0,0,0.06);
    --shadow-lg: 0 10px 15px rgba(0,0,0,0.1), 0 4px 6px rgba(0,0,0,0.05);
  }

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--slate-100);
    color: var(--slate-800);
    line-height: 1.6;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .report {
    max-width: 960px;
    margin: 0 auto;
    background: #fff;
  }

  /* ===== COVER ===== */
  .cover {
    background: linear-gradient(135deg, var(--slate-900) 0%, #1a3a2a 50%, var(--primary-dark) 100%);
    color: #fff;
    padding: 80px 60px;
    position: relative;
    overflow: hidden;
    page-break-after: always;
  }
  .cover::before {
    content: '';
    position: absolute;
    top: -50%;
    right: -20%;
    width: 600px;
    height: 600px;
    border-radius: 50%;
    background: rgba(22, 163, 74, 0.08);
  }
  .cover::after {
    content: '';
    position: absolute;
    bottom: -30%;
    left: -10%;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: rgba(14, 165, 233, 0.06);
  }
  .cover-badge {
    display: inline-block;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 999px;
    padding: 6px 18px;
    font-size: 13px;
    font-weight: 500;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 32px;
    position: relative;
    z-index: 1;
  }
  .cover h1 {
    font-size: 48px;
    font-weight: 800;
    line-height: 1.1;
    margin-bottom: 16px;
    position: relative;
    z-index: 1;
  }
  .cover h1 span { color: var(--primary); }
  .cover .subtitle {
    font-size: 20px;
    font-weight: 300;
    color: rgba(255,255,255,0.8);
    margin-bottom: 48px;
    position: relative;
    z-index: 1;
  }
  .cover-meta {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 24px;
    position: relative;
    z-index: 1;
  }
  .cover-meta-item {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: var(--radius);
    padding: 20px 24px;
  }
  .cover-meta-label {
    font-size: 11px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: rgba(255,255,255,0.5);
    margin-bottom: 6px;
  }
  .cover-meta-value {
    font-size: 18px;
    font-weight: 600;
  }

  /* ===== BODY ===== */
  .body { padding: 48px 60px; }

  .section {
    margin-bottom: 48px;
    page-break-inside: avoid;
  }
  .section-header {
    display: flex;
    align-items: center;
    gap: 14px;
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid var(--slate-200);
  }
  .section-icon {
    width: 44px;
    height: 44px;
    border-radius: 10px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    flex-shrink: 0;
  }
  .section-icon.green { background: var(--primary-light); color: var(--primary-dark); }
  .section-icon.blue  { background: var(--accent-light); color: var(--accent); }
  .section-icon.amber { background: var(--amber-light); color: var(--amber); }
  .section-icon.dark  { background: var(--slate-200); color: var(--slate-700); }

  .section-title {
    font-size: 24px;
    font-weight: 700;
    color: var(--slate-900);
  }
  .section-subtitle {
    font-size: 13px;
    color: var(--slate-500);
    font-weight: 400;
  }

  /* KPI grid */
  .kpi-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 16px;
    margin-bottom: 32px;
  }
  .kpi-card {
    background: var(--slate-50);
    border: 1px solid var(--slate-200);
    border-radius: var(--radius);
    padding: 20px;
    text-align: center;
  }
  .kpi-value {
    font-size: 32px;
    font-weight: 800;
    color: var(--primary-dark);
    line-height: 1.1;
    margin-bottom: 4px;
  }
  .kpi-value.blue { color: var(--accent); }
  .kpi-value.amber { color: var(--amber); }
  .kpi-label {
    font-size: 12px;
    color: var(--slate-500);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 600;
  }

  /* Tables */
  table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 24px;
    font-size: 14px;
  }
  thead th {
    background: var(--slate-800);
    color: #fff;
    padding: 12px 16px;
    text-align: left;
    font-weight: 600;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.8px;
  }
  thead th:first-child { border-radius: 8px 0 0 0; }
  thead th:last-child  { border-radius: 0 8px 0 0; }
  tbody td {
    padding: 12px 16px;
    border-bottom: 1px solid var(--slate-200);
  }
  tbody tr:hover { background: var(--slate-50); }
  tbody tr:last-child td { border-bottom: none; }
  td.num, th.num { text-align: right; }

  /* Progress bar */
  .progress-bar-wrap {
    background: var(--slate-200);
    border-radius: 999px;
    height: 10px;
    overflow: hidden;
    margin-top: 8px;
  }
  .progress-bar {
    height: 100%;
    border-radius: 999px;
    background: linear-gradient(90deg, var(--primary), var(--accent));
    transition: width 0.4s;
  }

  /* Highlights */
  .highlight-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 16px;
    margin-bottom: 24px;
  }
  .highlight-card {
    border-radius: var(--radius);
    padding: 24px;
    text-align: center;
    border: 1px solid;
  }
  .highlight-card.green {
    background: var(--primary-light);
    border-color: #bbf7d0;
  }
  .highlight-card.blue {
    background: var(--accent-light);
    border-color: #bae6fd;
  }
  .highlight-card.amber {
    background: var(--amber-light);
    border-color: #fde68a;
  }
  .highlight-card .hl-value {
    font-size: 36px;
    font-weight: 800;
    line-height: 1;
    margin-bottom: 4px;
  }
  .highlight-card.green .hl-value { color: var(--primary-dark); }
  .highlight-card.blue  .hl-value { color: var(--accent); }
  .highlight-card.amber .hl-value { color: #b45309; }
  .highlight-card .hl-label {
    font-size: 12px;
    color: var(--slate-600);
    text-transform: uppercase;
    letter-spacing: 0.8px;
    font-weight: 600;
  }

  /* Bar chart */
  .bar-chart { margin: 16px 0; }
  .bar-row {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    gap: 12px;
  }
  .bar-label {
    width: 180px;
    font-size: 13px;
    font-weight: 500;
    color: var(--slate-700);
    flex-shrink: 0;
    text-align: right;
  }
  .bar-track {
    flex: 1;
    height: 22px;
    background: var(--slate-100);
    border-radius: 6px;
    overflow: hidden;
  }
  .bar-fill {
    height: 100%;
    border-radius: 6px;
    background: linear-gradient(90deg, var(--primary), #22d3ee);
    display: flex;
    align-items: center;
    justify-content: flex-end;
    padding-right: 8px;
    font-size: 11px;
    font-weight: 700;
    color: #fff;
    min-width: 40px;
  }

  /* Note box */
  .note-box {
    background: var(--slate-50);
    border-left: 4px solid var(--primary);
    border-radius: 0 var(--radius) var(--radius) 0;
    padding: 20px 24px;
    margin: 24px 0;
    font-size: 14px;
    color: var(--slate-600);
  }
  .note-box strong { color: var(--slate-800); }

  /* Footer */
  .footer {
    background: var(--slate-900);
    color: rgba(255,255,255,0.6);
    padding: 32px 60px;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
  }
  .footer a { color: var(--primary); text-decoration: none; }

  /* ESRS badges */
  .esrs-badge {
    display: inline-block;
    background: var(--slate-200);
    color: var(--slate-600);
    border-radius: 6px;
    padding: 3px 10px;
    font-size: 11px;
    font-weight: 600;
    margin-right: 6px;
    letter-spacing: 0.5px;
  }
  .esrs-badge.env { background: #dcfce7; color: #166534; }
  .esrs-badge.soc { background: #dbeafe; color: #1e40af; }
  .esrs-badge.gov { background: #fef3c7; color: #92400e; }

  @media print {
    body { background: #fff; }
    .report { box-shadow: none; }
    .cover { padding: 60px 40px; }
    .body   { padding: 32px 40px; }
    .footer { padding: 24px 40px; }
  }
</style>
</head>
<body>
<div class="report">

  <!-- COVER -->
  <div class="cover">
    <div class="cover-badge">Dyrektywa CSRD &bull; Europejskie Standardy ESRS</div>
    <h1>Raport <span>ESG</span></h1>
    <p class="subtitle">${data.company.name} &mdash; Raportowanie zrównoważonego rozwoju</p>
    <div class="cover-meta">
      <div class="cover-meta-item">
        <div class="cover-meta-label">Okres raportowania</div>
        <div class="cover-meta-value">${periodLabel}</div>
      </div>
      <div class="cover-meta-item">
        <div class="cover-meta-label">Data wygenerowania</div>
        <div class="cover-meta-value">${generatedLabel}</div>
      </div>
      <div class="cover-meta-item">
        <div class="cover-meta-label">Spółka</div>
        <div class="cover-meta-value">${data.company.name}</div>
      </div>
      <div class="cover-meta-item">
        <div class="cover-meta-label">Identyfikator</div>
        <div class="cover-meta-value">${data.company.slug.toUpperCase()}</div>
      </div>
    </div>
  </div>

  <div class="body">

    <!-- 1. INFORMACJE OGÓLNE (ESRS 2) -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon dark">${svgClipboard("#475569")}</div>
        <div>
          <div class="section-title">1. Informacje Ogólne</div>
          <div class="section-subtitle">ESRS 2 &mdash; Podstawy przygotowania, Ład korporacyjny, Strategia</div>
        </div>
      </div>

      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-value">${data.employees.total}</div>
          <div class="kpi-label">Pracownicy łącznie</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value blue">${data.employees.active}</div>
          <div class="kpi-label">Aktywni uczestnicy</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value amber">${activePercent}%</div>
          <div class="kpi-label">Wskaźnik partycypacji</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-value">${data.transactions.netBalance}</div>
          <div class="kpi-label">Bilans punktowy netto</div>
        </div>
      </div>

      <div class="note-box">
        <strong>Podwójna istotność:</strong> Program wellbeingu Eco-Pulse wpływa na zdrowie i zaangażowanie pracowników (wpływ wewnętrzny),
        jednocześnie budując wizerunek firmy odpowiedzialnej społecznie, co przekłada się na pozycję rynkową i zdolność przyciągania talentów (wpływ zewnętrzny).
      </div>
    </div>

    <!-- 2. ŚRODOWISKO (ESRS E) -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon green">${svgLeaf("#15803d")}</div>
        <div>
          <div class="section-title">2. Środowisko</div>
          <div class="section-subtitle">
            <span class="esrs-badge env">ESRS E1</span>
            <span class="esrs-badge env">ESRS E5</span>
            Zmiany klimatu &bull; Gospodarka obiegu zamkniętego
          </div>
        </div>
      </div>

      <div class="highlight-grid">
        <div class="highlight-card green">
          <div class="hl-value">${data.activities.totalSteps.toLocaleString("pl-PL")}</div>
          <div class="hl-label">Łączna liczba kroków</div>
        </div>
        <div class="highlight-card blue">
          <div class="hl-value">${avgStepsPerEmployee.toLocaleString("pl-PL")}</div>
          <div class="hl-label">Śr. kroków / pracownika</div>
        </div>
        <div class="highlight-card amber">
          <div class="hl-value">${estimatedCO2Kg}</div>
          <div class="hl-label">Est. uniknięte kg CO₂</div>
        </div>
      </div>

      <h3 style="font-size:16px;margin-bottom:12px;color:var(--slate-700);">Zmiana nawyków transportowych (ESRS E1)</h3>
      <p style="font-size:14px;color:var(--slate-600);margin-bottom:24px;">
        Program promuje aktywność fizyczną zamiast transportu samochodowego.
        Każde 10 000 kroków to ok. 1,5 kg mniej emisji CO₂ w porównaniu do jazdy samochodem na krótkich dystansach.
        W raportowanym okresie pracownicy wykonali łącznie <strong>${data.activities.totalSteps.toLocaleString("pl-PL")}</strong> kroków,
        co odpowiada szacunkowej redukcji <strong>${estimatedCO2Kg} kg CO₂</strong>.
      </p>

      <table>
        <thead><tr><th>Rodzaj aktywności</th><th class="num">Liczba</th></tr></thead>
        <tbody>${buildActivityBreakdownRows(data.activities.breakdown)}</tbody>
      </table>

      <h3 style="font-size:16px;margin-bottom:12px;color:var(--slate-700);">Gospodarka obiegu zamkniętego (ESRS E5)</h3>
      <p style="font-size:14px;color:var(--slate-600);margin-bottom:16px;">
        Pracownicy zaangażowani w <strong>${data.ecoActivities.total}</strong> aktywności ekologicznych,
        zdobywając łącznie <strong>${data.ecoActivities.totalPoints}</strong> punktów za działania prośrodowiskowe.
      </p>
      ${Object.keys(data.ecoActivities.breakdown).length > 0 ? `
      <table>
        <thead><tr><th>Kategoria ekologiczna</th><th class="num">Liczba działań</th></tr></thead>
        <tbody>${buildEcoBreakdownRows(data.ecoActivities.breakdown)}</tbody>
      </table>` : ""}
    </div>

    <!-- 3. KWESTIE SPOŁECZNE (ESRS S) -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon blue">${svgPeople("#0ea5e9")}</div>
        <div>
          <div class="section-title">3. Kwestie Społeczne</div>
          <div class="section-subtitle">
            <span class="esrs-badge soc">ESRS S1</span>
            <span class="esrs-badge soc">ESRS S4</span>
            Własna siła robocza &bull; Konsumenci i użytkownicy końcowi
          </div>
        </div>
      </div>

      <div class="highlight-grid">
        <div class="highlight-card green">
          <div class="hl-value">${data.activities.total}</div>
          <div class="hl-label">Łączne aktywności</div>
        </div>
        <div class="highlight-card blue">
          <div class="hl-value">${Math.round(data.activities.totalMinutes / 60)}h</div>
          <div class="hl-label">Czas aktywności</div>
        </div>
        <div class="highlight-card amber">
          <div class="hl-value">${data.declarations.total}</div>
          <div class="hl-label">Deklaracje prozdrowotne</div>
        </div>
      </div>

      <h3 style="font-size:16px;margin-bottom:12px;color:var(--slate-700);">Warunki pracy i wellbeing (ESRS S1)</h3>
      <p style="font-size:14px;color:var(--slate-600);margin-bottom:16px;">
        Program Eco-Pulse wspiera zdrowie pracowników poprzez promowanie regularnej aktywności fizycznej.
        Średni czas aktywności na pracownika wynosi <strong>${avgMinutesPerEmployee} minut</strong> w raportowanym okresie.
        ${avgMinutesPerEmployee >= 150 ? "Wartość ta spełnia zalecenia WHO dotyczące minimum 150 minut umiarkowanej aktywności tygodniowo." : ""}
      </p>

      <h3 style="font-size:16px;margin-bottom:12px;color:var(--slate-700);">Deklaracje pracowników</h3>
      ${data.declarations.items.length > 0 ? `
      <table>
        <thead><tr><th>Pracownik</th><th>Deklaracja</th><th class="num">Punkty</th></tr></thead>
        <tbody>
          ${data.declarations.items.slice(0, 20).map((d) => `<tr><td>${d.userName}</td><td>${d.name}</td><td class="num">${d.points}</td></tr>`).join("\n")}
          ${data.declarations.items.length > 20 ? `<tr><td colspan="3" style="text-align:center;color:var(--slate-400);">... i ${data.declarations.items.length - 20} więcej</td></tr>` : ""}
        </tbody>
      </table>` : '<p style="font-size:14px;color:var(--slate-400);">Brak deklaracji w raportowanym okresie.</p>'}
    </div>

    <!-- 4. ZARZĄDZANIE (ESRS G) -->
    <div class="section">
      <div class="section-header">
        <div class="section-icon amber">${svgScale("#b45309")}</div>
        <div>
          <div class="section-title">4. Zarządzanie</div>
          <div class="section-subtitle">
            <span class="esrs-badge gov">ESRS G1</span>
            Prowadzenie działalności gospodarczej
          </div>
        </div>
      </div>

      <div class="note-box">
        <strong>System motywacyjny:</strong> Platforma Eco-Pulse integruje wskaźniki wellbeingu z systemem punktowym,
        co stanowi element ładu korporacyjnego w zakresie ESG. Pracownicy zdobywają punkty za aktywności prozdrowotne
        i prośrodowiskowe, które mogą wymieniać na nagrody. Tworzy to przejrzysty i mierzalzy system motywacji.
      </div>

      <h3 style="font-size:16px;margin-bottom:12px;color:var(--slate-700);">Podsumowanie punktowe</h3>
      <table>
        <thead><tr><th>Wskaźnik</th><th class="num">Wartość</th></tr></thead>
        <tbody>
          <tr><td>Punkty zdobyte (łącznie)</td><td class="num">${data.transactions.totalEarned.toLocaleString("pl-PL")}</td></tr>
          <tr><td>Punkty wydane (nagrody)</td><td class="num">${data.transactions.totalSpent.toLocaleString("pl-PL")}</td></tr>
          <tr><td>Bilans netto w obiegu</td><td class="num"><strong>${data.transactions.netBalance.toLocaleString("pl-PL")}</strong></td></tr>
          <tr><td>Punkty za aktywności ekologiczne</td><td class="num">${data.ecoActivities.totalPoints.toLocaleString("pl-PL")}</td></tr>
        </tbody>
      </table>

      <h3 style="font-size:16px;margin-bottom:12px;color:var(--slate-700);">Mierniki i cele (MT)</h3>
      <div class="bar-chart">
        <div class="bar-row">
          <div class="bar-label">Partycypacja pracowników</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${Math.min(activePercent, 100)}%">${activePercent}%</div>
          </div>
        </div>
        <div class="bar-row">
          <div class="bar-label">Cel kroków / pracownika</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${Math.min(Math.round((avgStepsPerEmployee / 50000) * 100), 100)}%">${avgStepsPerEmployee.toLocaleString("pl-PL")}</div>
          </div>
        </div>
        <div class="bar-row">
          <div class="bar-label">Aktywności ekologiczne</div>
          <div class="bar-track">
            <div class="bar-fill" style="width:${Math.min(Math.round((data.ecoActivities.total / Math.max(data.employees.total, 1)) * 100), 100)}%">${data.ecoActivities.total}</div>
          </div>
        </div>
      </div>
    </div>

  </div>

  <div class="footer">
    <div>Raport wygenerowany automatycznie przez system Eco-Pulse &bull; ${generatedLabel}</div>
    <div>Zgodny z Dyrektywą CSRD &bull; ESRS 2</div>
  </div>

</div>
</body>
</html>`;
}
