import React from 'react';

// Official stripe and canton proportions, with alternating rows of six and five stars.
export default function AmericanFlag() {
  return (
    <svg className="american-flag" viewBox="0 0 247 130" aria-hidden="true" focusable="false">
      <rect width="247" height="130" fill="#fff" />
      {Array.from({ length: 7 }, (_, row) => (
        <rect key={row} y={row * 20} width="247" height="10" fill="#b31942" />
      ))}
      <rect width="98.8" height="70" fill="#0a3161" />
      <g fill="#fff">
        {Array.from({ length: 9 }, (_, row) => {
          const offset = row % 2;
          return Array.from({ length: 6 - offset }, (_, column) => (
            <path key={`${row}-${column}`}
              transform={`translate(${8.23 * (1 + column * 2 + offset)} ${7 * (row + 1)})`}
              d="M0-4 L.9-1.2 H3.8 L1.45.45 L2.35 3.25 L0 1.55 L-2.35 3.25 L-1.45.45 L-3.8-1.2 H-.9 Z" />
          ));
        })}
      </g>
    </svg>
  );
}
