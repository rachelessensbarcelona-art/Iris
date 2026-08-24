/**
 * Los iconos van dibujados a mano en SVG en lugar de traer una librería: son
 * siete, pesan nada y así heredan el color del sitio donde se pongan.
 */
type P = { size?: number };

const trazo = {
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.7,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

function Caja({ size = 20, children }: P & { children: React.ReactNode }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" {...trazo}>
      {children}
    </svg>
  );
}

export const IcoResumen = (p: P) => (
  <Caja {...p}>
    <rect x="3" y="3" width="7" height="7" rx="2" />
    <rect x="14" y="3" width="7" height="7" rx="2" />
    <rect x="3" y="14" width="7" height="7" rx="2" />
    <rect x="14" y="14" width="7" height="7" rx="2" />
  </Caja>
);

export const IcoArbol = (p: P) => (
  <Caja {...p}>
    <circle cx="12" cy="4" r="2" />
    <circle cx="5" cy="11" r="2" />
    <circle cx="19" cy="11" r="2" />
    <circle cx="12" cy="19" r="2" />
    <path d="M10.6 5.6 6.4 9.4M13.4 5.6l4.2 3.8M6.4 12.6l4.2 4.8M17.6 12.6l-4.2 4.8" />
  </Caja>
);

export const IcoNumeros = (p: P) => (
  <Caja {...p}>
    <path d="M9 3 7 21M17 3l-2 18M3.5 8.5h17M2.8 15.5h17" />
  </Caja>
);

export const IcoEstructura = (p: P) => (
  <Caja {...p}>
    <circle cx="12" cy="4.6" r="2.3" />
    <path d="M12 7v7M6.5 10h11M9 21l3-7 3 7" />
  </Caja>
);

export const IcoAlma = (p: P) => (
  <Caja {...p}>
    <rect x="3" y="3" width="18" height="18" rx="2.5" />
    <path d="M9 3v18M15 3v18M3 9h18M3 15h18" />
  </Caja>
);

export const IcoCuentas = (p: P) => (
  <Caja {...p}>
    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H19v18H6.5A2.5 2.5 0 0 1 4 18.5Z" />
    <path d="M8 8h7M8 12h7M8 16h4" />
  </Caja>
);

export const IcoCiclos = (p: P) => (
  <Caja {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </Caja>
);

/* El bagua: el octógono del feng shui con sus ocho sectores. */
export const IcoFengShui = (p: P) => (
  <Caja {...p}>
    <path d="M12 2.6 19.4 6v8L12 21.4 4.6 14V6z" />
    <path d="M12 2.6v18.8M4.6 6l14.8 8M19.4 6 4.6 14" />
  </Caja>
);

/* La numerología, por lo que se ve en cuanto se abre: cifras. */
export const IcoNumerologia = (p: P) => (
  <Caja {...p}>
    <path d="M7.4 9.2 9.6 7.6v8.8M14 8.4a2.4 2.4 0 1 1 3.4 3.3L13.8 16.4h4" />
    <rect x="3" y="3" width="18" height="18" rx="4.5" />
  </Caja>
);
