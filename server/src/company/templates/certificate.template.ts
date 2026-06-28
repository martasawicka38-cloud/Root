interface CertificateData {
  user: {
    id: string;
    name: string;
    email: string;
    balance: number;
    totalExp: number;
  };
  company: { id: string; name: string };
  type: "participation" | "achievement" | "completion";
  title: string;
  description?: string;
  issuedAt: string;
  stats?: {
    totalActivities: number;
    totalSteps: number;
    totalDeclarations: number;
    ecoActivities: number;
    achievements: string[];
  };
}

const typeConfig = {
  participation: {
    label: "Uczestnictwo",
    color: "#16a34a",
    lightColor: "#dcfce7",
    borderColor: "#86efac",
    subtitle: "Certyfikat uczestnictwa w programie wellbeingu",
  },
  achievement: {
    label: "Osiągnięcie",
    color: "#0ea5e9",
    lightColor: "#e0f2fe",
    borderColor: "#7dd3fc",
    subtitle: "Certyfikat za wybitne osiągnięcie",
  },
  completion: {
    label: "Ukończenie",
    color: "#8b5cf6",
    lightColor: "#ede9fe",
    borderColor: "#c4b5fd",
    subtitle: "Certyfikat ukończenia programu",
  },
};

function formatDate(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("pl-PL", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

function svgMedal(color: string): string {
  return `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="28" cy="32" r="20" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2"/>
    <path d="M28 12L30.5 22H25.5L28 12Z" fill="${color}"/>
    <path d="M20 8L24 20" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    <path d="M36 8L32 20" stroke="${color}" stroke-width="1.5" stroke-linecap="round"/>
    <circle cx="28" cy="32" r="12" fill="${color}" fill-opacity="0.1"/>
    <text x="28" y="37" text-anchor="middle" fill="${color}" font-size="16" font-weight="bold" font-family="Inter, sans-serif">★</text>
  </svg>`;
}

function svgTrophy(color: string): string {
  return `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M18 10H38V24C38 32.8366 30.8366 40 22 40H34C25.1634 40 18 32.8366 18 24V10Z" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2"/>
    <path d="M18 16H12C10.8954 16 10 16.8954 10 18V22C10 26.4183 13.5817 30 18 30" stroke="${color}" stroke-width="2" fill="none"/>
    <path d="M38 16H44C45.1046 16 46 16.8954 46 18V22C46 26.4183 42.4183 30 38 30" stroke="${color}" stroke-width="2" fill="none"/>
    <rect x="22" y="40" width="12" height="4" rx="1" fill="${color}" fill-opacity="0.3"/>
    <rect x="18" y="44" width="20" height="4" rx="2" fill="${color}" fill-opacity="0.2"/>
  </svg>`;
}

function svgGraduation(color: string): string {
  return `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 12L6 24L28 36L50 24L28 12Z" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2" stroke-linejoin="round"/>
    <path d="M14 30V40C14 40 20 46 28 46C36 46 42 40 42 40V30" stroke="${color}" stroke-width="2" fill="none"/>
    <path d="M50 24V40" stroke="${color}" stroke-width="2" stroke-linecap="round"/>
    <circle cx="50" cy="42" r="2" fill="${color}"/>
  </svg>`;
}

function svgLeaf(color: string): string {
  return `<svg width="56" height="56" viewBox="0 0 56 56" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M28 48C28 48 10 36 10 22C10 14 16 8 24 8C32 8 38 14 38 22C38 30 32 36 28 36" fill="${color}" fill-opacity="0.15" stroke="${color}" stroke-width="2"/>
    <path d="M28 48V22" stroke="${color}" stroke-width="2"/>
    <path d="M28 30C22 26 18 22 18 18" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
    <path d="M28 26C34 22 36 18 36 14" stroke="${color}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
  </svg>`;
}

function svgSteps(color: string): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 2C10 2 6 6 6 10C6 14 10 18 10 18C10 18 14 14 14 10C14 6 10 2 10 2Z" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
    <circle cx="10" cy="10" r="2" fill="${color}"/>
  </svg>`;
}

function svgActivity(color: string): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M2 10H5L8 4L12 16L15 10H18" stroke="${color}" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>`;
}

function svgEco(color: string): string {
  return `<svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 18C10 18 3 13 3 8C3 5 5 3 8 3C11 3 13 5 13 8C13 11 11 13 10 13" fill="${color}" fill-opacity="0.2" stroke="${color}" stroke-width="1.5"/>
    <path d="M10 18V8" stroke="${color}" stroke-width="1.5"/>
  </svg>`;
}

function svgStar(color: string): string {
  return `<svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 1L10 6H15L11 9L12.5 14L8 11L3.5 14L5 9L1 6H6L8 1Z" fill="${color}"/>
  </svg>`;
}

function getCertIcon(type: string, color: string): string {
  switch (type) {
    case "participation": return svgMedal(color);
    case "achievement": return svgTrophy(color);
    case "completion": return svgGraduation(color);
    default: return svgMedal(color);
  }
}

function getSealIcon(type: string, color: string): string {
  switch (type) {
    case "participation": return svgLeaf(color);
    case "achievement": return svgTrophy(color);
    case "completion": return svgGraduation(color);
    default: return svgLeaf(color);
  }
}

export function generateCertificateHTML(data: CertificateData): string {
  const cfg = typeConfig[data.type];
  const issuedLabel = formatDate(data.issuedAt);
  const certIcon = getCertIcon(data.type, cfg.color);
  const sealIcon = getSealIcon(data.type, cfg.color);

  const statsHtml = data.stats ? `
    <div class="cert-stats">
      <div class="cert-stat">
        <div class="cert-stat-icon">${svgSteps(cfg.color)}</div>
        <div class="cert-stat-value">${data.stats.totalSteps.toLocaleString("pl-PL")}</div>
        <div class="cert-stat-label">Kroków</div>
      </div>
      <div class="cert-stat">
        <div class="cert-stat-icon">${svgActivity(cfg.color)}</div>
        <div class="cert-stat-value">${data.stats.totalActivities}</div>
        <div class="cert-stat-label">Aktywności</div>
      </div>
      <div class="cert-stat">
        <div class="cert-stat-icon">${svgEco(cfg.color)}</div>
        <div class="cert-stat-value">${data.stats.ecoActivities}</div>
        <div class="cert-stat-label">Eko-działań</div>
      </div>
      <div class="cert-stat">
        <div class="cert-stat-icon">${svgStar(cfg.color)}</div>
        <div class="cert-stat-value">${data.user.balance}</div>
        <div class="cert-stat-label">Punktów</div>
      </div>
    </div>
  ` : "";

  const achievementsHtml = data.stats?.achievements?.length ? `
    <div class="cert-achievements">
      <div class="cert-achievements-title">Osiągnięcia</div>
      <div class="cert-achievements-list">
        ${data.stats.achievements.map((a) => `<span class="cert-achievement-badge">${svgStar(cfg.color)} ${a}</span>`).join("")}
      </div>
    </div>
  ` : "";

  return `<!DOCTYPE html>
<html lang="pl">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Certyfikat \u2013 ${data.user.name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800&family=Inter:wght@300;400;500;600&display=swap');

  * { margin: 0; padding: 0; box-sizing: border-box; }

  body {
    font-family: 'Inter', sans-serif;
    background: #f1f5f9;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
    -webkit-print-color-adjust: exact;
    print-color-adjust: exact;
  }

  .certificate {
    width: 900px;
    min-height: 640px;
    background: #fff;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    box-shadow: 0 25px 50px rgba(0,0,0,0.15);
  }

  .certificate::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 8px;
    background: linear-gradient(90deg, ${cfg.color}, ${cfg.color}88, ${cfg.color});
  }

  .cert-border {
    position: absolute;
    top: 20px;
    left: 20px;
    right: 20px;
    bottom: 20px;
    border: 2px solid ${cfg.borderColor};
    border-radius: 2px;
    pointer-events: none;
  }

  .cert-border-inner {
    position: absolute;
    top: 6px;
    left: 6px;
    right: 6px;
    bottom: 6px;
    border: 1px solid ${cfg.borderColor}44;
    border-radius: 2px;
    pointer-events: none;
  }

  .cert-content {
    padding: 72px 80px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  .cert-icon {
    margin-bottom: 12px;
    display: block;
    line-height: 1;
  }

  .cert-org {
    font-size: 13px;
    text-transform: uppercase;
    letter-spacing: 3px;
    color: #94a3b8;
    font-weight: 600;
    margin-bottom: 6px;
  }

  .cert-company {
    font-size: 16px;
    font-weight: 600;
    color: #475569;
    margin-bottom: 32px;
  }

  .cert-label {
    display: inline-block;
    background: ${cfg.lightColor};
    color: ${cfg.color};
    border: 1px solid ${cfg.borderColor};
    border-radius: 999px;
    padding: 6px 24px;
    font-size: 12px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 28px;
  }

  .cert-heading {
    font-family: 'Playfair Display', serif;
    font-size: 14px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 4px;
    margin-bottom: 16px;
  }

  .cert-title {
    font-family: 'Playfair Display', serif;
    font-size: 36px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.2;
    margin-bottom: 28px;
  }

  .cert-recipient-label {
    font-size: 12px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 8px;
  }

  .cert-recipient {
    font-family: 'Playfair Display', serif;
    font-size: 28px;
    font-weight: 700;
    color: ${cfg.color};
    margin-bottom: 24px;
    padding-bottom: 16px;
    border-bottom: 2px solid ${cfg.borderColor};
    display: inline-block;
  }

  .cert-description {
    font-size: 15px;
    color: #64748b;
    max-width: 560px;
    margin: 0 auto 24px;
    line-height: 1.7;
  }

  .cert-stats {
    display: flex;
    justify-content: center;
    gap: 32px;
    margin-bottom: 24px;
    padding: 20px;
    background: ${cfg.lightColor}40;
    border-radius: 12px;
    border: 1px solid ${cfg.borderColor}60;
  }

  .cert-stat {
    text-align: center;
  }

  .cert-stat-icon {
    margin-bottom: 4px;
  }

  .cert-stat-value {
    font-size: 20px;
    font-weight: 700;
    color: ${cfg.color};
    line-height: 1.2;
  }

  .cert-stat-label {
    font-size: 11px;
    color: #64748b;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .cert-achievements {
    margin-bottom: 24px;
  }

  .cert-achievements-title {
    font-size: 12px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 8px;
  }

  .cert-achievements-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 8px;
  }

  .cert-achievement-badge {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    background: ${cfg.lightColor};
    color: ${cfg.color};
    border: 1px solid ${cfg.borderColor};
    border-radius: 6px;
    padding: 4px 12px;
    font-size: 12px;
    font-weight: 600;
  }

  .cert-footer {
    display: flex;
    justify-content: space-between;
    align-items: flex-end;
    margin-top: 32px;
    padding-top: 24px;
    border-top: 1px solid #e2e8f0;
  }

  .cert-footer-item {
    text-align: center;
  }

  .cert-footer-label {
    font-size: 10px;
    color: #94a3b8;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    margin-bottom: 6px;
  }

  .cert-footer-value {
    font-size: 14px;
    font-weight: 600;
    color: #334155;
  }

  .cert-seal {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background: ${cfg.lightColor};
    border: 3px solid ${cfg.borderColor};
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto;
  }

  .ornament {
    position: absolute;
    width: 80px;
    height: 80px;
    opacity: 0.08;
  }
  .ornament-tl { top: 36px; left: 36px; border-top: 4px solid ${cfg.color}; border-left: 4px solid ${cfg.color}; }
  .ornament-tr { top: 36px; right: 36px; border-top: 4px solid ${cfg.color}; border-right: 4px solid ${cfg.color}; }
  .ornament-bl { bottom: 36px; left: 36px; border-bottom: 4px solid ${cfg.color}; border-left: 4px solid ${cfg.color}; }
  .ornament-br { bottom: 36px; right: 36px; border-bottom: 4px solid ${cfg.color}; border-right: 4px solid ${cfg.color}; }

  @media print {
    body { background: #fff; padding: 0; }
    .certificate { box-shadow: none; }
  }
</style>
</head>
<body>
<div class="certificate">
  <div class="cert-border"><div class="cert-border-inner"></div></div>
  <div class="ornament ornament-tl"></div>
  <div class="ornament ornament-tr"></div>
  <div class="ornament ornament-bl"></div>
  <div class="ornament ornament-br"></div>

  <div class="cert-content">
    <div class="cert-icon">${certIcon}</div>
    <div class="cert-org">Eco-Pulse Platform</div>
    <div class="cert-company">${data.company.name}</div>

    <div class="cert-label">${cfg.label}</div>
    <div class="cert-heading">Certyfikat</div>
    <div class="cert-title">${data.title}</div>

    <div class="cert-recipient-label">Niniejszym potwierdza się, że</div>
    <div class="cert-recipient">${data.user.name}</div>

    ${data.description ? `<div class="cert-description">${data.description}</div>` : `<div class="cert-description">${cfg.subtitle}</div>`}

    ${statsHtml}
    ${achievementsHtml}

    <div class="cert-footer">
      <div class="cert-footer-item">
        <div class="cert-footer-label">Data wystawienia</div>
        <div class="cert-footer-value">${issuedLabel}</div>
      </div>
      <div class="cert-footer-item">
        <div class="cert-seal">${sealIcon}</div>
      </div>
      <div class="cert-footer-item">
        <div class="cert-footer-label">Identyfikator</div>
        <div class="cert-footer-value">${data.user.id.slice(0, 8).toUpperCase()}</div>
      </div>
    </div>
  </div>
</div>
</body>
</html>`;
}
