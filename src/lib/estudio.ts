// Construye el contenido del Estudio (documento largo, 14–28 páginas según el
// contenido de cada persona). A diferencia del prototipo de Claude Design —que
// recortaba los textos para encajarlos en 14 páginas fijas—, aquí no se trunca
// nada: el motor de paginación de impresión del navegador reparte el
// contenido íntegro en tantas páginas como haga falta.
import type { Resultado } from "./engine";
import { ficha } from "./engine";
import { refItems, type RefItem } from "./chips";
import { CAMINO_EVOLUTIVO, KDATA } from "./kdata";
import { COL } from "./tree";

export type Bloque =
  | { tipo: "h"; texto: string }
  | { tipo: "lead"; editId: string; textoDef: string }
  | { tipo: "p"; editId: string; textoDef: string }
  | { tipo: "dato"; editId: string; label: string; valor: string | number; textoDef: string }
  | { tipo: "polos"; editIdNeg: string; editIdPos: string; negDef: string; posDef: string }
  | { tipo: "refs"; items: RefItem[] }
  | { tipo: "arbol" }
  | { tipo: "estructura" }
  | { tipo: "alma" }
  | { tipo: "cuentas" }
  | { tipo: "ciclos" }
  | { tipo: "cita"; texto: string };

export type Capitulo = { id: string; kicker: string; titulo: string; seccion: string; bloques: Bloque[] };

/**
 * Los apuntes traen intercaladas las claves de trabajo de la escuela —
 * "2/33-3/22-6/11-M15-M51-C11-T11-L77-P313" y parecidas: divisores, corazón,
 * tensión, liberación, potencial. A Iris le sirven; al cliente que recibe su
 * lectura no le dicen nada y le ensucian la página. Se quitan de todo lo que
 * entra en el documento — en el panel siguen, que es su mesa de trabajo.
 */
const CLAVES = /(?:\d+\/\d+|[A-ZÁÉÍÓÚ]\d+)(?:\s*[-–]\s*(?:\d+\/\d+|[A-ZÁÉÍÓÚ]\d+))+\.?/g;
export function paraCliente(t: string): string {
  return t
    .replace(CLAVES, "")
    .replace(/\s{2,}/g, " ")
    .replace(/\s+([,.;:])/g, "$1")
    .trim();
}

function bH(texto: string): Bloque {
  return { tipo: "h", texto: paraCliente(texto) };
}
function bP(editId: string, textoDef: string): Bloque {
  return { tipo: "p", editId, textoDef: paraCliente(textoDef) };
}
function bLead(editId: string, textoDef: string): Bloque {
  return { tipo: "lead", editId, textoDef: paraCliente(textoDef) };
}
function bDato(editId: string, label: string, valor: string | number, textoDef: string): Bloque {
  return { tipo: "dato", editId, label, valor, textoDef: paraCliente(textoDef) };
}
function bPolos(editId: string, negDef: string, posDef: string): Bloque {
  return { tipo: "polos", editIdNeg: editId + ".neg", editIdPos: editId + ".pos", negDef: paraCliente(negDef), posDef: paraCliente(posDef) };
}
function bRefsFicha(F: ReturnType<typeof ficha>): Bloque | null {
  const items = refItems(F);
  return items.length ? { tipo: "refs", items } : null;
}
function bCita(texto: string): Bloque {
  return { tipo: "cita", texto };
}

export function construyeCapitulos(r: Resultado): Capitulo[] {
  const cap: Capitulo[] = [];
  const push = (o: Partial<Capitulo> & Pick<Capitulo, "seccion" | "titulo" | "bloques">) =>
    cap.push({ id: "c" + cap.length, kicker: "", ...o });

  push({
    seccion: "Bienvenida",
    kicker: "Tu mapa de luz",
    titulo: "Bienvenida a tu estudio",
    bloques: [
      bLead(
        "p2.lead",
        "Acepta este estudio no como un diagnóstico rígido, sino como una guía viva. La Kábala nos enseña que el día y la hora en que naciste, junto con el nombre con el que fuiste nombrada, constituyen una contraseña única de acceso a tu potencial supremo."
      ),
      bP(
        "p2.a",
        "Todo lo que leerás en las siguientes páginas habla de ti: de lo que ya has conquistado, de lo que aún está por despertar y de los aprendizajes que han venido a impulsarte. Léelo con apertura, amor y la certeza de que posees la fuerza para transformar cada aspecto de tu vida."
      ),
      bH("Un viaje de retorno a tu esencia"),
      bP(
        "p2.b",
        "Este estudio es una hoja de ruta para comprender la arquitectura de tu ser. A través de la Kábala desciframos los códigos de tu nacimiento para ofrecerte claridad, sentido y dirección: tus dones, las virtudes y herramientas con las que viniste a habitar el mundo; tus desafíos de evolución, esos bloqueos o patrones repetitivos transformados en tu mayor fuente de sabiduría; y tu propósito, la dirección hacia donde orientar tu energía para vivir en plenitud."
      ),
      bP(
        "p2.c",
        "El árbol de la vida, con sus diez sefirot y sus veintidós senderos, es también el mapa evolutivo que recorren los veintidós arcanos mayores del Tarot: cada camino que tu alma ha elegido tiene, además de su lectura kabalística, una historia arquetípica —la del Loco que empieza a andar y, al final del recorrido, vuelve a cruzar el mismo abismo, pero ya transformado—. En este estudio encontrarás ambas lecturas entretejidas.",
      ),
      bCita("El estudio de Kábala no adivina tu destino; desvela la luz que ya habita en ti para que aprendas a guiar tu propio camino con conciencia, amor y libertad."),
    ],
  });

  push({
    seccion: "Árbol de la Vida",
    kicker: "Tus tres energías",
    titulo: "Tu Árbol de la Vida",
    bloques: [
      bP(
        "p3.intro",
        "Tu alma elige tres caminos en el árbol de la vida: tres energías que has venido a aprender, a manejar y a comprender. El camino de origen te acompaña desde que naces hasta tu edad de cambio y es lo que sabes de otras vidas. El camino de transformación nace y muere contigo: es tu manera de vivir. El camino de destino es hacia dónde quiere llevarte tu alma."
      ),
      { tipo: "arbol" },
      bDato(
        "p3.edad",
        "Edad de cambio",
        r.caminos.edadCambio,
        r.turbulencias
          ? `A los ${r.caminos.edadCambio} años comienzan diez años de turbulencias en ${r.turbulencias.lista.map((t) => t.tipo.toLowerCase()).join(" y ")}. No tomarás el camino de destino hasta los ${r.caminos.edadCambio + 10} años.`
          : `A los ${r.caminos.edadCambio} años se produce el cambio que te lleva a tomar tu camino de destino.`
      ),
    ],
  });

  const camDef = [
    {
      k: "origen" as const,
      c: r.caminos.origen,
      kicker: "Sesión 1 · Tus caminos",
      titulo: "Tu camino de origen",
      intro: `Te habla de esa cualidad que traes de serie: el camino de origen es lo que vienes a recordar y a compartir con otros en esta existencia. En tu caso, desde tu nacimiento hasta los ${r.caminos.edadCambio} años, que es tu edad de cambio.`,
    },
    {
      k: "transformacion" as const,
      c: r.caminos.transformacion,
      kicker: "Sesión 1 · Tus caminos",
      titulo: "Tu camino de transformación",
      intro: "Nace y muere contigo: es tu manera de vivir. Debes vivir con esta predisposición y actuar como te indique este camino ante cualquier situación o conflicto que se presente en tu vida. Será muy bueno para lograr el éxito.",
    },
    {
      k: "destino" as const,
      c: r.caminos.destino,
      kicker: "Sesión 1 · Tus caminos",
      titulo: "Tu camino de destino",
      intro:
        r.caminos.destino.arcano === r.caminos.transformacion.arcano
          ? "Una energía nueva que tu alma quiere aprender. En tu caso la continúas desde tu camino de transformación."
          : "Una energía nueva que tu alma quiere aprender. Se alcanza cuando llega el momento del cambio.",
    },
  ];
  camDef.forEach((d) => {
    const carta = d.c.carta;
    const cuerpo = (carta?.texto || "").replace(/^[“"][^”"]*[”"]\.?\s*/, "");
    const evolutivo = CAMINO_EVOLUTIVO[String(d.c.arcano)];
    const bloques: Bloque[] = [
      bLead("p." + d.k + ".intro", d.intro),
      bH(d.c.arcano + " · " + (carta?.nombre || "") + (carta?.lema ? " — “" + carta.lema + "”" : "")),
      bP("p." + d.k + ".cuerpo", cuerpo),
    ];
    if (carta?.pareja) bloques.push({ tipo: "refs", items: [{ label: "Este camino en pareja", color: "#B08A2E", texto: carta.pareja, style: "border-left:2px solid #C9A84C;padding-left:12px;" }] });
    if (evolutivo) {
      bloques.push(bH("El camino evolutivo de " + evolutivo.nombre + " · " + evolutivo.sendero));
      bloques.push(bP("p." + d.k + ".evolutivo", evolutivo.texto));
    }
    push({ seccion: "Sesión 1 · Caminos", kicker: d.kicker, titulo: d.titulo, bloques });
  });

  const cor = r.corazon;
  push({
    seccion: "Sesión 1 · Números",
    kicker: "El pin de tu alma",
    titulo: "Tu número de corazón: " + cor.valor,
    bloques: [
      bLead("p7.lead", "Es el número pin de tu alma, cómo vibras. Sabiendo que los números son vibración, entendemos que nos dan la información de la energía que generamos y el tipo de aprendizaje con los demás."),
      // De dónde sale la cifra, para que se pueda seguir la cuenta a mano.
      bP("p7.cuenta", `Sale del valor de tu nombre (${r.valorNombre}) más tu edad de cambio (${r.caminos.edadCambio}): ${r.valorNombre} + ${r.caminos.edadCambio} = ${cor.valor}.`),
      bPolos("p7.polos", cor.lectura.negativo, cor.lectura.positivo),
      bH(cor.ficha?.enDiccionario ? "Número " + cor.valor + " · " + cor.ficha.titulo : "En Kábala los números de tres cifras se dividen de dos en dos: " + (cor.ficha ? cor.ficha.partes.map((p) => p.n).join(" y ") : "")),
      bP("p7.cuerpo", cor.ficha?.enDiccionario ? cor.ficha.texto : cor.ficha ? cor.ficha.partes.map((p) => p.n + ". " + p.titulo + " " + p.texto).join("\n\n") : ""),
      bRefsFicha(cor.ficha),
    ].filter(Boolean) as Bloque[],
  });

  push({
    seccion: "Sesión 1 · Números",
    kicker: "Tus valores y tu expresión",
    titulo: "Esencia, ego y días de fuerza",
    bloques: [
      bDato("p8.esencia", "Esencia", r.esencia.valor, r.esencia.ficha?.enDiccionario ? r.esencia.ficha.titulo + " " + r.esencia.ficha.texto : "Este número habla de tus valores internos, de los más profundos."),
      bRefsFicha(r.esencia.ficha),
      bDato(
        "p8.ego",
        "Ego",
        r.ego.valor,
        r.ego.ficha?.enDiccionario
          ? r.ego.ficha.titulo + " " + r.ego.ficha.texto
          : "Habla de la conexión que tienes con las personas. Se lee de dos en dos: " + (r.ego.ficha ? r.ego.ficha.partes.map((p) => p.n + ". " + p.titulo).join(" · ") : "")
      ),
      bRefsFicha(r.ego.ficha),
      bDato(
        "p8.dias",
        "Fuerza",
        r.diasFuerza.dias.join(" · "),
        "Van del más fuerte al menos fuerte. Aprovecha el día " + r.diasFuerza.dias[0] + " del mes para firmas y temas relevantes en tu vida; después, el resto de días que suman " + r.diasFuerza.base + "."
      ),
    ].filter(Boolean) as Bloque[],
  });

  push({
    seccion: "Sesión 2 · Aprendizajes",
    kicker: "Sesión 2 · Tus aprendizajes",
    titulo: "Tu estructura energética: número " + r.estructura.tipo,
    bloques: [bP("p9.tipo", r.tipoEstructura?.texto || ""), bPolos("p9.polos", r.tipoEstructura?.negativo || "", r.tipoEstructura?.positivo || ""), { tipo: "estructura" }],
  });

  const aps = r.aprendizajes;
  if (!aps.length) {
    push({ seccion: "Sesión 2 · Aprendizajes", kicker: "Sesión 2 · Tus aprendizajes", titulo: "Tus aprendizajes", bloques: [bP("p10.vacio", "Tu alma no ha marcado más aprendizajes en esta encarnación.")] });
  } else {
    aps.forEach((ap, ai) => {
      const bloques: Bloque[] = [
        bH("Aprendizaje " + ap.portal + (ap.veces > 1 ? " (×" + ap.veces + ")" : "") + " · " + (ap.tarea?.nombre || "") + " — viene del número " + ap.numero),
        bP("p.ap." + ap.portal, ap.tarea?.texto || ""),
        {
          tipo: "refs",
          items: [
            { label: "Hilo rojo", color: "#8E3A83", texto: ap.tarea?.hiloRojo || "", style: "border-left:2px solid #A8449B;padding-left:12px;" },
            { label: "Neurosis asociada", color: "#8E3A2F", texto: ap.tarea?.neurosis || "", style: "border-left:2px solid #C0574C;padding-left:12px;" },
            { label: "Principio sanador", color: "#40794F", texto: ap.tarea?.sanador || "", style: "border-left:2px solid #4C8A5A;padding-left:12px;" },
          ]
            .filter((it) => it.texto)
            .concat(refItems(ap.ficha)),
        },
      ];
      push({ seccion: "Sesión 2 · Aprendizajes", kicker: "Sesión 2 · Tus aprendizajes", titulo: "Tus aprendizajes · " + (ai + 1) + " de " + aps.length, bloques });
    });
  }

  const enf = aps.filter((a) => a.enfermedades && (a.enfermedades.psico || a.enfermedades.nota));
  if (enf.length) {
    push({
      seccion: "Sesión 2 · Somatizaciones",
      kicker: "Cuerpo y emoción",
      titulo: "Enfermedades y debilidades",
      bloques: [
        bLead("p12.lead", "Si no llevas a cabo estos aprendizajes, la energía no trabajada se somatiza. Conocer dónde se manifiesta te permite anticiparte y trabajarlo desde la conciencia."),
        {
          tipo: "refs",
          items: enf.map((a) => ({
            label: "Punto " + a.portal + " · " + (a.tarea?.nombre || ""),
            color: "#B0564C",
            texto: a.enfermedades?.nota ? a.enfermedades.nota : `Disfunciones psicológicas: ${a.enfermedades?.psico} Órganos: ${a.enfermedades?.organos} Disfunciones físicas: ${a.enfermedades?.fisicas}`,
            style: "border-left:2px solid #C0574C;padding-left:12px;",
          })),
        },
      ],
    });
  }

  push({
    seccion: "Sesión 3 · Imagen del alma",
    kicker: "Sesión 3 · La imagen del alma",
    titulo: "Tus bloqueos y tus ayudas",
    bloques: [
      bLead(
        "p13.lead",
        "Te da información de todos los procesos kármicos que te impiden crecer y avanzar. Es una mochila cargada de rutinas heredadas, patrones familiares y maneras de actuar de otras vidas que estás repitiendo en esta. Al conocerla vas a quitarle peso."
      ),
      { tipo: "alma" },
    ],
  });

  const bls = r.bloqueos;
  bls.forEach((b, bi) => {
    push({
      seccion: "Sesión 3 · Imagen del alma",
      kicker: "Sesión 3 · La imagen del alma",
      titulo: "Bloqueo " + b.casilla + " · " + (bi + 1) + " de " + bls.length,
      bloques: [
        bH((b.plano?.nombre || "") + (b.veces > 1 ? " · ×" + b.veces : "") + " — se forma con el número " + b.numero),
        bP("p.bl." + b.casilla, b.plano?.texto || ""),
        { tipo: "refs", items: refItems(b.ficha) },
      ].filter((bloque) => !(bloque.tipo === "refs" && bloque.items.length === 0)) as Bloque[],
    });
  });

  push({
    seccion: "Cierre",
    kicker: "Cuentas abiertas y karma",
    titulo: "Tu karma",
    bloques: [
      bLead(
        "p14.lead",
        "Las cuentas abiertas son la base del sentimiento de culpa, donde tu alma siente que más ha fallado: situaciones no resueltas que continúas cargando. Cada potencial arcaico te ayuda a cerrar la cuenta abierta de su fila."
      ),
      { tipo: "cuentas" },
      bRefsFicha(r.cuentasFichas.karmico),
      bH("Tu lema de vida: " + r.cuentas.lemaDeVida),
      bRefsFicha(r.cuentasFichas.lema),
    ].filter(Boolean) as Bloque[],
  });

  push({
    seccion: "Cierre",
    kicker: "Ciclos vitales",
    titulo: "Tus ciclos de vida",
    bloques: [
      bP(
        "p15.intro",
        `Tu propósito de vida vibra en el ${r.ciclos.proposito}. Los tres grandes ciclos —formación, evolución y cosecha— y las cuatro realizaciones marcan el ritmo de tu existencia; los desafíos son las fricciones que te afinan en cada etapa. Tu año personal actual (${r.ciclos.anioUniversal}) es el ${r.ciclos.anioPersonal}.`
      ),
      { tipo: "ciclos" },
    ],
  });

  // Las nueve etapas de nueve años y el año personal: contenido de los
  // manuales de ciclos que hasta ahora no aparecía en el estudio.
  const CI = KDATA.ciclos;
  const etapas = r.ciclos.etapas;
  push({
    seccion: "Cierre",
    kicker: "Ciclos vitales",
    titulo: "Tus etapas de nueve años",
    bloques: [
      bLead(
        "p16.lead",
        `La vida se recorre además en etapas de nueve años, cada una con su propia lección. Ahora mismo, con ${r.ciclos.edad} años, estás en la etapa ${r.ciclos.etapaActual}.`
      ),
      ...etapas.flatMap((e): Bloque[] => {
        const texto = (CI.etapas9 || {})[e.n] || "";
        if (!texto) return [];
        return [
          bH(`Etapa ${e.n} · de los ${e.desde} a los ${e.hasta} años${e.n === r.ciclos.etapaActual ? " — tu etapa actual" : ""}`),
          bP(`p16.etapa.${e.n}`, texto),
        ];
      }),
    ],
  });

  const textoAnio = (CI.anioPersonal || {})[r.ciclos.anioPersonal] || "";
  push({
    seccion: "Cierre",
    kicker: "Ciclos vitales",
    titulo: `Tu año personal: ${r.ciclos.anioPersonal}`,
    bloques: [
      bDato("p17.anio", `Año ${r.ciclos.anioUniversal}`, r.ciclos.anioPersonal, textoAnio || "Se calcula sumando tu día y tu mes de nacimiento al año en curso."),
      bCita("Que este mapa te acompañe. La luz que buscas ya habita en ti."),
    ],
  });

  return cap;
}

export { COL as ESTUDIO_COL };
