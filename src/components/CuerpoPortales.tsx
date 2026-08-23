"use client";
import { motion, useReducedMotion } from "framer-motion";
import { css } from "@/lib/css";
import type { Resultado } from "@/lib/engine";
import { CONOS, CONO_APEX, CONO_BOCA, CONO_CORONA, CONO_RAIZ, EJE_CUERPO, EJE_CURVO, PORTALES_CUERPO, RETICULA, SILUETA_PERFIL } from "@/lib/cuerpo";

const FUENTE = "-apple-system, BlinkMacSystemFont, sans-serif";
const GRIS = "#C6C4CB";
const RADIO = 26;
/* Margen a los lados para que las pastillas no toquen el borde, y corte por
 * abajo antes de las piernas: de la rodilla para abajo no hay ningún portal y
 * eran doscientas unidades de lienzo vacío. En vez de cortar en seco, la
 * figura se disuelve. */
const VISTA = "-26 -58 352 604";

/**
 * La lámina de la ficha con los diez portales encima.
 *
 * En los apuntes cada portal lleva anotados a mano hasta cuatro números
 * distintos, y sobre la pantalla eso se convertía en un amontonamiento — un
 * portal con cuatro aprendizajes llegaba a rotularse "6666". Aquí la misma
 * información se cuenta con menos tinta: el portal y su dinámico comparten
 * pastilla, uno encima del otro, y las repeticiones se dicen con un "×4" en
 * vez de repitiendo la cifra. Una línea fina une cada portal con su altura
 * en el cuerpo, que es lo que el dibujo a mano deja implícito.
 */
export default function CuerpoPortales({ r }: { r: Resultado }) {
  const est = r.estructura;
  const quieto = useReducedMotion();

  const late = (i: number) =>
    quieto
      ? {}
      : {
          animate: { opacity: [0.5, 0.9, 0.5], scaleX: [0.95, 1.05, 0.95] },
          transition: { duration: 5.5 + i * 0.7, repeat: Infinity, ease: "easeInOut" as const },
        };

  return (
    <svg viewBox={VISTA} style={css("width:100%;height:auto;display:block;")}>
      <defs>
        {CONOS.map((c, i) => (
          <linearGradient key={i} id={`es33-cono-izq-${i}`} x1="1" y1="0" x2="0" y2="0">
            <stop offset="0%" stopColor={c.tono} stopOpacity="0.5" />
            <stop offset="100%" stopColor={c.tono} stopOpacity="0" />
          </linearGradient>
        ))}
        {CONOS.map((c, i) => (
          <linearGradient key={"d" + i} id={`es33-cono-der-${i}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor={c.tono} stopOpacity="0.5" />
            <stop offset="100%" stopColor={c.tono} stopOpacity="0" />
          </linearGradient>
        ))}
        <linearGradient id="es33-corona" x1="0" y1="1" x2="0" y2="0">
          <stop offset="0%" stopColor="#7B5EA7" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#7B5EA7" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="es33-raiz" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#C0392B" stopOpacity="0.55" />
          <stop offset="100%" stopColor="#C0392B" stopOpacity="0" />
        </linearGradient>
        <clipPath id="es33-recorte-cuerpo">
          <path d={SILUETA_PERFIL} />
        </clipPath>
        <linearGradient id="es33-desvanece" x1="0" y1="446" x2="0" y2="540" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#fff" stopOpacity="1" />
          <stop offset="100%" stopColor="#fff" stopOpacity="0" />
        </linearGradient>
        <mask id="es33-pie">
          <rect x="-26" y="-58" width="352" height="504" fill="#fff" />
          <rect x="-26" y="446" width="352" height="100" fill="url(#es33-desvanece)" />
        </mask>
      </defs>

      {/* conos de energía */}
      {CONOS.map((c, i) => (
        <g key={c.y}>
          <motion.path
            d={`M${EJE_CUERPO - CONO_APEX} ${c.y} L4 ${c.y - CONO_BOCA} L4 ${c.y + CONO_BOCA} Z`}
            fill={`url(#es33-cono-izq-${i})`}
            style={{ transformBox: "fill-box", transformOrigin: "right center" }}
            {...late(i)}
          />
          <motion.path
            d={`M${EJE_CUERPO + CONO_APEX} ${c.y} L296 ${c.y - CONO_BOCA} L296 ${c.y + CONO_BOCA} Z`}
            fill={`url(#es33-cono-der-${i})`}
            style={{ transformBox: "fill-box", transformOrigin: "left center" }}
            {...late(i + 1)}
          />
        </g>
      ))}
      <motion.path d={CONO_CORONA} fill="url(#es33-corona)" style={{ transformBox: "fill-box", transformOrigin: "bottom center" }} {...late(2)} />

      {/* la figura, con su eje y su retícula */}
      <motion.g mask="url(#es33-pie)" initial={quieto ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.7 }}>
        <path d={SILUETA_PERFIL} fill={GRIS} />
        <g clipPath="url(#es33-recorte-cuerpo)" stroke="#fff" strokeLinecap="round" fill="none" strokeOpacity={0.92} strokeWidth={2.2}>
          <path d={EJE_CURVO} />
          {RETICULA.map((l) => (
            <line key={l.y} x1={l.x1 - 4} y1={l.y} x2={l.x2 + 4} y2={l.y} />
          ))}
        </g>
      </motion.g>
      <motion.path d={CONO_RAIZ} fill="url(#es33-raiz)" style={{ transformBox: "fill-box", transformOrigin: "top center" }} {...late(4)} />

      {PORTALES_CUERPO.map((p, i) => {
        const veces = est.aprendizajes[p.portal] || 0;
        const escudo = !!est.escudos[p.portal];
        const retraso = 0.3 + i * 0.06;

        return (
          <motion.g
            key={p.portal}
            initial={quieto ? false : { opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: retraso, duration: 0.5, ease: [0.34, 1.4, 0.64, 1] }}
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
          >
            {/* Cada portal se enlaza con su altura en el cuerpo: sin la línea
             * hay que adivinar a qué chakra pertenece cada pastilla. */}
            {p.lado !== 0 && (
              <line
                x1={p.x + p.lado * RADIO}
                y1={p.y}
                x2={EJE_CUERPO - p.lado * 4}
                y2={p.y}
                stroke="var(--text-4)"
                strokeOpacity={0.28}
                strokeWidth={1.2}
              />
            )}

            {veces > 0 && !quieto && (
              <motion.circle
                cx={p.x}
                cy={p.y}
                r={RADIO}
                fill="none"
                stroke="#E5B63C"
                strokeWidth={2}
                animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
                transition={{ duration: 2.8, repeat: Infinity, ease: "easeOut", delay: i * 0.35 }}
                style={{ transformBox: "fill-box", transformOrigin: "center" }}
              />
            )}

            <circle
              cx={p.x}
              cy={p.y}
              r={RADIO}
              fill={veces ? "#E5B63C" : "var(--surface-solid)"}
              stroke={escudo ? "#3E77C4" : "var(--border-strong)"}
              strokeWidth={escudo ? 3 : 1.2}
            />
            {/* Portal arriba, dinámico debajo: los dos números que el manual
             * escribe uno junto al otro, ahora dentro de la misma pastilla. */}
            <text x={p.x} y={p.y - 1} fill={veces ? "#241F2E" : "var(--text)"} fontSize={21} fontFamily={FUENTE} fontWeight={650} textAnchor="middle">
              {p.etiqueta}
            </text>
            <text
              x={p.x}
              y={p.y + 15}
              fill={veces ? "rgba(36,31,46,.62)" : "var(--red)"}
              fontSize={12}
              fontFamily={FUENTE}
              fontWeight={600}
              textAnchor="middle"
              letterSpacing="0.02em"
            >
              {est.dinamicos[p.portal]}
            </text>

            {/* Un aprendizaje repetido se dice con un multiplicador, no
             * repitiendo la cifra: "6666" no cabía y no se leía. */}
            {veces > 1 && (
              <g>
                <circle cx={p.x + RADIO - 4} cy={p.y - RADIO + 4} r={11} fill="#2C5D9E" />
                <text x={p.x + RADIO - 4} y={p.y - RADIO + 8} fill="#fff" fontSize={12} fontFamily={FUENTE} fontWeight={700} textAnchor="middle">
                  ×{veces}
                </text>
              </g>
            )}
          </motion.g>
        );
      })}
    </svg>
  );
}
