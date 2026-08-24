// Motor de cálculo — Escuela de Sabiduría 33
// Portado 1:1 desde engine.js (Claude Design). Todas las fórmulas provienen de
// los manuales de Kábala aportados. Verificado contra los ejemplos: Roberto
// López Castro (19/07/1951) y Lara María Soares Campos.
import { KDATA, type NumeroFicha, type ArcanoData } from "./kdata";

export type Fecha = { dia: number; mes: number; anio: number };
/** Cómo se dirige el documento a la persona. No entra en ningún cálculo: sólo
 *  decide si el estudio dice «bienvenida» o «bienvenido». */
export type Genero = "f" | "m" | "n";

export type Entrada = {
  nombre: string;
  apellido1: string;
  apellido2: string;
  dia: number;
  mes: number;
  anio: number;
  anioUniversal: number;
  genero?: Genero;
  /** Persona o empresa. No entra en ningún cálculo —los números salen igual—
   *  pero el estudio se redacta distinto: una empresa no nace, se constituye. */
  tipo?: "persona" | "empresa";
};

function digits(str: string | number): number[] {
  return String(str)
    .split("")
    .filter((c) => c >= "0" && c <= "9")
    .map(Number);
}
function sumDigits(x: string | number): number {
  return digits(x).reduce((a, b) => a + b, 0);
}
function reduceOnce(x: number): number {
  return sumDigits(x);
}
function reduceTo(x: number, max: number): number {
  let n = x;
  let guard = 0;
  while (n > max && guard++ < 12) n = sumDigits(n);
  return n;
}
function normalizaNombre(s: string): string {
  return (s || "")
    .toUpperCase()
    .replace(/[^A-ZÁÉÍÓÚÜÑÄÖ\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}
const VOCALES = "AEIOUÁÉÍÓÚÄÖÜ";

export type Letra = { g: string; v: number };
function letrasDe(palabra: string): Letra[] {
  const T = KDATA.letras;
  const out: Letra[] = [];
  let i = 0;
  while (i < palabra.length) {
    const t3 = palabra.substr(i, 3),
      t2 = palabra.substr(i, 2),
      t1 = palabra.substr(i, 1);
    if (T[t3] !== undefined) {
      out.push({ g: t3, v: T[t3] });
      i += 3;
    } else if (T[t2] !== undefined) {
      out.push({ g: t2, v: T[t2] });
      i += 2;
    } else if (T[t1] !== undefined) {
      out.push({ g: t1, v: T[t1] });
      i += 1;
    } else {
      i += 1;
    }
  }
  return out;
}
export function esVocal(g: string): boolean {
  return g.length === 1 && VOCALES.indexOf(g) >= 0;
}

export type PalabraAnalizada = { palabra: string; letras: Letra[]; total: number };
export type NombreAnalizado = {
  texto: string;
  palabras: PalabraAnalizada[];
  total: number;
  esencia: number;
  ego: number;
  vocales: Letra[];
  consonantes: Letra[];
};

export function analizaNombre(nombreCompleto: string): NombreAnalizado {
  const limpio = normalizaNombre(nombreCompleto);
  const palabras = limpio ? limpio.split(" ") : [];
  const detalle: PalabraAnalizada[] = palabras.map((p) => {
    const ls = letrasDe(p);
    return { palabra: p, letras: ls, total: ls.reduce((a, b) => a + b.v, 0) };
  });
  const todas = detalle.reduce<Letra[]>((a, d) => a.concat(d.letras), []);
  const total = todas.reduce((a, b) => a + b.v, 0);
  const vocales = todas.filter((l) => esVocal(l.g));
  const consonantes = todas.filter((l) => !esVocal(l.g));
  return {
    texto: limpio,
    palabras: detalle,
    total,
    esencia: vocales.reduce((a, b) => a + b.v, 0),
    ego: consonantes.reduce((a, b) => a + b.v, 0),
    vocales,
    consonantes,
  };
}

type ArcanoCalc = { total: number; sumaCifras: number; resta: number; division: number; mas1: number; arcano: number };
export function arcanoDesde(total: number): ArcanoCalc {
  const s = reduceOnce(total);
  const resta = total - s;
  const division = resta / 9;
  const mas1 = division + 1;
  const arc = reduceTo(mas1, 21);
  return { total, sumaCifras: s, resta, division, mas1, arcano: arc };
}

function fechaSuma(f: Fecha): number {
  return sumDigits(f.dia) + sumDigits(f.mes) + sumDigits(f.anio);
}

function convierteDigitos(str: string | number, mapa: Record<string, string>): string {
  return String(str)
    .split("")
    .map((c) => (mapa[c] !== undefined ? mapa[c] : c))
    .join("");
}
const MAPA_ESTRUCTURA: Record<string, string> = { "0": "7", "1": "6", "2": "5" };
const MAPA_ALMA: Record<string, string> = { "1": "7", "2": "8", "3": "9" };

type PiezasFecha = { dia: string; mes: string; siglo: string; anioCorto: string; anio: string };
function piezasFecha(f: Fecha, mapa: Record<string, string>): PiezasFecha {
  const dia = convierteDigitos(String(f.dia), mapa);
  const mes = convierteDigitos(String(f.mes), mapa);
  const anioStr = String(f.anio);
  const siglo = convierteDigitos(anioStr.slice(0, 2), mapa);
  const corto = convierteDigitos(anioStr.slice(2), mapa);
  return { dia, mes, siglo, anioCorto: corto, anio: siglo + corto };
}
function cifrasSinSiglo(p: PiezasFecha): number[] {
  let out: number[] = [];
  [p.dia, p.mes, p.anioCorto].forEach((chunk) => {
    const s = String(chunk).replace(/^0+/, "");
    out = out.concat(digits(s));
  });
  return out;
}
function sumaConSiglo(p: PiezasFecha): number {
  return sumDigits(p.dia) + sumDigits(p.mes) + sumDigits(p.anio);
}

export type Estructura = {
  fechaConvertida: PiezasFecha;
  suma: number;
  pasos: number[];
  tipo: number;
  dinamicos: Record<number, number>;
  cifras: number[];
  aprendizajes: Record<number, number>;
  escudos: Record<number, number>;
  /** Portales sin aprendizaje: en los apuntes, las maestrías. */
  maestrias: number[];
};
function estructuraEnergetica(f: Fecha): Estructura {
  const p = piezasFecha(f, MAPA_ESTRUCTURA);
  const suma = sumaConSiglo(p);
  const pasos = [suma];
  let n = suma,
    guard = 0;
  while (n > 10 && guard++ < 10) {
    n = sumDigits(n);
    pasos.push(n);
  }
  const tipo = n;
  const dinamicos: Record<number, number> = {};
  for (let i = 0; i < 10; i++) dinamicos[i + 1] = (tipo + i) % 10;
  const cifras = cifrasSinSiglo(p);
  const aprend: Record<number, number> = {};
  cifras.forEach((d) => {
    for (let portal = 1; portal <= 10; portal++) if (dinamicos[portal] === d) aprend[portal] = (aprend[portal] || 0) + 1;
  });
  // El escudo cae tres portales más allá del que tiene el aprendizaje, y la
  // cuenta se hace sobre la cifra rotulada, no sobre el índice: el portal 10
  // se escribe 0, así que 10 → 0+3 = 3. Comprobado contra la ficha resuelta de
  // MARIA IRIS SOARES CAMPOS (24/2/1983): aprendizajes en 1, 2, 5 y 10 dan
  // escudos en 4, 5, 8 y 3.
  const escudos: Record<number, number> = {};
  Object.keys(aprend).forEach((portal) => {
    const cifra = (+portal % 10) + 3;
    const e = cifra % 10 === 0 ? 10 : cifra % 10;
    escudos[e] = (escudos[e] || 0) + aprend[+portal];
  });
  // Los portales sin aprendizaje ya vienen resueltos de otras vidas: en los
  // apuntes se llaman maestrías.
  const maestrias: number[] = [];
  for (let portal = 1; portal <= 10; portal++) if (!aprend[portal]) maestrias.push(portal);
  return { fechaConvertida: p, suma, pasos, tipo, dinamicos, cifras, aprendizajes: aprend, escudos, maestrias };
}

export type ImagenAlma = {
  fechaConvertida: PiezasFecha;
  suma: number;
  pasos: number[];
  numero: number;
  moviles: Record<number, number>;
  cifras: number[];
  bloqueos: Record<number, number>;
  ayudas: Record<number, number>;
  proyeccion: number | null;
};
function imagenDelAlma(f: Fecha): ImagenAlma {
  const p = piezasFecha(f, MAPA_ALMA);
  const suma = sumaConSiglo(p);
  const pasos = [suma];
  let n = suma,
    guard = 0;
  while (n > 10 && guard++ < 10) {
    n = sumDigits(n);
    pasos.push(n);
  }
  const numero = n;
  const moviles: Record<number, number> = {};
  for (let i = 0; i < 10; i++) moviles[i + 1] = (numero + i) % 10;
  const cifras = cifrasSinSiglo(p);
  const bloqueos: Record<number, number> = {};
  cifras.forEach((d) => {
    const c = d === 0 ? 10 : d;
    bloqueos[c] = (bloqueos[c] || 0) + 1;
  });
  const ayudas: Record<number, number> = {};
  cifras.forEach((d) => {
    for (let c = 1; c <= 10; c++) if (moviles[c] === d) ayudas[c] = (ayudas[c] || 0) + 1;
  });
  let proyeccion: number | null = null;
  for (let c2 = 1; c2 <= 10; c2++) if (moviles[c2] === 0) proyeccion = c2;
  return { fechaConvertida: p, suma, pasos, numero, moviles, cifras, bloqueos, ayudas, proyeccion };
}

const PAR: Record<string, string> = { "0": "5", "5": "0", "1": "6", "6": "1", "2": "7", "7": "2", "3": "8", "8": "3", "4": "9", "9": "4" };
export function tensionDe(n: number): number {
  const s = String(n);
  let out = "";
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (c === "5" && i === 0) out += "10";
    else out += PAR[c];
  }
  return parseInt(out, 10);
}
export function liberacionDe(n: number): number {
  return n + tensionDe(n);
}

export type Ficha = {
  n: number;
  titulo: string;
  texto: string;
  atlante?: string;
  T: number | null;
  L: number | null;
  C?: number;
  P?: number;
  R?: number;
  enDiccionario: boolean;
  partes: Ficha[];
};
export function ficha(n: number | null | undefined): Ficha | null {
  if (n === null || n === undefined || Number.isNaN(n)) return null;
  const dict = KDATA.numeros || {};
  const e = dict[n];
  if (e) {
    const refs = e.refs || {};
    return {
      n,
      titulo: e.titulo,
      texto: e.texto,
      atlante: e.atlante,
      T: refs.T !== undefined ? refs.T : tensionDe(n),
      L: refs.L !== undefined ? refs.L : liberacionDe(n),
      C: refs.C,
      P: refs.P,
      R: refs.R,
      enDiccionario: true,
      partes: [],
    };
  }
  const s = String(n);
  let partes: number[] = [];
  if (s.length === 3) partes = [parseInt(s.slice(1), 10), parseInt(s.slice(0, 2), 10)];
  else if (s.length > 3) partes = [parseInt(s.slice(-2), 10), parseInt(s.slice(0, 2), 10)];
  return {
    n,
    titulo: "",
    texto: "",
    atlante: "",
    enDiccionario: false,
    T: null,
    L: null,
    partes: partes.filter((p) => dict[p]).map((p) => ficha(p) as Ficha),
  };
}

export function lectura(n: number): { positivo: string; negativo: string } {
  const t = KDATA.numerologia || {};
  const vistos: Record<number, boolean> = {};
  const pos: string[] = [],
    neg: string[] = [];
  digits(n).forEach((d) => {
    if (vistos[d]) return;
    vistos[d] = true;
    if (t[d]) {
      pos.push(t[d].pos);
      neg.push(t[d].neg);
    }
  });
  return { positivo: pos.join(" "), negativo: neg.join(" ") };
}

export type Cuentas = {
  espiritu: { dia: number; mes: number; anio: number; total: number };
  alma: { dia: number; mes: number; anio: number; total: number };
  cuerpo: { dia: number; mes: number; anio: number; total: number };
  potenciales: number[];
  cuentas: number[];
  karmico: number;
  lemaDeVida: number;
  tensionKarmico: number;
  /** false si el kármico no figura en los apuntes y hubo que calcularlo. */
  lemaEnApuntes: boolean;
};
function cuentasAbiertas(f: Fecha): Cuentas {
  const anioCorto = String(f.anio).slice(2);
  function fila(dia: number | string, mes: number | string, anio: number | string) {
    const a = sumDigits(dia),
      b = sumDigits(mes),
      c = sumDigits(anio);
    return { dia: a, mes: b, anio: c, total: a + b + c };
  }
  const E = fila(f.dia, f.mes, anioCorto);
  const pA = piezasFecha(f, MAPA_ALMA),
    pC = piezasFecha(f, MAPA_ESTRUCTURA);
  const A = fila(pA.dia, pA.mes, pA.anioCorto);
  const C = fila(pC.dia, pC.mes, pC.anioCorto);
  const potenciales = [E.dia + A.dia + C.dia, E.mes + A.mes + C.mes, E.anio + A.anio + C.anio];
  const karmico = E.total + A.total + C.total;
  return {
    espiritu: E,
    alma: A,
    cuerpo: C,
    potenciales,
    cuentas: [E.total, A.total, C.total],
    karmico,
    ...lemaDe(karmico),
  };
}

/**
 * Lema de vida: el número de liberación del kármico tal y como figura en los
 * apuntes, no el que sale de aplicar la regla de tensión cifra a cifra. Para
 * números sin ceros las dos vías coinciden (91 → 137, 81 → 117), pero con un
 * 0 de por medio no: los apuntes dan 102 → 159, y la regla daría 759, porque
 * los ejes de tensión (§31) no definen pareja para el 0.
 */
function lemaDe(karmico: number): { lemaDeVida: number; tensionKarmico: number; lemaEnApuntes: boolean } {
  const f = ficha(karmico);
  const enApuntes = !!f && f.enDiccionario && f.L !== null && f.L !== undefined;
  const lemaDeVida = enApuntes ? (f!.L as number) : liberacionDe(karmico);
  return { lemaDeVida, tensionKarmico: lemaDeVida - karmico, lemaEnApuntes: enApuntes };
}

export type Vibraciones = { cuerpo: number; alma: number; espiritu: number; efectoSanador: number };
function vibraciones(f: Fecha): Vibraciones {
  const pC = piezasFecha(f, MAPA_ESTRUCTURA),
    pA = piezasFecha(f, MAPA_ALMA);
  const cuerpo = sumaConSiglo(pC),
    alma = sumaConSiglo(pA),
    espiritu = fechaSuma(f);
  return { cuerpo, alma, espiritu, efectoSanador: cuerpo + alma + espiritu };
}

export type Afinidad = { diaMes: number; mesAnio: number };
function afinidad(f: Fecha): Afinidad {
  const anioCorto = parseInt(String(f.anio).slice(2), 10);
  return { diaMes: Number(f.dia) + Number(f.mes), mesAnio: Number(f.mes) + anioCorto };
}

export type CiclosVitales = {
  proposito: number;
  propositoBruto: number;
  diaR: number;
  mesR: number;
  anioR: number;
  ciclos: Array<{ nombre: string; numero: number; desde: number; hasta: number | null }>;
  realizaciones: Array<{ n: number; valor: number; desde: number; hasta: number | null }>;
  desafios: Array<{ n: number; valor: number; etiqueta: string; rango: string }>;
  anioUniversal: number;
  anioPersonal: number;
  edad: number;
  etapas: Array<{ n: number; desde: number; hasta: number }>;
  etapaActual: number;
};
function ciclosVitales(f: Fecha, anioUniversal?: number): CiclosVitales {
  const diaR = reduceTo(f.dia, 9),
    mesR = reduceTo(f.mes, 9);
  const anioSum = sumDigits(f.anio),
    anioR = reduceTo(anioSum, 9);
  const propositoBruto = diaR + mesR + anioR;
  const proposito = reduceTo(propositoBruto, 9);
  const finFormacion = 36 - proposito;
  const r1 = reduceTo(mesR + diaR, 9);
  const r2 = reduceTo(diaR + anioR, 9);
  const r3 = reduceTo(r1 + r2, 9);
  const r4 = reduceTo(mesR + anioR, 9);
  const d1 = Math.abs(mesR - diaR),
    d2 = Math.abs(diaR - anioR),
    d3 = Math.abs(d1 - d2);
  const au = anioUniversal || new Date().getFullYear();
  const anioPersonal = reduceTo(Number(f.dia) + Number(f.mes) + au, 9);
  // Las nueve etapas de nueve años de los manuales: la 1 va del nacimiento a
  // los 8, la 2 de los 9 a los 17, y así hasta la 9 (72 a 80).
  const edad = Math.max(0, au - Number(f.anio));
  const etapas = Array.from({ length: 9 }, (_, i) => ({ n: i + 1, desde: i * 9, hasta: (i + 1) * 9 - 1 }));
  const etapaActual = Math.min(9, Math.floor(edad / 9) + 1);
  return {
    proposito,
    propositoBruto,
    diaR,
    mesR,
    anioR,
    ciclos: [
      { nombre: "Formación", numero: mesR, desde: 0, hasta: finFormacion },
      { nombre: "Evolución", numero: diaR, desde: finFormacion, hasta: finFormacion + 18 },
      { nombre: "Cosecha", numero: anioR, desde: finFormacion + 18, hasta: null },
    ],
    realizaciones: [
      { n: 1, valor: r1, desde: 0, hasta: finFormacion },
      { n: 2, valor: r2, desde: finFormacion, hasta: finFormacion + 9 },
      { n: 3, valor: r3, desde: finFormacion + 9, hasta: finFormacion + 18 },
      { n: 4, valor: r4, desde: finFormacion + 18, hasta: null },
    ],
    desafios: [
      { n: 1, valor: d1, etiqueta: "Primer desafío menor", rango: "hasta los 42 años aprox." },
      { n: 2, valor: d2, etiqueta: "Segundo desafío menor", rango: "de los 42 años en adelante" },
      { n: 3, valor: d3, etiqueta: "Desafío mayor", rango: "toda la vida" },
    ],
    anioUniversal: au,
    anioPersonal,
    edad,
    etapas,
    etapaActual,
  };
}

export type Turbulencias = { lista: Array<{ tipo: string; causa: string; texto: string }>; desde: number; hasta: number } | null;
function turbulencias(f: Fecha, edadCambio: number): Turbulencias {
  const t: Array<{ tipo: string; causa: string; texto: string }> = [];
  const dia = Number(f.dia),
    mes = Number(f.mes),
    anio = Number(f.anio);
  if (dia % 10 === 0)
    t.push({
      tipo: "Espíritu",
      causa: "día acabado en 0 (" + dia + ")",
      texto: "En la vida pasada no hubo conciencia de la unidad; desconexión del sentido de la existencia. En esta vida, diez años centrados en una crisis existencial o espiritual para encontrar el sentido a la vida y volver a la unidad.",
    });
  if (mes % 10 === 0)
    t.push({
      tipo: "Alma",
      causa: "mes acabado en 0 (" + mes + ")",
      texto: "En la vida pasada hubo demasiado juego de máscaras buscando la aceptación social. En esta vida, una década de crisis de identidad: ¿quién soy yo? Una noche oscura del alma para volver a la búsqueda auténtica de la propia identidad.",
    });
  if (anio % 10 === 0)
    t.push({
      tipo: "Materia",
      causa: "año acabado en 0 (" + anio + ")",
      texto: "En la vida pasada hubo atrapamiento en los miedos de la materia: la seguridad económica como fin en sí mismo. Diez años para revisar el enfoque racional y pragmático de la materia.",
    });
  if (!t.length) return null;
  return { lista: t, desde: edadCambio, hasta: edadCambio + 10 };
}

function diasDeFuerza(totalNombre: number): { primeraSuma: number; base: number; dias: number[] } {
  // En la ficha se anota primero la suma de las cifras del nombre (269 → 17) y
  // de ahí salen los días. El número base tiene que quedar reducido a una sola
  // cifra: con una única pasada, un nombre como 179 daba 17, y ningún día del
  // mes suma 17 (el máximo es 29 → 11), así que la lista salía vacía y el
  // estudio imprimía "el día undefined". Se guardan los dos para poder
  // enseñar la cuenta como está escrita a mano.
  const primeraSuma = reduceOnce(totalNombre);
  const base = reduceTo(totalNombre, 9);
  const dias: number[] = [];
  for (let d = 1; d <= 31; d++) if (sumDigits(d) === base) dias.push(d);
  return { primeraSuma, base, dias };
}

export type Aprendizaje = {
  portal: number;
  veces: number;
  numero: number;
  ficha: Ficha | null;
  tarea?: { nombre: string; texto: string; hiloRojo: string; neurosis: string; sanador: string };
  enfermedades?: { psico?: string; organos?: string; fisicas?: string; nota?: string };
};
export type Bloqueo = {
  casilla: number;
  veces: number;
  numero: number;
  ficha: Ficha | null;
  plano?: { nombre: string; texto: string } | null;
};

export type Resultado = {
  entrada: Entrada;
  fecha: Fecha;
  nombre: NombreAnalizado;
  /** Valor del nombre: la suma de sus letras, sin la edad de cambio. */
  valorNombre: number;
  corazon: { valor: number; ficha: Ficha | null; lectura: { positivo: string; negativo: string } };
  esencia: { valor: number; ficha: Ficha | null; lectura: { positivo: string; negativo: string } };
  ego: { valor: number; ficha: Ficha | null; lectura: { positivo: string; negativo: string } };
  diasFuerza: { primeraSuma: number; base: number; dias: number[] };
  caminos: {
    origen: { calculo: ArcanoCalc; arcano: number; carta?: ArcanoData };
    transformacion: { calculo: { total: number; arcano: number }; arcano: number; carta?: ArcanoData };
    destino: { calculo: ArcanoCalc; arcano: number; carta?: ArcanoData };
    edadCambio: number;
  };
  turbulencias: Turbulencias;
  estructura: Estructura;
  tipoEstructura?: { texto: string; negativo: string; positivo: string };
  aprendizajes: Aprendizaje[];
  ejes: Array<{ eje: { nombre: string; a: number; b: number }; activo: boolean; parcial: boolean }>;
  planosTension: Array<{ plano: { nombre: string; a: number; b: number }; activo: boolean }>;
  imagenAlma: ImagenAlma;
  bloqueos: Bloqueo[];
  cuentas: Cuentas;
  cuentasFichas: { karmico: Ficha | null; lema: Ficha | null };
  vibraciones: Vibraciones;
  efectoSanadorFicha: Ficha | null;
  afinidad: Afinidad;
  ciclos: CiclosVitales;
};

export function calcula(entrada: Entrada): Resultado {
  const f: Fecha = { dia: Number(entrada.dia), mes: Number(entrada.mes), anio: Number(entrada.anio) };
  const nombre = analizaNombre([entrada.nombre, entrada.apellido1, entrada.apellido2].filter(Boolean).join(" "));

  // Ojo con los nombres: en la ficha de trabajo el número grande del nombre
  // (aquí 269) es el "valor del nombre", y el "Nº de corazón" es ese valor más
  // la edad de cambio (269 + 29 = 298). El camino de origen y los días de
  // fuerza salen del valor del nombre; el de destino, del corazón.
  const valorNombre = nombre.total;
  const origen = arcanoDesde(valorNombre);
  const edadCambio = fechaSuma(f);
  const transformacion = { total: edadCambio, arcano: reduceTo(edadCambio, 21) };
  const corazon = valorNombre + edadCambio;
  const destino = arcanoDesde(corazon);

  const est = estructuraEnergetica(f);
  const ia = imagenDelAlma(f);
  const ca = cuentasAbiertas(f);
  const vib = vibraciones(f);

  const aprendizajes: Aprendizaje[] = Object.keys(est.aprendizajes)
    .map(Number)
    .sort((a, b) => a - b)
    .map((portal) => {
      const num = portal * 10 + est.dinamicos[portal];
      return {
        portal,
        veces: est.aprendizajes[portal],
        numero: num,
        ficha: ficha(num),
        tarea: (KDATA.tareas || {})[portal],
        enfermedades: (KDATA.enfermedades || {})[portal],
      };
    });
  const bloqueos: Bloqueo[] = Object.keys(ia.bloqueos)
    .map(Number)
    .sort((a, b) => a - b)
    .map((casilla) => {
      const num = casilla * 10 + ia.moviles[casilla];
      return {
        casilla,
        veces: ia.bloqueos[casilla],
        numero: num,
        ficha: ficha(num),
        plano: KDATA.planos_conciencia?.planos ? KDATA.planos_conciencia.planos[casilla] : null,
      };
    });

  const conAprendizaje = (p: number) => !!est.aprendizajes[p];
  const ejes = (KDATA.ejes || []).map((e) => ({ eje: e, activo: conAprendizaje(e.a) && conAprendizaje(e.b), parcial: conAprendizaje(e.a) !== conAprendizaje(e.b) }));
  const planosT = (KDATA.planosTension || []).map((e) => ({ plano: e, activo: conAprendizaje(e.a) && conAprendizaje(e.b) }));

  return {
    entrada,
    fecha: f,
    nombre,
    valorNombre,
    corazon: { valor: corazon, ficha: ficha(corazon), lectura: lectura(corazon) },
    esencia: { valor: nombre.esencia, ficha: ficha(nombre.esencia), lectura: lectura(nombre.esencia) },
    ego: { valor: nombre.ego, ficha: ficha(nombre.ego), lectura: lectura(nombre.ego) },
    diasFuerza: diasDeFuerza(valorNombre),
    caminos: {
      origen: { calculo: origen, arcano: origen.arcano, carta: (KDATA.arcanos || {})[origen.arcano] },
      transformacion: { calculo: transformacion, arcano: transformacion.arcano, carta: (KDATA.arcanos || {})[transformacion.arcano] },
      destino: { calculo: destino, arcano: destino.arcano, carta: (KDATA.arcanos || {})[destino.arcano] },
      edadCambio,
    },
    turbulencias: turbulencias(f, edadCambio),
    estructura: est,
    tipoEstructura: (KDATA.estructuras || {})[est.tipo],
    aprendizajes,
    ejes,
    planosTension: planosT,
    imagenAlma: ia,
    bloqueos,
    cuentas: ca,
    cuentasFichas: { karmico: ficha(ca.karmico), lema: ficha(ca.lemaDeVida) },
    vibraciones: vib,
    efectoSanadorFicha: ficha(vib.efectoSanador),
    afinidad: afinidad(f),
    ciclos: ciclosVitales(f, entrada.anioUniversal),
  };
}

export type Coincidencia = { tipo: string; valor: number; texto: string };
export type Comparativa = {
  caminoConjunto: number;
  cartaConjunta?: ArcanoData;
  mismaEstructura: boolean;
  textoEstructura: string;
  portalesComunes: number[];
  planosComunes: number[];
  coincidencias: Coincidencia[];
  afinidadIgual: boolean;
};
export function comparaPareja(a: Resultado, b: Resultado): Comparativa {
  const conjunto = reduceTo(reduceOnce(a.corazon.valor + b.corazon.valor), 21);
  const coincidencias: Coincidencia[] = [];
  const ca = a.cuentas,
    cb = b.cuentas;
  const P = KDATA.parejas;
  ca.cuentas.forEach((x) => {
    if (cb.cuentas.indexOf(x) >= 0) coincidencias.push({ tipo: "cuenta", valor: x, texto: P.cuentas.mismaCuenta });
  });
  ca.potenciales.forEach((x) => {
    if (cb.potenciales.indexOf(x) >= 0) coincidencias.push({ tipo: "potencial", valor: x, texto: P.cuentas.mismoPotencial });
  });
  ca.cuentas.forEach((x) => {
    if (cb.potenciales.indexOf(x) >= 0) coincidencias.push({ tipo: "cruzado", valor: x, texto: P.cuentas.cruzado });
  });
  cb.cuentas.forEach((x) => {
    if (ca.potenciales.indexOf(x) >= 0) coincidencias.push({ tipo: "cruzado", valor: x, texto: P.cuentas.cruzado });
  });
  const afinIgual = a.afinidad.diaMes === b.afinidad.diaMes || a.afinidad.mesAnio === b.afinidad.mesAnio;
  const portalesComunes = Object.keys(a.estructura.aprendizajes)
    .filter((p) => b.estructura.aprendizajes[+p])
    .map(Number);
  const planosComunes = Object.keys(a.imagenAlma.bloqueos)
    .filter((c) => b.imagenAlma.bloqueos[+c])
    .map(Number);
  return {
    caminoConjunto: conjunto,
    cartaConjunta: (KDATA.arcanos || {})[conjunto],
    mismaEstructura: a.estructura.tipo === b.estructura.tipo,
    textoEstructura: a.estructura.tipo === b.estructura.tipo ? P.estructuras.iguales : P.estructuras.distintas,
    portalesComunes,
    planosComunes,
    coincidencias,
    afinidadIgual: afinIgual,
  };
}

export { sumDigits, reduceTo, letrasDe };
export type { NumeroFicha };
