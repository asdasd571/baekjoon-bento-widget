// ... 위쪽 로직은 그대로 유지 ...

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
          
          <clipPath id="profile-clip">
            <circle cx="55" cy="50" r="20" />
          </clipPath>
        </defs>

        <rect width="100%" height="100%" fill="url(#bg-gradient)" rx="20" />
        
        <style>
          .title { font: 700 22px 'Inter', -apple-system, sans-serif; fill: #ffffff; letter-spacing: 0.5px; }
          .label { font: 500 13px 'Inter', -apple-system, sans-serif; fill: rgba(255, 255, 255, 0.7); text-transform: uppercase; letter-spacing: 1px; }
          .value { font: 700 20px 'Inter', -apple-system, sans-serif; fill: ${currentTheme.highlight}; }
          .tier-text { font: 800 22px 'Inter', -apple-system, sans-serif; fill: ${tierInfo.color}; text-shadow: 0px 2px 8px rgba(0,0,0,0.5); }
          
          /* ✨ 대망의 애니메이션 CSS ✨ */
          @keyframes float {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-4px); }
            100% { transform: translateY(0px); }
          }
          @keyframes pulseGlow {
            0% { filter: drop-shadow(0 0 2px ${currentTheme.highlight}); }
            50% { filter: drop-shadow(0 0 12px ${currentTheme.highlight}); }
            100% { filter: drop-shadow(0 0 2px ${currentTheme.highlight}); }
          }
          
          .floating-group {
            animation: float 5s ease-in-out infinite;
          }
          .glowing-polygon {
            animation: pulseGlow 3s ease-in-out infinite;
          }
        </style>

        <g class="floating-group">
          <rect x="20" y="20" width="560" height="160" rx="15" 
                fill="${currentTheme.glass}" 
                stroke="${currentTheme.line}" 
                stroke-width="1.5"
                filter="url(#drop-shadow)" />

          <image x="35" y="30" width="40" height="40" href="${base64ProfileImg}" clip-path="url(#profile-clip)" preserveAspectRatio="xMidYMid slice" />
          <text x="85" y="57" class="title">${name}</text>
          
          <line x1="40" y1="80" x2="200" y2="80" stroke="${currentTheme.line}" stroke-width="1.5" stroke-linecap="round" />

          <text x="40" y="115" class="label">Solved</text>
          <text x="40" y="145" class="value">${userData.solvedCount.toLocaleString()}</text>

          <text x="130" y="115" class="label">Rank</text>
          <text x="130" y="145" class="value">#${userData.rank.toLocaleString()}</text>

          ${gridPolygons}
          ${angles.map((angle) => `<line x1="${cx}" y1="${cy}" x2="${cx + radius * Math.cos(angle)}" y2="${cy + radius * Math.sin(angle)}" stroke="${currentTheme.line}" stroke-width="1"/>`).join('')}
          
          <polygon points="${dataPoints}" class="glowing-polygon" fill="rgba(97, 218, 251, 0.4)" stroke="${currentTheme.highlight}" stroke-width="2" stroke-linejoin="round"/>
          
          ${textLabels}

          <g transform="translate(480, 100)">
            <circle cx="0" cy="0" r="50" fill="rgba(255, 255, 255, 0.05)" stroke="${tierInfo.color}" stroke-width="2" stroke-dasharray="8 4"/>
            <text x="0" y="8" class="tier-text" text-anchor="middle">${tierInfo.name}</text>
          </g>
        </g>
      </svg>
    `;

res.status(200).send(svg);
