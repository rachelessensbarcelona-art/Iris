/** Trunca un texto en el último espacio antes de `n` caracteres y añade "…". */
export function recorta(t: string | undefined | null, n: number): string {
  if (!t) return "";
  if (t.length <= n) return t;
  const corte = t.slice(0, n);
  const i = corte.lastIndexOf(" ");
  return corte.slice(0, i > 0 ? i : n) + "…";
}

/**
 * Chip tipo iOS: pastilla blanca, texto en color y borde teñido del mismo
 * color. El borde se calcula con color-mix en vez de pegar un "55" al final
 * del color, que sólo funciona si el color es un hexadecimal literal — y
 * aquí llegan también variables CSS.
 */
export function chipStyle(color: string): string {
  return (
    // El fondo va tomado del color propio del chip sobre la superficie del
    // tema. En blanco fijo, en modo oscuro quedaba una pastilla clara con la
    // letra clara encima y no se leía nada.
    "display:inline-flex;align-items:center;background:color-mix(in srgb, " +
    color +
    " 10%, var(--surface-solid));" +
    "border:1px solid color-mix(in srgb, " +
    color +
    " 32%, transparent);color:" +
    color +
    ";border-radius:999px;padding:7px 14px;font-family:var(--font-ui);font-size:12px;font-weight:500;" +
    "letter-spacing:0;text-transform:none;cursor:pointer;box-shadow:var(--shadow-sm);"
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
