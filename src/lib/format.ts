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
    "display:inline-flex;align-items:center;background:rgba(255,255,255,.8);" +
    "border:1px solid color-mix(in srgb, " +
    color +
    " 32%, transparent);color:" +
    color +
    ";border-radius:999px;padding:7px 14px;font-family:var(--font-ui);font-size:12px;font-weight:500;" +
    "letter-spacing:0;text-transform:none;cursor:pointer;box-shadow:var(--shadow-sm);"
  );
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function fechaLarga(dia: number, mes: number, anio: number): string {
  return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}
