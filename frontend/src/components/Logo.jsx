const Logo = ({ size = 28, className = "", variant = "badge" }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`brand-logo-svg ${className}`.trim()}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ct-logo-amber" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#C59648" />
          <stop offset="100%" stopColor="#F2CB8E" />
        </linearGradient>
        <radialGradient id="ct-logo-glow" cx="50%" cy="30%" r="65%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.2" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
      </defs>

      {variant === "badge" && (
        <>
          {/* Outer Squircle Container */}
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="22"
            fill="var(--bg-surface-elevated)"
            stroke="var(--border)"
            strokeWidth="3"
          />
          <rect
            x="5"
            y="5"
            width="90"
            height="90"
            rx="22"
            fill="url(#ct-logo-glow)"
          />
        </>
      )}

      {/* Left Code Bracket '<' */}
      <path
        d="M35 34 L21 50 L35 66"
        stroke="var(--text-primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Dynamic Ascending Track Slash '/' */}
      <line
        x1="43"
        y1="68"
        x2="57"
        y2="32"
        stroke="url(#ct-logo-amber)"
        strokeWidth="6.5"
        strokeLinecap="round"
      />

      {/* Summit Milestone Track Node */}
      <circle cx="58" cy="27" r="4.5" fill="#F2CB8E" />
      <circle
        cx="58"
        cy="27"
        r="8"
        stroke="var(--accent)"
        strokeWidth="1.5"
        strokeOpacity="0.5"
      />

      {/* Right Code Bracket '>' */}
      <path
        d="M65 34 L79 50 L65 66"
        stroke="var(--text-primary)"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default Logo;

