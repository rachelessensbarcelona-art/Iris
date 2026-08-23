/**
 * El vocabulario visual de la plataforma. Antes cada componente se escribía su
 * propia tarjeta a mano — quince variantes de lo mismo, veinticuatro cuerpos de
 * letra distintos y un color de fondo por cada tipo de bloque — y el conjunto
 * se veía cargado y desordenado aunque cada pieza por separado estuviera bien.
 *
 * Aquí está decidido una sola vez. Las reglas:
 *
 *   · una sola tarjeta: fondo opaco, línea de un pelo, sin sombra ni desenfoque.
 *     Lo que flota de verdad — cabecera, hojas que se abren — lleva sombra
 *     aparte;
 *   · el color no rellena, marca. Un bloque de bloqueo no es una tarjeta
 *     morada: es una tarjeta normal con una raya morada al canto y su rótulo
 *     del mismo color. Se sigue sabiendo qué es cada cosa y deja de gritar;
 *   · dentro de una tarjeta no va otra tarjeta. Lo que separa es una línea.
 */

/** La tarjeta, y no hay otra. */
export const TARJETA = "background:var(--surface);border:1px solid var(--border);border-radius:var(--r);";

/** Tarjeta con el canto de color: el acento va en la raya, no en el fondo. */
export const tarjetaCon = (color: string) => TARJETA + "border-left:2px solid " + color + ";";

/** Relleno estándar y el más apretado, para tarjetas secundarias. */
export const PAD = "padding:var(--pad-card);";
export const PAD_SM = "padding:var(--pad-card-sm);";

/* --------------------------------------------------------------- tipografía */

/** Rótulo pequeño de arriba de un bloque: «Número de corazón», «Bloqueo 4». */
export const rotulo = (color = "var(--text-3)") =>
  "font-size:var(--t-mini);font-weight:590;letter-spacing:-.005em;color:" + color + ";";

/** Título de tarjeta, en la serif. */
export const TITULO = "font-family:var(--font-display);font-size:var(--t-title);font-weight:500;letter-spacing:-.012em;line-height:1.2;color:var(--text);";

/** Encabezado de sección. */
export const CABECERA = "font-family:var(--font-display);font-size:var(--t-head);font-weight:500;letter-spacing:-.014em;line-height:1.15;color:var(--text);";

/** El texto que se lee de verdad: los párrafos de los apuntes. */
export const LECTURA = "font-size:var(--t-read);line-height:1.62;color:var(--text-2);text-wrap:pretty;";

/** Texto de apoyo — pies, aclaraciones, la línea bajo un título. */
export const APOYO = "font-size:var(--t-body);line-height:1.5;color:var(--text-3);";

/** Apostilla: unidades, rangos de edad, «viene del número 14». */
export const NOTA = "font-size:var(--t-mini);color:var(--text-4);";

/* ------------------------------------------------------------------ adornos */

/** Línea de separación dentro de una tarjeta. */
export const RAYA = "border-top:1px solid var(--border);";

/**
 * Cabecera de tarjeta: rótulo a la izquierda, acción a la derecha, y una línea
 * por debajo sólo si lo que sigue lo pide. Se usa igual en las siete secciones
 * para que todas empiecen de la misma manera.
 */
export const FILA_TITULO = "display:flex;align-items:baseline;gap:var(--s3);flex-wrap:wrap;";

/** Botón de texto de la esquina: «Abrir», «Ver todos». */
export const ENLACE =
  "margin-left:auto;background:none;border:none;padding:0;cursor:pointer;font-size:var(--t-mini);font-weight:590;color:var(--gold);";

/** Punto de color que marca a qué pertenece una fila. */
export const punto = (color: string) => "width:7px;height:7px;border-radius:50%;flex:none;background:" + color + ";";
