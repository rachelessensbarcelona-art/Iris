"use client";
import { motion, useReducedMotion } from "framer-motion";
import { css } from "@/lib/css";
import type { Resultado } from "@/lib/engine";
import {
  CONOS,
  CONO_APEX,
  CONO_BOCA,
  CONO_BOCA_X,
  CONO_CORONA,
  CONO_RAIZ,
  EJE_CUERPO,
  EJE_CURVO,
  PORTALES_CUERPO,
  RADIO_PORTAL,
  RETICULA,
  SILUETA_PERFIL,
  VIEWBOX_CUERPO,
} from "@/lib/cuerpo";

const FUENTE = "-apple-system, BlinkMacSystemFont, sans-serif";
const GRIS = "#C6C4CB";

/**
 * La lámina de la ficha con los diez portales encima. Cada portal lleva su
 * número grande y, pegado abajo a la derecha, el dinámico en rojo; el relleno
 * dorado marca tarea abierta, el aro azul marca escudo, y el recuadro azul de
 * al lado es la cifra de la fecha que abrió ese aprendizaje.
 *
 * Los chakras laten muy despacio, cada uno con su propio compás, para que se
 * lea como energía y no como un parpadeo sincronizado.
 */
export default function CuerpoPortales({ r }: { r: Resultado }) {
  const est = r.estructura;
  const quieto = useReducedMotion();

  const late = (i: number) =>
    quieto
      ? {}
      : {
          animate: { opacity: [0.45, 0.85, 0.45], scaleX: [0.94, 1.04, 0.94] },
          transition: { duration: 5.5 + i * 0.7, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <svg viewBox={VIEWBOX_CUERPO} style={css("width:100%;height:auto;display:block;overflow:visible;")}>
      <defs>
        {CONOS.map((c, i) => (
          <linearGradient key={i} id={`es33-cono-izq-${i}`} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={c.tono} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c.tono} stopOpacity="0" />
          </linearGradient>
        ))}
        {CONOS.map((c, i) => (
          <linearGradient key={"d" + i} id={`es33-cono-der-${i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.tono} stopOpacity="0.55" />
            <stop offset="100%" stopColor={c.tono} stopOpacity="0" />
          </linearGradient>
        ))}
        <linearGradient id="es33-corona" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#7B5EA7" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#7B5EA7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="es33-raiz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0392B" stopOpacity="0.6" />
          <stop offset="100%" stopColor="#C0392B" stopOpacity="0" />
        </linearGradient>
        <clipPath id="es33-recorte-cuerpo">
          <path d={SILUETA_PERFIL} />
        </clipPath>
      </defs>

      {/* conos de energía, latiendo por debajo de la figura */}
      {CONOS.map((c, i) => (
        <g key={c.y} style={{ transformBox: "fill-box", transformOrigin: "center" }}>
          <motion.path
            d={`M${EJE_CUERPO - CONO_APEX} ${c.y} L${CONO_BOCA_X} ${c.y - CONO_BOCA} L${CONO_BOCA_X} ${c.y + CONO_BOCA} Z`}
            fill={`url(#es33-cono-izq-${i})`}
            style={{ transformBox: "fill-box", transformOrigin: "right center" }}
            {...late(i)}
          />
          <motion.path
            d={`M${EJE_CUERPO + CONO_APEX} ${c.y} L${300 - CONO_BOCA_X} ${c.y - CONO_BOCA} L${300 - CONO_BOCA_X} ${c.y + CONO_BOCA} Z`}
            fill={`url(#es33-cono-der-${i})`}
            style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            {...late(i + 1)}
          />
        </g>
      ))}
      <motion.path d={CONO_CORONA} fill="url(#es33-corona)" style={{ transformBox: "fill-box", transformOrigin: "bottom center" }} {...late(2)} />

      {/* la figura, con su eje y su retícula recortados contra ella */}
      <motion.g initial={quieto ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <path d={SILUETA_PERFIL} fill={GRIS} />
        <g clipPath="url(#es33-recorte-cuerpo)" stroke="#fff" strokeLinecap="round" fill="none">
          <path d={EJE_CURVO} strokeWidth={2.2} strokeOpacity={0.95} />
          {RETICULA.map((l) => (
            <line key={l.y} x1={l.x1 - 4} y1={l.y} x2={l.x2 + 4} y2={l.y} strokeWidth={2.2} strokeOpacity={0.95} />
          ))}
        </g>
      </motion.g>

      {/* la raíz va después del cuerpo, si no queda tapada */}
      <motion.path d={CONO_RAIZ} fill="url(#es33-raiz)" style={{ transformBox: "fill-box", transformOrigin: "top center" }} {...late(4)} />

      {PORTALES_CUERPO.map((p, i) => {
        const veces = est.aprendizajes[p.portal] || 0;
        const escudo = !!est.escudos[p.portal];
        const cifra = String(est.dinamicos[p.portal]).repeat(veces);
        const ancho = 15 + cifra.length * 11;
        const cajaX = p.lado === 0 ? p.x : p.x + p.lado * 26;
        const cajaY = p.lado === 0 ? p.y - RADIO_PORTAL - 29 : p.y - 44;

        return (
          <motion.g
            key={p.portal}
            initial={quieto ? false : { opacity: 0, scale: 0.4 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.35 + i * 0.07, duration: 0.55, ease: [0.34, 1.4, 0.64, 1] }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            {/* Los portales con tarea abierta respiran: son los que hay que mirar. */}
            {/* El halo crece por escala, no por el radio: animar el atributo r
             * lo deja indefinido en el primer cuadro y el navegador protesta. */}
            {veces > 0 && !quieto && (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={RADIO_PORTAL}
                fill="none"
                stroke="#E5B63C"
                strokeWidth={2}
                animate={{ scale: [1, 1.55], opacity: [0.55, 0] }}
                transition={{ duration: 2.6, repeat: Infinity, ease: "easeOut", delay: i * 0.35 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            )}
            <circle
              cx={p.x}
              cy={p.y}
              r={RADIO_PORTAL}
              fill={veces ? "#E5B63C" : "#FFFFFF"}
              stroke={escudo ? "#3E77C4" : "rgba(90,80,60,.4)"}
              strokeWidth={escudo ? 3 : 1.2}
            />
            <text x={p.x} y={p.y + 7} fill={veces ? "#241F2E" : "#4A4550"} fontSize={20} fontFamily={FUENTE} fontWeight={700} textAnchor="middle">
              {p.etiqueta}
            </text>
            <text x={p.x + RADIO_PORTAL - 2} y={p.y + RADIO_PORTAL + 2} fill="#C0392B" fontSize={15} fontFamily={FUENTE} fontWeight={600} textAnchor="start">
              {est.dinamicos[p.portal]}
            </text>
            {veces > 0 && (
              <g>
                <rect x={cajaX - ancho / 2} y={cajaY} width={ancho} height={23} rx={5} fill="#fff" stroke="#3E77C4" strokeWidth={1.8} />
                <text x={cajaX} y={cajaY + 17} fill="#2C5D9E" fontSize={15} fontFamily={FUENTE} fontWeight={700} textAnchor="middle">
                  {cifra}
                </text>
              </g>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
