/* Silueta humana y colocación de los diez portales de la estructura
 * energética, según el manual "4. ESTRUCTURA ENERGÉTICA. LEYES UNIVERSALES"
 * (pág. 127 y 143): el 2 en la corona, el 7 en la raíz, y los ocho restantes
 * por parejas a la espalda (columna izquierda) y al frente (derecha).
 *
 *          2          corona
 *     3         1     cabeza
 *     4         0     garganta
 *     5         9     pecho
 *     6         8     vientre
 *          7          raíz
 *
 * La figura va de perfil y a línea, como el dibujo del manual, con un vórtice
 * en forma de lazo a cada altura: son los chakras, "vórtices de energía que
 * absorben y expulsan energía cósmica".
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

export const VIEWBOX_CUERPO = "0 0 360 470";
export const EJE_CUERPO = 180;
export const RADIO_PORTAL = 22;

export const PORTALES_CUERPO: PortalCuerpo[] = [
  { portal: 2, etiqueta: "2", x: 180, y: 20, lado: 0 },
  { portal: 3, etiqueta: "3", x: 70, y: 86, lado: -1 },
  { portal: 1, etiqueta: "1", x: 290, y: 86, lado: 1 },
  { portal: 4, etiqueta: "4", x: 70, y: 150, lado: -1 },
  { portal: 10, etiqueta: "0", x: 290, y: 150, lado: 1 },
  { portal: 5, etiqueta: "5", x: 70, y: 224, lado: -1 },
  { portal: 9, etiqueta: "9", x: 290, y: 224, lado: 1 },
  { portal: 6, etiqueta: "6", x: 70, y: 292, lado: -1 },
  { portal: 8, etiqueta: "8", x: 290, y: 292, lado: 1 },
  { portal: 7, etiqueta: "7", x: 180, y: 366, lado: 0 },
];

/** Alturas de los vórtices por pareja de portales (izquierda, derecha). */
export const VORTICES: Array<{ y: number; izq: number; der: number }> = [
  { y: 86, izq: 3, der: 1 },
  { y: 150, izq: 4, der: 10 },
  { y: 224, izq: 5, der: 9 },
  { y: 292, izq: 6, der: 8 },
];
/** Medio ancho y medio alto de cada triángulo del lazo. */
export const VORTICE_ANCHO = 70;
export const VORTICE_ALTO = 21;

/** Cono de la corona (apunta hacia abajo) y de la raíz (hacia arriba). */
export const CONO_CORONA = "M157 40 L203 40 L180 78 Z";
export const CONO_RAIZ = "M160 340 L200 340 L180 296 Z";

/**
 * Contorno del cuerpo de perfil, mirando a la izquierda: coronilla, frente,
 * nariz, mentón, pecho, vientre, pierna, pie y de vuelta por la espalda.
 */
export const SILUETA_PERFIL =
  "M180 28 " +
  "C203 28 224 38 228 56 C231 74 226 88 216 96 L212 106 " +
  "C221 114 222 130 219 148 C216 172 208 190 206 208 " +
  "C205 226 224 232 232 244 C235 258 226 276 221 296 " +
  "C215 320 213 340 216 362 C219 392 216 420 210 438 " +
  "L206 448 L131 448 L131 440 " +
  "C145 430 163 424 166 414 C168 392 167 362 166 336 " +
  "C164 314 158 296 155 276 C153 258 147 248 148 232 " +
  "C148 212 141 196 138 176 C135 154 139 134 148 122 L162 108 " +
  "C151 102 142 98 141 92 C137 86 131 84 132 80 " +
  "C134 76 125 74 122 71 C126 66 132 62 134 56 " +
  "C139 40 157 28 180 28 Z";

/** Brazo insinuado, como en el dibujo del manual. */
export const SILUETA_BRAZO = "M210 120 C199 150 193 190 196 220 C197 236 206 245 216 247";
