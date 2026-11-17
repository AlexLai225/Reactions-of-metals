import type { MetalItem, ReagentId } from '../game/metals';

interface MetalArtworkProps {
  metal: MetalItem;
  reagent?: ReagentId;
  showReactionBubbles?: boolean;
  size?: 'md' | 'sm';
}

export function MetalArtwork({
  metal,
  reagent = 'hcl',
  showReactionBubbles = false,
  size = 'md',
}: MetalArtworkProps) {
  const { palette } = metal;
  const reaction = metal.reactions[reagent];
  const dim = size === 'sm' ? 'w-20 h-16' : 'w-44 h-36 sm:w-48 sm:h-40';

  const flameFill =
    metal.symbol === 'K'
      ? '#c084fc'
      : metal.symbol === 'Na'
        ? '#facc15'
        : metal.symbol === 'Ca'
          ? '#fb7185'
          : '#f97316';

  const showFlame =
    showReactionBubbles &&
    reaction.reacts &&
    (reaction.tier === 'explosive' ||
      (reagent === 'oxygen' && reaction.tier === 'vigorous'));

  const showOxideSparks =
    showReactionBubbles &&
    reaction.reacts &&
    reagent === 'oxygen' &&
    reaction.tier !== 'explosive' &&
    reaction.tier !== 'vigorous';

  const showBubbles =
    showReactionBubbles && reaction.reacts && reagent !== 'oxygen';

  return (
    <div className="relative flex items-center justify-center select-none">
      <svg
        viewBox="0 0 220 170"
        className={`${dim} drop-shadow-[0_10px_18px_rgba(15,23,42,0.18)]`}
        aria-hidden="true"
      >
        <ellipse
          cx="110"
          cy="144"
          rx="62"
          ry="9"
          fill="rgba(15, 23, 42, 0.18)"
        />

        <polygon
          points="50,64 110,82 170,64 182,102 152,138 68,138 38,102"
          fill={palette.faceMain}
          stroke={palette.stroke}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <polygon
          points="110,82 170,64 182,102 152,138 110,138"
          fill={palette.faceShade}
          opacity="0.55"
        />

        <polygon
          points="50,64 110,44 170,64 110,82"
          fill={palette.faceTop}
          stroke={palette.stroke}
          strokeWidth="3.5"
          strokeLinejoin="round"
        />

        <line
          x1="64"
          y1="62"
          x2="96"
          y2="52"
          stroke={palette.highlight}
          strokeWidth="4.5"
          strokeLinecap="round"
          opacity="0.92"
        />

        <line
          x1="110"
          y1="82"
          x2="110"
          y2="136"
          stroke={palette.stroke}
          strokeWidth="2"
          strokeOpacity="0.22"
        />

        {showFlame && (
          <g>
            <path
              d="M110 18 C120 32, 128 42, 119 52 C114 57, 106 57, 101 52 C92 42, 100 32, 110 18 Z"
              fill={flameFill}
              stroke="#ea580c"
              strokeWidth="2"
            />
          </g>
        )}

        {showOxideSparks && (
          <g>
            <circle cx="80" cy="40" r="3.5" fill="#fb923c" />
            <circle cx="138" cy="36" r="3" fill="#facc15" />
            <circle cx="110" cy="28" r="4" fill="#f97316" />
          </g>
        )}

        {showBubbles && (
          <g>
            <circle
              cx="74"
              cy="48"
              r="5.5"
              fill="#ffffff"
              fillOpacity="0.88"
              stroke="#ea580c"
              strokeWidth="2"
              className="animate-bubble-1"
            />
            <circle
              cx="142"
              cy="42"
              r="4.5"
              fill="#ffffff"
              fillOpacity="0.88"
              stroke="#ea580c"
              strokeWidth="2"
              className="animate-bubble-2"
            />
            <circle
              cx="108"
              cy="34"
              r="6.5"
              fill="#ffffff"
              fillOpacity="0.88"
              stroke="#ea580c"
              strokeWidth="2"
              className="animate-bubble-3"
            />
          </g>
        )}
      </svg>
    </div>
  );
}

export function BeakerActionIcon({
  variant,
  reagent = 'hcl',
}: {
  variant: 'reacts' | 'no-reaction';
  reagent?: ReagentId;
}) {
  const isReactive = variant === 'reacts';

  if (reagent === 'oxygen') {
    return (
      <svg
        viewBox="0 0 64 64"
        className="w-10 h-10 sm:w-11 sm:h-11"
        aria-hidden="true"
      >
        {/* Metal block */}
        <polygon
          points="16,42 32,34 48,42 46,52 18,52"
          fill="#94a3b8"
          stroke="#1e293b"
          strokeWidth="2.5"
          strokeLinejoin="round"
        />
        <polygon
          points="16,42 32,34 48,42 32,48"
          fill="#cbd5e1"
          stroke="#1e293b"
          strokeWidth="2"
          strokeLinejoin="round"
        />
        {isReactive ? (
          <g>
            <path
              d="M32 12 C38 20, 42 25, 37 31 C34 34, 30 34, 27 31 C22 25, 26 20, 32 12 Z"
              fill="#fb923c"
              stroke="#ea580c"
              strokeWidth="2"
            />
            <circle cx="20" cy="24" r="2.2" fill="#facc15" />
            <circle cx="44" cy="22" r="2.2" fill="#facc15" />
          </g>
        ) : (
          <g>
            <text
              x="32"
              y="26"
              textAnchor="middle"
              fontSize="12"
              fontWeight="700"
              fill="#0284c7"
              fontFamily="JetBrains Mono, monospace"
            >
              O₂
            </text>
          </g>
        )}
      </svg>
    );
  }

  return (
    <svg
      viewBox="0 0 64 64"
      className="w-10 h-10 sm:w-11 sm:h-11"
      aria-hidden="true"
    >
      {reagent !== 'steam' && (
        <>
          <rect x="17" y="28" width="30" height="24" rx="2" fill="#bae6fd" />
          <line
            x1="17"
            y1="28"
            x2="47"
            y2="28"
            stroke="#0284c7"
            strokeWidth="2"
          />
        </>
      )}

      {reagent === 'steam' && (
        <g>
          <path
            d="M24 38 Q22 33 25 29 T24 21"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M39 38 Q37 33 40 29 T39 21"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </g>
      )}

      <polygon
        points="26,50 28,45 36,45 38,50"
        fill="#94a3b8"
        stroke="#334155"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />

      {isReactive && (
        <g>
          <circle
            cx="29"
            cy="39"
            r="2.2"
            fill="#ffffff"
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          <circle
            cx="35"
            cy="34"
            r="2.6"
            fill="#ffffff"
            stroke="#0284c7"
            strokeWidth="1.2"
          />
          <circle
            cx="31"
            cy="23"
            r="2.3"
            fill="#fff7ed"
            stroke="#ea580c"
            strokeWidth="1.4"
          />
          <circle
            cx="37"
            cy="18"
            r="1.8"
            fill="#fff7ed"
            stroke="#ea580c"
            strokeWidth="1.4"
          />
        </g>
      )}

      <path
        d="M15 14 H17 V51 C17 52.1 17.9 53 19 53 H45 C46.1 53 47 52.1 47 51 V14 H49"
        fill="none"
        stroke="#1e293b"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function HeartIcon({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className="w-5 h-5 sm:w-[22px] sm:h-[22px]"
      aria-hidden="true"
    >
      <path
        d="M12 20.6C12 20.6 4 15.1 4 9.4C4 6.6 6.2 4.5 8.8 4.5C10.4 4.5 11.4 5.3 12 6.3C12.6 5.3 13.6 4.5 15.2 4.5C17.8 4.5 20 6.6 20 9.4C20 15.1 12 20.6 12 20.6Z"
        fill={filled ? '#ef4444' : 'transparent'}
        stroke={filled ? '#dc2626' : '#cbd5e1'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
}
