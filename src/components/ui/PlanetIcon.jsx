import React from 'react';

export default function PlanetIcon(props) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Planet Body */}
      <circle cx="32" cy="32" r="14" fill="#6C63FF" />
      {/* Craters */}
      <circle cx="28" cy="28" r="2" fill="#A0A9FF" />
      <circle cx="36" cy="36" r="3" fill="#A0A9FF" />
      {/* Ring */}
      <ellipse
        cx="32"
        cy="32"
        rx="22"
        ry="6"
        fill="none"
        stroke="#A0A9FF"
        strokeWidth="4"
        strokeLinecap="round"
      />
    </svg>
  );
}
