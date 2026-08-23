/* Silueta humana y colocación de los diez portales de la estructura
 * energética, según el manual "4. ESTRUCTURA ENERGÉTICA. LEYES UNIVERSALES"
 * (pág. 127 y 143) y la ficha de trabajo de Esencias de Vida: el 2 en la
 * corona, el 7 en la raíz, y los ocho restantes por parejas a la espalda
 * (columna izquierda) y al frente (derecha).
 *
 *          2          corona
 *     3         1     cabeza · tercer ojo
 *     4         0     garganta
 *     5         9     pecho
 *     6         8     vientre
 *          7          raíz
 *
 * La figura es la misma de la ficha: cuerpo de pie relleno en gris, con la
 * retícula blanca por encima y un cono de energía a cada altura — los chakras,
 * "vórtices que absorben y expulsan energía cósmica". El cono nace en el
 * cuerpo y se abre hacia fuera, desvaneciéndose en la boca.
 */

export type PortalCuerpo = {
  /** Portal interno 1..10 tal y como lo numera el motor. */
  portal: number;
  /** Cómo se rotula: el portal 10 se escribe 0. */
  etiqueta: string;
  x: number;
  y: number;
  /** -1 espalda, 0 eje central, 1 frente. */
  lado: -1 | 0 | 1;
};

export const VIEWBOX_CUERPO = "0 0 400 660";
export const EJE_CUERPO = 200;
export const RADIO_PORTAL = 21;

/**
 * El trazado del cuerpo se dibujó con la cabeza pegada al borde. Se baja en
 * bloque para dejar sitio arriba al portal de la corona y a su recuadro, en
 * vez de rehacer el trazado entero a mano.
 */
export const DESPLAZA_CUERPO = 44;

/** Alturas de los cuatro pares de chakras, ya en coordenadas finales. */
export const NIVELES = [
  { y: 164, izq: 3, der: 1, tono: "#6E5FA8" },
  { y: 234, izq: 4, der: 10, tono: "#8E7BB0" },
  { y: 304, izq: 5, der: 9, tono: "#C9A84C" },
  { y: 374, izq: 6, der: 8, tono: "#B08A3C" },
];

export const PORTALES_CUERPO: PortalCuerpo[] = [
  { portal: 2, etiqueta: "2", x: 200, y: 52, lado: 0 },
  { portal: 3, etiqueta: "3", x: 64, y: 164, lado: -1 },
  { portal: 1, etiqueta: "1", x: 336, y: 164, lado: 1 },
  { portal: 4, etiqueta: "4", x: 64, y: 234, lado: -1 },
  { portal: 10, etiqueta: "0", x: 336, y: 234, lado: 1 },
  { portal: 5, etiqueta: "5", x: 64, y: 304, lado: -1 },
  { portal: 9, etiqueta: "9", x: 336, y: 304, lado: 1 },
  { portal: 6, etiqueta: "6", x: 64, y: 374, lado: -1 },
  { portal: 8, etiqueta: "8", x: 336, y: 374, lado: 1 },
  { portal: 7, etiqueta: "7", x: 200, y: 474, lado: 0 },
];

/** Dónde nace el cono sobre el cuerpo y medio alto de su boca, hacia fuera. */
export const CONO_APEX = 88;
export const CONO_BOCA = 22;

/** Corona y raíz: se abren en abanico, arriba y abajo del eje. */
export const CONO_CORONA = "M186 78 L214 78 L242 16 L158 16 Z";
export const CONO_RAIZ = "M186 420 L214 420 L238 500 L162 500 Z";

/**
 * Cuerpo de pie, visto de frente, con los brazos pegados al tronco: una sola
 * masa que se estrecha en la cintura y se abre en las caderas antes de
 * separarse en las dos piernas. Va en coordenadas propias; el grupo que lo
 * pinta le aplica DESPLAZA_CUERPO.
 */
export const SILUETA_CUERPO =
  "M168 116 " +
  "C144 121 124 137 119 164 " +
  "C112 198 114 236 119 270 " +
  "C122 295 125 316 127 336 " +
  "C124 379 122 427 125 470 " +
  "C127 512 130 550 133 574 " +
  "L133 590 L175 590 L175 574 " +
  "C177 542 181 508 185 469 " +
  "C188 444 191 421 195 400 " +
  "L200 386 L205 400 " +
  "C209 421 212 444 215 469 " +
  "C219 508 223 542 225 574 " +
  "L225 590 L267 590 L267 574 " +
  "C270 550 273 512 275 470 " +
  "C278 427 276 379 273 336 " +
  "C275 316 278 295 281 270 " +
  "C286 236 288 198 281 164 " +
  "C276 137 256 121 232 116 Z";

/** Cabeza y cuello, en piezas aparte para poder redondearlas bien. */
export const SILUETA_CABEZA = { cx: 200, cy: 74, rx: 36, ry: 42 };
export const SILUETA_CUELLO = "M182 104 L218 104 L218 124 L182 124 Z";

/**
 * Retícula blanca de la ficha: el eje del cuerpo y una línea entre cada dos
 * alturas de chakra. Va recortada contra la silueta, así que sólo se ve
 * encima. En coordenadas del cuerpo, sin desplazar.
 */
export const RETICULA_Y = [96, 156, 226, 296, 366];
