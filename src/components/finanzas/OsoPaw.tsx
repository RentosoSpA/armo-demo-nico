import React from 'react';

interface OsoPawProps {
  className?: string;
}

const OsoPaw: React.FC<OsoPawProps> = ({ className }) => {
  return (
    <svg
      className={className}
      width="40"
      height="40"
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Filtro de glassmorphism */}
      <defs>
        <filter id="glassEffect" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="0.5" result="blur" />
          <feColorMatrix
            in="blur"
            type="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 1 0"
            result="glass"
          />
        </filter>
        <linearGradient id="glassGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style={{ stopColor: 'rgba(255,255,255,1)', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: 'rgba(255,255,255,0.85)', stopOpacity: 1 }} />
        </linearGradient>
      </defs>

      {/* Dedo principal (centro) */}
      <ellipse
        cx="20"
        cy="10"
        rx="5"
        ry="6.5"
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
        filter="url(#glassEffect)"
      />

      {/* Dedo izquierdo */}
      <ellipse
        cx="11"
        cy="13"
        rx="4.5"
        ry="6"
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
        transform="rotate(-15 11 13)"
        filter="url(#glassEffect)"
      />

      {/* Dedo derecho */}
      <ellipse
        cx="29"
        cy="13"
        rx="4.5"
        ry="6"
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
        transform="rotate(15 29 13)"
        filter="url(#glassEffect)"
      />

      {/* Almohadilla principal */}
      <ellipse
        cx="20"
        cy="28"
        rx="8.5"
        ry="7.5"
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
        filter="url(#glassEffect)"
      />

      {/* Almohadillas pequeñas - izquierda inferior */}
      <ellipse
        cx="11"
        cy="25"
        rx="3.5"
        ry="4"
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
        filter="url(#glassEffect)"
      />

      {/* Almohadillas pequeñas - derecha inferior */}
      <ellipse
        cx="29"
        cy="25"
        rx="3.5"
        ry="4"
        fill="url(#glassGradient)"
        stroke="rgba(255,255,255,0.5)"
        strokeWidth="0.8"
        filter="url(#glassEffect)"
      />

      {/* Detalles de garras */}
      <path
        d="M 20 3.5 L 20 1"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 9.5 7.5 L 8 5"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M 30.5 7.5 L 32 5"
        stroke="rgba(255,255,255,0.7)"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default OsoPaw;
