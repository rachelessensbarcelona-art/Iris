/** Trunca un texto en el último espacio antes de `n` caracteres y añade "…". */
export function recorta(t: string | undefined | null, n: number): string {
  if (!t) return "";
  if (t.length <= n) return t;
  const corte = t.slice(0, n);
  const i = corte.lastIndexOf(" ");
  return corte.slice(0, i > 0 ? i : n) + "…";
}

export function chipStyle(color: string): string {
  return (
    "background:rgba(255,255,255,.03);border:1px solid " +
    color +
    "55;color:" +
    color +
    ";border-radius:3px;padding:6px 12px;font-size:10px;letter-spacing:.16em;text-transform:uppercase;cursor:pointer;transition:all .2s;"
  );
}

const MESES = ["enero", "febrero", "marzo", "abril", "mayo", "junio", "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre"];
export function fechaLarga(dia: number, mes: number, anio: number): string {
  return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}
