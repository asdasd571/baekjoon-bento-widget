// api/index.js (최종 수정본: 반응형 폰트 사이즈 적용 및 레이아웃 방어)

async function getBase64Image(url) {
  if (!url) return null;
  try {
    const res = await fetch(url);
    const buffer = await res.arrayBuffer();
    const base64 = Buffer.from(buffer).toString('base64');
    const mimeType = res.headers.get('content-type') || 'image/png';
    return `data:${mimeType};base64,${base64}`;
  } catch (e) {
    return null;
  }
}

function getTierInfo(tierLevel) {
  if (tierLevel === 0)
    return { name: 'Unrated', color: '#ffffff', glow: '#ffffff' };
  if (tierLevel >= 31)
    return { name: 'Master', color: '#B300E0', glow: '#ff80ff' };

  const tiers = ['Bronze', 'Silver', 'Gold', 'Platinum', 'Diamond', 'Ruby'];
  const colors = [
    '#e07a5f',
    '#8d99ae',
    '#f4a261',
    '#2a9d8f',
    '#48cae4',
    '#ff006e',
  ];
  const glows = [
    '#ffb4a2',
    '#cbd5e0',
    '#ffe0b2',
    '#b2fef7',
    '#caf0f8',
    '#ffccd5',
  ];

  const index = Math.floor((tierLevel - 1) / 5);
  const level = 5 - ((tierLevel - 1) % 5);

  return {
    name: `${tiers[index]} ${level}`,
    color: colors[index],
    glow: glows[index],
  };
}

const RATING_THRESHOLDS = [
  0,
  30,
  60,
  90,
  120,
  150, // Bronze
  200,
  300,
  400,
  500,
  650, // Silver
  800,
  950,
  1100,
  1250,
  1400, // Gold
  1600,
  1750,
  1900,
  2050,
  2200, // Platinum
  2400,
  2600,
  2800,
  3000,
  3200, // Diamond
  3400,
  3600,
  3800,
  4000,
  4200, // Ruby
  4500, // Master
];

export default async function handler(req, res) {
  const { name, theme = 'midnight-neon', lang } = req.query;

  if (!name) return res.status(400).send('백준 아이디를 입력해주세요!');

  // --- (테마 팔레트 정의 생략, 기존과 동일) ---
  const palettes = {
    'midnight-neon': {
      start: '#0b1429',
      mid: '#1c1c36',
      end: '#2f1c3f',
      glass: 'rgba(255, 255, 255, 0.15)',
      line: 'rgba(255,255,255,0.4)',
      highlight: '#61dafb',
    },
    midnight: {
      start: '#1e1e2e',
      end: '#11111b',
      glass: 'rgba(255, 255, 255, 0.05)',
      line: 'rgba(255,255,255,0.1)',
      highlight: '#89b4fa',
    },
    ocean: {
      start: '#2b5876',
      end: '#4e4376',
      glass: 'rgba(255, 255, 255, 0.1)',
      line: 'rgba(255,255,255,0.2)',
      highlight: '#48cae4',
    },
    dark: {
      start: '#000000',
      end: '#242424',
      glass: 'rgba(255, 255, 255, 0.05)',
      line: 'rgba(255,255,255,0.1)',
      highlight: '#ffffff',
    },
  };
  const currentTheme = palettes[theme] || palettes['midnight-neon'];

  try {
    const [userRes, statsRes, langRes] = await Promise.all([
      fetch(`https://solved.ac/api/v3/user/show?handle=${name}`),
      fetch(`https://solved.ac/api/v3/user/problem_stats?handle=${name}`),
      fetch(`https://solved.ac/api/v3/user/language_stats?handle=${name}`),
    ]);

    if (!userRes.ok) return res.status(404).send('유저를 찾을 수 없습니다.');

    const userData = await userRes.json();
    const statsData = await statsRes.json();

    // 1. 주언어 처리
    let displayLang = lang;
    if (!displayLang) {
      if (langRes.ok) {
        const langData = await langRes.json();
        if (langData && langData.length > 0) {
          langData.sort((a, b) => b.solved - a.solved);
          displayLang = langData[0].language;
        } else displayLang = 'Unknown';
      } else displayLang = 'Unknown';
    }
    displayLang = displayLang.charAt(0).toUpperCase() + displayLang.slice(1);

    // 2. 진행도 (Progress) 계산
    const tierLevel = userData.tier || 0;
    const currentRating = userData.rating || 0;
    let progressPercent = 0;

    if (tierLevel > 0 && tierLevel < 31) {
      const currentThresh = RATING_THRESHOLDS[tierLevel];
      const nextThresh = RATING_THRESHOLDS[tierLevel + 1];
      if (currentRating >= currentThresh && nextThresh > currentThresh) {
        progressPercent =
          ((currentRating - currentThresh) / (nextThresh - currentThresh)) *
          100;
        progressPercent = Math.min(Math.max(progressPercent, 0), 100);
      }
    } else if (tierLevel >= 31) {
      progressPercent = 100;
    }

    const tierInfo = getTierInfo(tierLevel);
    const profileUrl =
      userData.profileImageUrl ||
      'https://static.solved.ac/misc/360x360/default_profile.png';
    const base64ProfileImg = await getBase64Image(profileUrl);

    // --- ★ 방어 로직 (이름 및 폰트 사이즈 동적 계산) ★ ---
    // 닉네임이 13자를 넘어가면 말줄임표 처리, 10자를 넘어가면 폰트 크기를 줄임
    const displayName = name.length > 13 ? name.substring(0, 12) + '...' : name;
    const nameFontSize = displayName.length > 10 ? 17 : 22;

    // 티어 이름이 길면(Platinum 1, Diamond 5 등) 원 안에 들어가도록 폰트 크기를 줄임
    const tierFontSize = tierInfo.name.length > 7 ? 13 : 18;
    // --------------------------------------------------------

    // 레이더 차트 연산
    const levelCounts = [0, 0, 0, 0, 0, 0];
    statsData.forEach((stat) => {
      const idx = Math.floor((stat.level - 1) / 5);
      if (idx >= 0 && idx < 6) levelCounts[idx] += stat.solved;
    });

    const maxCount = Math.max(...levelCounts) || 1;
    const radius = 55;
    const cx = 300,
      cy = 100;
    const angles = [
      -Math.PI / 2,
      -Math.PI / 6,
      Math.PI / 6,
      Math.PI / 2,
      (5 * Math.PI) / 6,
      (7 * Math.PI) / 6,
    ];

    let dataPoints = '';
    levelCounts.forEach((count, i) => {
      const r = (count / maxCount) * radius;
      dataPoints += `${cx + r * Math.cos(angles[i])},${cy + r * Math.sin(angles[i])} `;
    });

    let gridPolygons = '';
    [1, 0.66, 0.33].forEach((scale) => {
      let pts = '';
      angles.forEach((angle) => {
        pts += `${cx + radius * scale * Math.cos(angle)},${cy + radius * scale * Math.sin(angle)} `;
      });
      gridPolygons += `<polygon points="${pts}" fill="none" stroke="${currentTheme.line}" stroke-width="1"/>`;
    });

    const labels = ['B', 'S', 'G', 'P', 'D', 'R'];
    const labelColors = [
      '#e07a5f',
      '#8d99ae',
      '#f4a261',
      '#2a9d8f',
      '#48cae4',
      '#ff006e',
    ];
    let textLabels = '';
    angles.forEach((angle, i) => {
      const x = cx + (radius + 18) * Math.cos(angle);
      const y = cy + (radius + 18) * Math.sin(angle) + 5;
      textLabels += `<text x="${x}" y="${y}" fill="${labelColors[i]}" font-size="13" font-weight="bold" font-family="Inter" text-anchor="middle">${labels[i]}</text>`;
    });

    const langBadgeWidth = displayLang.length * 8 + 30;

    const circRadius = 42;
    const circumference = 2 * Math.PI * circRadius;
    const strokeDashoffset =
      circumference - (progressPercent / 100) * circumference;

    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 's-maxage=3600, stale-while-revalidate');

    const svg = `
      <svg width="600" height="200" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="bg-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="${currentTheme.start}" />
            ${currentTheme.mid ? `<stop offset="50%" stop-color="${currentTheme.mid}" />` : ''}
            <stop offset="100%" stop-color="${currentTheme.end}" />
          </linearGradient>
          
          <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="12" stdDeviation="15" flood-color="#000000" flood-opacity="0.3"/>
          </filter>

          <filter id="neon-glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
          
          <clipPath id="profile-clip">
            <circle cx="55" cy="50" r="22" />
          </clipPath>
        </defs>

        <rect width="100%" height="100%" fill="url(#bg-gradient)" rx="20" />
        <rect x="20" y="20" width="560" height="160" rx="15" fill="${currentTheme.glass}" stroke="${currentTheme.line}" stroke-width="1.5" filter="url(#drop-shadow)" />

        <style>
          /* 폰트 사이즈를 동적 변수(${nameFontSize}, ${tierFontSize})로 적용! */
          .title { font: 800 ${nameFontSize}px 'Inter', -apple-system, sans-serif; fill: #ffffff; letter-spacing: 0.5px; }
          .lang-badge-text { font: 700 12px 'Inter', -apple-system, sans-serif; fill: #ffffff; letter-spacing: 0.5px; }
          .label { font: 600 12px 'Inter', -apple-system, sans-serif; fill: rgba(255, 255, 255, 0.6); text-transform: uppercase; letter-spacing: 1px; }
          .value { font: 800 20px 'Inter', -apple-system, sans-serif; fill: #ffffff; }
          .tier-text { font: 800 ${tierFontSize}px 'Inter', -apple-system, sans-serif; fill: #ffffff; filter: drop-shadow(0px 0px 4px ${tierInfo.glow}); }
          .progress-text { font: 600 11px 'Inter', -apple-system, sans-serif; fill: rgba(255, 255, 255, 0.7); }
        </style>

        <image x="33" y="28" width="44" height="44" href="${base64ProfileImg}" clip-path="url(#profile-clip)" preserveAspectRatio="xMidYMid slice" />
        <text x="90" y="${nameFontSize === 22 ? 52 : 49}" class="title">${displayName}</text>
        
        <g transform="translate(90, 62)">
          <rect x="0" y="0" width="${langBadgeWidth}" height="22" rx="11" fill="rgba(0, 0, 0, 0.3)" stroke="${currentTheme.line}" stroke-width="1" />
          <circle cx="12" cy="11" r="4" fill="${currentTheme.highlight}" filter="url(#neon-glow)" />
          <text x="24" y="15.5" class="lang-badge-text">${displayLang}</text>
        </g>
        
        <line x1="40" y1="95" x2="190" y2="95" stroke="${currentTheme.line}" stroke-width="1" stroke-linecap="round" stroke-dasharray="4 4"/>

        <text x="40" y="123" class="label">Solved</text>
        <text x="40" y="145" class="value">${userData.solvedCount.toLocaleString()}</text>
        <text x="120" y="123" class="label">Rank</text>
        <text x="120" y="145" class="value">#${userData.rank.toLocaleString()}</text>

        <g transform="translate(-10, 0)">
          ${gridPolygons}
          ${angles.map((angle) => `<line x1="${cx}" y1="${cy}" x2="${cx + radius * Math.cos(angle)}" y2="${cy + radius * Math.sin(angle)}" stroke="${currentTheme.line}" stroke-width="1"/>`).join('')}
          <polygon points="${dataPoints}" fill="${currentTheme.highlight}33" stroke="${currentTheme.highlight}" stroke-width="2" stroke-linejoin="round"/>
          ${textLabels}
        </g>

        <g transform="translate(480, 100)">
          <circle cx="0" cy="0" r="${circRadius}" fill="none" stroke="rgba(255,255,255,0.05)" stroke-width="6"/>
          
          <circle cx="0" cy="0" r="${circRadius}" fill="none" stroke="${tierInfo.color}" stroke-width="6" 
                  stroke-linecap="round"
                  stroke-dasharray="${circumference}" 
                  stroke-dashoffset="${strokeDashoffset}" 
                  filter="url(#neon-glow)"
                  transform="rotate(-90)" />

          <circle cx="0" cy="0" r="32" fill="rgba(0,0,0,0.2)" stroke="${currentTheme.line}" stroke-width="1"/>
          
          <text x="0" y="${tierFontSize === 18 ? -2 : -4}" class="tier-text" text-anchor="middle">${tierInfo.name}</text>
          <text x="0" y="16" class="progress-text" text-anchor="middle">${progressPercent.toFixed(1)}%</text>
        </g>
      </svg>
    `;

    res.status(200).send(svg);
  } catch (error) {
    console.error(error);
    res.status(500).send('서버 에러!');
  }
}
