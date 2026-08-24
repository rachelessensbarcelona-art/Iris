/** Trunca un texto en el último espacio antes de `n` caracteres y añade "…". */
export function recorta(t: string | undefined | null, n: number): string {
  if (!t) return "";
  if (t.length <= n) return t;
  const corte = t.slice(0, n);
  const i = corte.lastIndexOf(" ");
  return corte.slice(0, i > 0 ? i : n) + "…";
}

/**
 * Chip tipo iOS. Van cuatro o cinco al pie de cada bloque, así que son la
 * pieza que más se repite en toda la plataforma: si cada uno lleva su color de
 * fondo, su borde teñido y su sombra, el pie de la tarjeta pesa más que el
 * texto que hay encima.
 *
 * Ahora la pastilla es siempre la misma — gris muy suave, sin borde ni sombra —
 * y del color sólo queda la letra. Se sigue distinguiendo qué chip es cuál y el
 * conjunto deja de competir con la lectura.
 */
export function chipStyle(color: string): string {
  return (
    "display:inline-flex;align-items:center;background:color-mix(in srgb, var(--text) 5%, transparent);" +
    "border:none;color:" +
    color +
    ";border-radius:999px;padding:7px 13px;font-family:var(--font-ui);font-size:var(--t-mini);font-weight:590;" +
    "letter-spacing:-.005em;text-transform:none;cursor:pointer;"
  );
}

/* Los apuntes vienen escritos en mayúsculas de máquina de escribir. En pantalla
 * pedían caja normal, así que se convierten al vuelo; el dato original no se
 * toca, sólo cómo se muestra. */
const MINUSCULAS = new Set(["de", "del", "la", "las", "el", "los", "y", "en", "a", "con", "sin", "por", "para", "un", "una", "al", "o", "u"]);

/** "EL ERMITAÑO" → "El Ermitaño". Respeta un texto que ya venga en caja mixta. */
export function titulo(t: string | undefined | null): string {
  if (!t) return "";
  if (t !== t.toLocaleUpperCase("es")) return t;
  return t
    .toLocaleLowerCase("es")
    .split(/(\s+)/)
    .map((p, i) => (i > 0 && MINUSCULAS.has(p) ? p : p.replace(/^[a-záéíóúüñ]/, (c) => c.toLocaleUpperCase("es"))))
    .join("");
}

/** "CAMINO CONSCIENTE DE META" → "Camino consciente de meta". */
export function frase(t: string | undefined | null): string {
  if (!t) return "";
  if (t !== t.toLocaleUpperCase("es")) return t;
  const b = t.toLocaleLowerCase("es");
  return b.replace(/^[a-záéíóúüñ]/, (c) => c.toLocaleUpperCase("es"));
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function fechaLarga(dia: number, mes: number, anio: number): string {
  return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}

/**
 * Cierra un texto que viene cortado a media frase.
 *
 * Treinta y tres de los textos del diccionario se quedaron a medias al
 * extraerlos de los manuales — «…se puede comparar con un» y ahí acaba. En el
 * panel se nota poco, pero en el documento que se entrega al cliente una frase
 * que muere a media palabra queda fatal. Aquí se retrocede hasta el último
 * punto, y sólo si lo que queda sigue siendo el grueso del texto; si el corte
 * viene de tan atrás que apenas quedaría nada, se deja como está con puntos
 * suspensivos, que al menos se lee como algo pendiente y no como un error.
 *
 * Esto tapa el síntoma: los textos hay que completarlos en el diccionario.
 */
/** Cierra con punto lo que no lo trae. Los nombres y lemas de los apuntes
 *  vienen unos con punto final y otros sin él; sin normalizarlo, al pegarlos a
 *  otra frase salen «El Carro. la dirección» o «La profesión.. No son». */
export function punto(t: string | undefined | null): string {
  const s = (t || "").trim();
  return !s || /[.!?…]$/.test(s) ? s : s + ".";
}
/** Y al revés, para lo que va dentro de una enumeración. */
export function sinPunto(t: string | undefined | null): string {
  return (t || "").trim().replace(/\.+$/, "");
}

export function cierraFrase(t: string | undefined | null): string {
  const s = (t || "").trim();
  if (!s || /[.!?…»"')\]]$/.test(s)) return s;
  const i = Math.max(s.lastIndexOf("."), s.lastIndexOf("!"), s.lastIndexOf("?"));
  return i > 0 && i > s.length * 0.6 ? s.slice(0, i + 1) : s + "…";
}
