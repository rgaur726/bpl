export function BPLLogo({ size = 120 }: { size?: number }) {
  return (
    <div className={`relative`} style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Shield Background with Gradient */}
        <defs>
          <linearGradient id="shieldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1e40af" />
            <stop offset="100%" stopColor="#3730a3" />
          </linearGradient>
          <linearGradient id="goldGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>

        <path
          d="M60 10L20 25V55C20 75 35 95 60 110C85 95 100 75 100 55V25L60 10Z"
          fill="url(#shieldGradient)"
          stroke="url(#goldGradient)"
          strokeWidth="3"
        />

        {/* BPL Text */}
        <text
          x="60"
          y="35"
          textAnchor="middle"
          fill="url(#goldGradient)"
          fontSize="20"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          BPL
        </text>

        {/* Cricket Ball */}
        <circle cx="45" cy="55" r="8" fill="#ef4444" />
        <path d="M37 55Q45 50 53 55" stroke="#ffffff" strokeWidth="1.5" fill="none" />
        <path d="M37 55Q45 60 53 55" stroke="#ffffff" strokeWidth="1.5" fill="none" />

        {/* Cricket Bat */}
        <rect x="65" y="45" width="3" height="20" fill="#d97706" rx="1" />
        <rect x="63" y="63" width="7" height="8" fill="#d97706" rx="2" />

        {/* Wickets */}
        <rect x="75" y="50" width="1.5" height="15" fill="url(#goldGradient)" />
        <rect x="77" y="50" width="1.5" height="15" fill="url(#goldGradient)" />
        <rect x="79" y="50" width="1.5" height="15" fill="url(#goldGradient)" />
        <rect x="74" y="49" width="7" height="1.5" fill="url(#goldGradient)" />

        {/* Bottom Banner */}
        <rect x="15" y="80" width="90" height="20" fill="url(#goldGradient)" rx="10" />
        <text
          x="60"
          y="93"
          textAnchor="middle"
          fill="#1e40af"
          fontSize="9"
          fontWeight="bold"
          fontFamily="Arial, sans-serif"
        >
          BAKCHOD LEAGUE
        </text>
      </svg>
    </div>
  )
}
