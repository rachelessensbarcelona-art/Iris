import { css } from "@/lib/css";
import type { Resultado } from "@/lib/engine";
import {
  CONO_APEX,
  CONO_BOCA,
  CONO_CORONA,
  CONO_RAIZ,
  DESPLAZA_CUERPO,
  EJE_CUERPO,
  NIVELES,
  PORTALES_CUERPO,
  RADIO_PORTAL,
  RETICULA_Y,
  SILUETA_CABEZA,
  SILUETA_CUELLO,
  SILUETA_CUERPO,
  VIEWBOX_CUERPO,
} from "@/lib/cuerpo";

const FUENTE = "-apple-system, BlinkMacSystemFont, sans-serif";
const GRIS_CUERPO = "#C8C6CC";

/**
 * Los diez portales sobre la figura de la ficha. Cada portal lleva su número
 * grande y, pegado abajo a la derecha, el número dinámico en rojo. El relleno
 * dorado marca portal con aprendizaje, el aro azul marca escudo, y el recuadro
 * azul de al lado es la cifra de la fecha que abrió ese aprendizaje.
 */
export default function CuerpoPortales({ r }: { r: Resultado }) {
  const est = r.estructura;

  return (
    <svg viewBox={VIEWBOX_CUERPO} style={css("width:100%;height:auto;display:block;")}>
      <defs>
        {/* Un degradado por nivel: denso donde nace, en el cuerpo, y
         * transparente en la boca del cono. */}
        {NIVELES.map((n, i) => (
          <linearGradient key={i} id={`es33-cono-izq-${i}`} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={n.tono} stopOpacity="0.58" />
            <stop offset="100%" stopColor={n.tono} stopOpacity="0" />
          </linearGradient>
        ))}
        {NIVELES.map((n, i) => (
          <linearGradient key={"d" + i} id={`es33-cono-der-${i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={n.tono} stopOpacity="0.58" />
            <stop offset="100%" stopColor={n.tono} stopOpacity="0" />
          </linearGradient>
        ))}
        <linearGradient id="es33-corona" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#5B4A93" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#5B4A93" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="es33-raiz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0392B" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#C0392B" stopOpacity="0" />
        </linearGradient>
        {/* El recorte va en las coordenadas propias del cuerpo, sin desplazar:
         * quien lo usa ya está dentro del mismo translate, y un transform
         * colgado de un clipPath no se aplica de forma fiable. */}
        <clipPath id="es33-recorte-cuerpo">
          <path d={SILUETA_CUERPO} />
          <ellipse cx={SILUETA_CABEZA.cx} cy={SILUETA_CABEZA.cy} rx={SILUETA_CABEZA.rx} ry={SILUETA_CABEZA.ry} />
        </clipPath>
      </defs>

      {/* conos de energía, por debajo de la figura */}
      {NIVELES.map((n, i) => (
        <g key={n.y}>
          <path d={`M${EJE_CUERPO - CONO_APEX} ${n.y} L14 ${n.y - CONO_BOCA} L14 ${n.y + CONO_BOCA} Z`} fill={`url(#es33-cono-izq-${i})`} />
          <path d={`M${EJE_CUERPO + CONO_APEX} ${n.y} L386 ${n.y - CONO_BOCA} L386 ${n.y + CONO_BOCA} Z`} fill={`url(#es33-cono-der-${i})`} />
        </g>
      ))}
      <path d={CONO_CORONA} fill="url(#es33-corona)" />

      {/* la figura, rellena en gris como en la ficha, con la retícula blanca
       * recortada contra ella */}
      <g transform={`translate(0,${DESPLAZA_CUERPO})`}>
        <ellipse cx={SILUETA_CABEZA.cx} cy={SILUETA_CABEZA.cy} rx={SILUETA_CABEZA.rx} ry={SILUETA_CABEZA.ry} fill={GRIS_CUERPO} />
        <path d={SILUETA_CUELLO} fill={GRIS_CUERPO} />
        <path d={SILUETA_CUERPO} fill={GRIS_CUERPO} />
        <g clipPath="url(#es33-recorte-cuerpo)" stroke="#fff" strokeWidth={1.7} strokeOpacity={0.92}>
          <line x1={EJE_CUERPO} y1={34} x2={EJE_CUERPO} y2={392} />
          {RETICULA_Y.map((y) => (
            <line key={y} x1={100} y1={y} x2={300} y2={y} />
          ))}
        </g>
      </g>

      {/* La raíz se pinta después del cuerpo: dibujada antes quedaba tapada y
       * sólo asomaba por el hueco de las piernas. */}
      <path d={CONO_RAIZ} fill="url(#es33-raiz)" />

      {PORTALES_CUERPO.map((p) => {
        const veces = est.aprendizajes[p.portal] || 0;
        const tieneEscudo = !!est.escudos[p.portal];
        const cifra = String(est.dinamicos[p.portal]).repeat(veces);
        const ancho = 16 + cifra.length * 11;
        // El recuadro sale en diagonal hacia fuera: encima del portal chocaría
        // con el de arriba, porque los diez van en dos columnas muy juntas.
        const cajaX = p.lado === 0 ? p.x : p.x + p.lado * 27;
        const cajaY = p.lado === 0 ? p.y - RADIO_PORTAL - 30 : p.y - 45;

        return (
          <g key={p.portal}>
            <circle
              cx={p.x}
              cy={p.y}
              r={RADIO_PORTAL}
              fill={veces ? "#E5B63C" : "#FFFFFF"}
              fillOpacity={veces ? 1 : 0.92}
              stroke={tieneEscudo ? "#3E77C4" : "rgba(90,80,60,.42)"}
              strokeWidth={tieneEscudo ? 3 : 1.2}
            />
            <text x={p.x} y={p.y + 7} fill={veces ? "#241F2E" : "#4A4550"} fontSize={20} fontFamily={FUENTE} fontWeight={700} textAnchor="middle">
              {p.etiqueta}
            </text>
            {/* El dinámico va pegado abajo a la derecha, como está anotado a
             * mano en la ficha. */}
            <text x={p.x + RADIO_PORTAL - 2} y={p.y + RADIO_PORTAL + 2} fill="#C0392B" fontSize={15} fontFamily={FUENTE} fontWeight={600} textAnchor="start">
              {est.dinamicos[p.portal]}
            </text>
            {veces > 0 && (
              <g>
                <rect x={cajaX - ancho / 2} y={cajaY} width={ancho} height={23} rx={5} fill="rgba(255,255,255,.95)" stroke="#3E77C4" strokeWidth={1.8} />
                <text x={cajaX} y={cajaY + 17} fill="#2C5D9E" fontSize={15} fontFamily={FUENTE} fontWeight={700} textAnchor="middle">
                  {cifra}
                </text>
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
