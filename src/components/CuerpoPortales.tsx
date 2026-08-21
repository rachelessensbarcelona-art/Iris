import { css } from "@/lib/css";
import type { Resultado } from "@/lib/engine";
import {
  CONO_CORONA,
  CONO_RAIZ,
  EJE_CUERPO,
  PORTALES_CUERPO,
  RADIO_PORTAL,
  SILUETA_BRAZO,
  SILUETA_PERFIL,
  VIEWBOX_CUERPO,
  VORTICES,
  VORTICE_ALTO,
  VORTICE_ANCHO,
} from "@/lib/cuerpo";

type Tema = {
  trazo: string;
  vortice: string;
  vorticeActivo: string;
  portalVacio: string;
  portalBorde: string;
  portalConTarea: string;
  textoPortal: string;
  textoPortalTarea: string;
  dinamico: string;
  escudo: string;
};

export const TEMA_OSCURO: Tema = {
  trazo: "rgba(201,168,76,.55)",
  vortice: "rgba(201,168,76,.11)",
  vorticeActivo: "rgba(232,185,60,.55)",
  portalVacio: "rgba(255,255,255,.04)",
  portalBorde: "rgba(201,168,76,.32)",
  portalConTarea: "rgba(232,185,60,.88)",
  textoPortal: "#A99C82",
  textoPortalTarea: "#1A1508",
  dinamico: "#E2574C",
  escudo: "#4C8FE0",
};

export const TEMA_CLARO: Tema = {
  trazo: "rgba(107,100,120,.75)",
  vortice: "rgba(201,168,76,.24)",
  vorticeActivo: "rgba(229,182,60,.55)",
  portalVacio: "#F3EFE6",
  portalBorde: "rgba(154,127,50,.55)",
  portalConTarea: "#E5B63C",
  textoPortal: "#6B6478",
  textoPortalTarea: "#241F2E",
  dinamico: "#C0574C",
  escudo: "#3E77C4",
};

/**
 * Los diez portales sobre la silueta de perfil, como en el manual: cada
 * pareja de portales comparte un vórtice, y la corona y la raíz llevan su
 * cono. El relleno dorado marca portal con aprendizaje y el aro azul, escudo.
 */
export default function CuerpoPortales({ r, tema = TEMA_OSCURO }: { r: Resultado; tema?: Tema }) {
  const est = r.estructura;

  return (
    <svg viewBox={VIEWBOX_CUERPO} style={css("width:100%;height:auto;display:block;")}>
      {/* vórtices: un lazo por pareja, encendido si alguno de los dos tiene tarea */}
      {VORTICES.map((v) => {
        const activo = !!est.aprendizajes[v.izq] || !!est.aprendizajes[v.der];
        const fill = activo ? tema.vorticeActivo : tema.vortice;
        return (
          <g key={v.y}>
            <path d={`M${EJE_CUERPO - VORTICE_ANCHO} ${v.y - VORTICE_ALTO} L${EJE_CUERPO - VORTICE_ANCHO} ${v.y + VORTICE_ALTO} L${EJE_CUERPO} ${v.y} Z`} fill={fill} />
            <path d={`M${EJE_CUERPO + VORTICE_ANCHO} ${v.y - VORTICE_ALTO} L${EJE_CUERPO + VORTICE_ANCHO} ${v.y + VORTICE_ALTO} L${EJE_CUERPO} ${v.y} Z`} fill={fill} />
          </g>
        );
      })}
      <path d={CONO_CORONA} fill={est.aprendizajes[2] ? tema.vorticeActivo : tema.vortice} />
      <path d={CONO_RAIZ} fill={est.aprendizajes[7] ? tema.vorticeActivo : tema.vortice} />

      {/* silueta de perfil, sólo contorno */}
      <path d={SILUETA_PERFIL} fill="none" stroke={tema.trazo} strokeWidth={2} strokeLinejoin="round" />
      <path d={SILUETA_BRAZO} fill="none" stroke={tema.trazo} strokeWidth={1.5} strokeLinecap="round" />

      {PORTALES_CUERPO.map((p) => {
        const tieneTarea = !!est.aprendizajes[p.portal];
        const tieneEscudo = !!est.escudos[p.portal];
        // En corona y raíz el número dinámico va al costado: debajo caería
        // sobre la cabeza o entre las piernas.
        const dx = p.lado === 0 ? -(RADIO_PORTAL + 15) : p.lado * (RADIO_PORTAL + 15);

        return (
          <g key={p.portal}>
            <circle
              cx={p.x}
              cy={p.y}
              r={RADIO_PORTAL}
              fill={tieneTarea ? tema.portalConTarea : tema.portalVacio}
              stroke={tieneEscudo ? tema.escudo : tema.portalBorde}
              strokeWidth={tieneEscudo ? 3 : 1}
            />
            <text x={p.x} y={p.y + 6} fill={tieneTarea ? tema.textoPortalTarea : tema.textoPortal} fontSize={17} fontFamily="Cinzel, serif" textAnchor="middle">
              {p.etiqueta}
            </text>
            <text x={p.x + dx} y={p.y + 5} fill={tema.dinamico} fontSize={13} fontFamily="Karla, sans-serif" textAnchor="middle">
              {est.dinamicos[p.portal]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
