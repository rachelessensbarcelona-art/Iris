/* Motor de cálculo — Escuela de Sabiduría 33
   Todas las fórmulas provienen de los manuales de Kábala aportados.
   Verificado contra los ejemplos: Roberto López Castro (19/07/1951) y Lara María Soares Campos. */
(function (root) {
  var D = function () { return root.KDATA || {}; };

  /* ---------- utilidades ---------- */
  function digits(str) { return String(str).split('').filter(function (c) { return c >= '0' && c <= '9'; }).map(Number); }
  function sumDigits(x) { return digits(x).reduce(function (a, b) { return a + b; }, 0); }
  function reduceOnce(x) { return sumDigits(x); }
  function reduceTo(x, max) { var n = x; var guard = 0; while (n > max && guard++ < 12) n = sumDigits(n); return n; }
  function normalizaNombre(s) {
    return (s || '').toUpperCase()
      .replace(/[^A-ZÁÉÍÓÚÜÑÄÖ\s]/g, ' ')
      .replace(/\s+/g, ' ').trim();
  }
  var VOCALES = 'AEIOUÁÉÍÓÚÄÖÜ';

  /* ---------- valor numérico del nombre ---------- */
  function letrasDe(palabra) {
    var T = D().letras, out = [], i = 0;
    while (i < palabra.length) {
      var t3 = palabra.substr(i, 3), t2 = palabra.substr(i, 2), t1 = palabra.substr(i, 1);
      if (T[t3] !== undefined) { out.push({ g: t3, v: T[t3] }); i += 3; }
      else if (T[t2] !== undefined) { out.push({ g: t2, v: T[t2] }); i += 2; }
      else if (T[t1] !== undefined) { out.push({ g: t1, v: T[t1] }); i += 1; }
      else { i += 1; }
    }
    return out;
  }
  function esVocal(g) { return g.length === 1 && VOCALES.indexOf(g) >= 0; }

  function analizaNombre(nombreCompleto) {
    var limpio = normalizaNombre(nombreCompleto);
    var palabras = limpio ? limpio.split(' ') : [];
    var detalle = palabras.map(function (p) {
      var ls = letrasDe(p);
      return { palabra: p, letras: ls, total: ls.reduce(function (a, b) { return a + b.v; }, 0) };
    });
    var todas = detalle.reduce(function (a, d) { return a.concat(d.letras); }, []);
    var total = todas.reduce(function (a, b) { return a + b.v; }, 0);
    var vocales = todas.filter(function (l) { return esVocal(l.g); });
    var consonantes = todas.filter(function (l) { return !esVocal(l.g); });
    return {
      texto: limpio,
      palabras: detalle,
      total: total,
      esencia: vocales.reduce(function (a, b) { return a + b.v; }, 0),
      ego: consonantes.reduce(function (a, b) { return a + b.v; }, 0),
      vocales: vocales, consonantes: consonantes
    };
  }

  /* ---------- caminos ---------- */
  // Algoritmo del manual: sumar cifras -> restar -> dividir entre 9 -> +1 -> descomponer
  function arcanoDesde(total) {
    var s = reduceOnce(total);
    var resta = total - s;
    var div = resta / 9;
    var mas1 = div + 1;
    var arc = reduceTo(mas1, 21);
    return { total: total, sumaCifras: s, resta: resta, division: div, mas1: mas1, arcano: arc };
  }

  function fechaSuma(f) { return sumDigits(f.dia) + sumDigits(f.mes) + sumDigits(f.anio); }

  /* ---------- conversiones de fecha ---------- */
  function convierteDigitos(str, mapa) {
    return String(str).split('').map(function (c) { return mapa[c] !== undefined ? mapa[c] : c; }).join('');
  }
  var MAPA_ESTRUCTURA = { '0': '7', '1': '6', '2': '5' };   // estructura energética / cuerpo
  var MAPA_ALMA = { '1': '7', '2': '8', '3': '9' };          // imagen del alma

  // Devuelve las piezas de la fecha ya convertidas. `sinCeroIzq` ignora el cero a la izquierda.
  function piezasFecha(f, mapa) {
    var dia = convierteDigitos(String(f.dia), mapa);
    var mes = convierteDigitos(String(f.mes), mapa);
    var anioStr = String(f.anio);
    var siglo = convierteDigitos(anioStr.slice(0, 2), mapa);
    var corto = convierteDigitos(anioStr.slice(2), mapa);
    return { dia: dia, mes: mes, siglo: siglo, anioCorto: corto, anio: siglo + corto };
  }
  // cifras significativas (sin siglo, sin ceros a la izquierda)
  function cifrasSinSiglo(p) {
    var out = [];
    [p.dia, p.mes, p.anioCorto].forEach(function (chunk) {
      var s = String(chunk).replace(/^0+/, '');
      out = out.concat(digits(s));
    });
    return out;
  }
  function sumaConSiglo(p) {
    return sumDigits(p.dia) + sumDigits(p.mes) + sumDigits(p.anio);
  }

  /* ---------- estructura energética ---------- */
  function estructuraEnergetica(f) {
    var p = piezasFecha(f, MAPA_ESTRUCTURA);
    var suma = sumaConSiglo(p);
    var pasos = [suma], n = suma, guard = 0;
    while (n > 10 && guard++ < 10) { n = sumDigits(n); pasos.push(n); }
    var tipo = n;                                   // 2..10
    var dinamicos = {};                             // portal -> número dinámico
    for (var i = 0; i < 10; i++) dinamicos[i + 1] = (tipo + i) % 10;
    var cifras = cifrasSinSiglo(p);
    var aprend = {};                                // portal -> nº de veces
    cifras.forEach(function (d) {
      for (var portal = 1; portal <= 10; portal++) if (dinamicos[portal] === d) { aprend[portal] = (aprend[portal] || 0) + 1; }
    });
    var escudos = {};                               // escudo = portal del aprendizaje + 2
    Object.keys(aprend).forEach(function (portal) {
      var e = ((+portal + 2 - 1) % 10) + 1;
      escudos[e] = (escudos[e] || 0) + aprend[portal];
    });
    return {
      fechaConvertida: p, suma: suma, pasos: pasos, tipo: tipo,
      dinamicos: dinamicos, cifras: cifras, aprendizajes: aprend, escudos: escudos
    };
  }

  /* ---------- imagen del alma ---------- */
  function imagenDelAlma(f) {
    var p = piezasFecha(f, MAPA_ALMA);
    var suma = sumaConSiglo(p);
    var pasos = [suma], n = suma, guard = 0;
    while (n > 10 && guard++ < 10) { n = sumDigits(n); pasos.push(n); }
    var numero = n;
    var moviles = {};
    for (var i = 0; i < 10; i++) moviles[i + 1] = (numero + i) % 10;
    var cifras = cifrasSinSiglo(p);
    var bloqueos = {};                              // casilla fija = valor de la cifra (0 -> casilla 10)
    cifras.forEach(function (d) { var c = d === 0 ? 10 : d; bloqueos[c] = (bloqueos[c] || 0) + 1; });
    var ayudas = {};                                // sobre la estructura móvil
    cifras.forEach(function (d) {
      for (var c = 1; c <= 10; c++) if (moviles[c] === d) { ayudas[c] = (ayudas[c] || 0) + 1; }
    });
    var proyeccion = null;
    for (var c2 = 1; c2 <= 10; c2++) if (moviles[c2] === 0) proyeccion = c2;
    return {
      fechaConvertida: p, suma: suma, pasos: pasos, numero: numero,
      moviles: moviles, cifras: cifras, bloqueos: bloqueos, ayudas: ayudas, proyeccion: proyeccion
    };
  }

  /* ---------- números de tensión y liberación ---------- */
  var PAR = { '0': '5', '5': '0', '1': '6', '6': '1', '2': '7', '7': '2', '3': '8', '8': '3', '4': '9', '9': '4' };
  function tensionDe(n) {
    var s = String(n), out = '';
    for (var i = 0; i < s.length; i++) {
      var c = s[i];
      if (c === '5' && i === 0) out += '10';
      else out += PAR[c];
    }
    return parseInt(out, 10);
  }
  function liberacionDe(n) { return n + tensionDe(n); }

  // Devuelve la ficha del número: usa el diccionario si existe; si no, lo divide de 2 en 2.
  function ficha(n) {
    if (n === null || n === undefined || isNaN(n)) return null;
    var dict = D().numeros || {};
    var e = dict[n];
    if (e) {
      var refs = e.refs || {};
      return {
        n: n, titulo: e.titulo, texto: e.texto, atlante: e.atlante,
        T: refs.T !== undefined ? refs.T : tensionDe(n),
        L: refs.L !== undefined ? refs.L : liberacionDe(n),
        C: refs.C, P: refs.P, R: refs.R, enDiccionario: true, partes: []
      };
    }
    var s = String(n), partes = [];
    if (s.length === 3) { partes = [parseInt(s.slice(1), 10), parseInt(s.slice(0, 2), 10)]; }
    else if (s.length > 3) { partes = [parseInt(s.slice(-2), 10), parseInt(s.slice(0, 2), 10)]; }
    // Fuera del diccionario los números no tienen tensión ni liberación propias:
    // se leen dividiéndolos de dos en dos, y cada parte aporta la suya.
    return {
      n: n, titulo: '', texto: '', atlante: '', enDiccionario: false, T: null, L: null,
      partes: partes.filter(function (p) { return dict[p]; }).map(function (p) { return ficha(p); })
    };
  }

  /* ---------- lectura (-)/(+) de un número por sus cifras ---------- */
  function lectura(n) {
    var t = D().numerologia || {}, vistos = {}, pos = [], neg = [];
    digits(n).forEach(function (d) {
      if (vistos[d]) return; vistos[d] = 1;
      if (t[d]) { pos.push(t[d].pos); neg.push(t[d].neg); }
    });
    return { positivo: pos.join(' '), negativo: neg.join(' ') };
  }

  /* ---------- cuentas abiertas ---------- */
  function cuentasAbiertas(f) {
    var anioCorto = String(f.anio).slice(2);
    function fila(dia, mes, anio) {
      var a = sumDigits(dia), b = sumDigits(mes), c = sumDigits(anio);
      return { dia: a, mes: b, anio: c, total: a + b + c };
    }
    var E = fila(f.dia, f.mes, anioCorto);
    var pA = piezasFecha(f, MAPA_ALMA), pC = piezasFecha(f, MAPA_ESTRUCTURA);
    var A = fila(pA.dia, pA.mes, pA.anioCorto);
    var C = fila(pC.dia, pC.mes, pC.anioCorto);
    var potenciales = [E.dia + A.dia + C.dia, E.mes + A.mes + C.mes, E.anio + A.anio + C.anio];
    var karmico = E.total + A.total + C.total;
    return {
      espiritu: E, alma: A, cuerpo: C, potenciales: potenciales,
      cuentas: [E.total, A.total, C.total], karmico: karmico,
      lemaDeVida: karmico + tensionDe(karmico), tensionKarmico: tensionDe(karmico)
    };
  }

  function vibraciones(f) {
    var pC = piezasFecha(f, MAPA_ESTRUCTURA), pA = piezasFecha(f, MAPA_ALMA);
    var cuerpo = sumaConSiglo(pC), alma = sumaConSiglo(pA), espiritu = fechaSuma(f);
    return { cuerpo: cuerpo, alma: alma, espiritu: espiritu, efectoSanador: cuerpo + alma + espiritu };
  }

  function afinidad(f) {
    var anioCorto = parseInt(String(f.anio).slice(2), 10);
    return { diaMes: Number(f.dia) + Number(f.mes), mesAnio: Number(f.mes) + anioCorto };
  }

  /* ---------- ciclos vitales ---------- */
  function ciclosVitales(f, anioUniversal) {
    var diaR = reduceTo(f.dia, 9), mesR = reduceTo(f.mes, 9);
    var anioSum = sumDigits(f.anio), anioR = reduceTo(anioSum, 9);
    var propositoBruto = diaR + mesR + anioR;
    var proposito = reduceTo(propositoBruto, 9);
    var finFormacion = 36 - proposito;
    var r1 = reduceTo(mesR + diaR, 9);
    var r2 = reduceTo(diaR + anioR, 9);
    var r3 = reduceTo(r1 + r2, 9);
    var r4 = reduceTo(mesR + anioR, 9);
    var d1 = Math.abs(mesR - diaR), d2 = Math.abs(diaR - anioR), d3 = Math.abs(d1 - d2);
    var au = anioUniversal || new Date().getFullYear();
    var anioPersonal = reduceTo(Number(f.dia) + Number(f.mes) + au, 9);
    return {
      proposito: proposito, propositoBruto: propositoBruto,
      diaR: diaR, mesR: mesR, anioR: anioR,
      ciclos: [
        { nombre: 'Formación', numero: mesR, desde: 0, hasta: finFormacion },
        { nombre: 'Evolución', numero: diaR, desde: finFormacion, hasta: finFormacion + 18 },
        { nombre: 'Cosecha', numero: anioR, desde: finFormacion + 18, hasta: null }
      ],
      realizaciones: [
        { n: 1, valor: r1, desde: 0, hasta: finFormacion },
        { n: 2, valor: r2, desde: finFormacion, hasta: finFormacion + 9 },
        { n: 3, valor: r3, desde: finFormacion + 9, hasta: finFormacion + 18 },
        { n: 4, valor: r4, desde: finFormacion + 18, hasta: null }
      ],
      desafios: [
        { n: 1, valor: d1, etiqueta: 'Primer desafío menor', rango: 'hasta los 42 años aprox.' },
        { n: 2, valor: d2, etiqueta: 'Segundo desafío menor', rango: 'de los 42 años en adelante' },
        { n: 3, valor: d3, etiqueta: 'Desafío mayor', rango: 'toda la vida' }
      ],
      anioUniversal: au, anioPersonal: anioPersonal
    };
  }

  /* ---------- turbulencias ---------- */
  function turbulencias(f, edadCambio) {
    var t = [];
    var dia = Number(f.dia), mes = Number(f.mes), anio = Number(f.anio);
    if (dia % 10 === 0) t.push({ tipo: 'Espíritu', causa: 'día acabado en 0 (' + dia + ')', texto: 'En la vida pasada no hubo conciencia de la unidad; desconexión del sentido de la existencia. En esta vida, diez años centrados en una crisis existencial o espiritual para encontrar el sentido a la vida y volver a la unidad.' });
    if (mes % 10 === 0) t.push({ tipo: 'Alma', causa: 'mes acabado en 0 (' + mes + ')', texto: 'En la vida pasada hubo demasiado juego de máscaras buscando la aceptación social. En esta vida, una década de crisis de identidad: ¿quién soy yo? Una noche oscura del alma para volver a la búsqueda auténtica de la propia identidad.' });
    if (anio % 10 === 0) t.push({ tipo: 'Materia', causa: 'año acabado en 0 (' + anio + ')', texto: 'En la vida pasada hubo atrapamiento en los miedos de la materia: la seguridad económica como fin en sí mismo. Diez años para revisar el enfoque racional y pragmático de la materia.' });
    if (!t.length) return null;
    return { lista: t, desde: edadCambio, hasta: edadCambio + 10 };
  }

  /* ---------- días de fuerza ---------- */
  function diasDeFuerza(totalNombre) {
    var base = reduceOnce(totalNombre);
    var dias = [];
    for (var d = 1; d <= 31; d++) if (sumDigits(d) === base) dias.push(d);
    return { base: base, dias: dias };
  }

  /* ---------- cálculo completo ---------- */
  function calcula(entrada) {
    var f = { dia: Number(entrada.dia), mes: Number(entrada.mes), anio: Number(entrada.anio) };
    var nombre = analizaNombre([entrada.nombre, entrada.apellido1, entrada.apellido2].filter(Boolean).join(' '));

    var corazon = nombre.total;
    var origen = arcanoDesde(corazon);
    var edadCambio = fechaSuma(f);
    var transformacion = { total: edadCambio, arcano: reduceTo(edadCambio, 21) };
    var destino = arcanoDesde(corazon + edadCambio);

    var est = estructuraEnergetica(f);
    var ia = imagenDelAlma(f);
    var ca = cuentasAbiertas(f);
    var vib = vibraciones(f);

    // números de aprendizaje y de bloqueo
    var aprendizajes = Object.keys(est.aprendizajes).map(Number).sort(function (a, b) { return a - b; })
      .map(function (portal) {
        var num = portal * 10 + est.dinamicos[portal];
        return { portal: portal, veces: est.aprendizajes[portal], numero: num, ficha: ficha(num), tarea: (D().tareas || {})[portal], enfermedades: (D().enfermedades || {})[portal] };
      });
    var bloqueos = Object.keys(ia.bloqueos).map(Number).sort(function (a, b) { return a - b; })
      .map(function (casilla) {
        var num = casilla * 10 + ia.moviles[casilla];
        return { casilla: casilla, veces: ia.bloqueos[casilla], numero: num, ficha: ficha(num), plano: (D().planos_conciencia || {}).planos ? D().planos_conciencia.planos[casilla] : null };
      });

    // ejes y planos en tensión
    var conAprendizaje = function (p) { return !!est.aprendizajes[p]; };
    var ejes = (D().ejes || []).map(function (e) { return { eje: e, activo: conAprendizaje(e.a) && conAprendizaje(e.b), parcial: conAprendizaje(e.a) !== conAprendizaje(e.b) }; });
    var planosT = (D().planosTension || []).map(function (e) { return { plano: e, activo: conAprendizaje(e.a) && conAprendizaje(e.b) }; });

    return {
      entrada: entrada, fecha: f, nombre: nombre,
      corazon: { valor: corazon, ficha: ficha(corazon), lectura: lectura(corazon) },
      esencia: { valor: nombre.esencia, ficha: ficha(nombre.esencia), lectura: lectura(nombre.esencia) },
      ego: { valor: nombre.ego, ficha: ficha(nombre.ego), lectura: lectura(nombre.ego) },
      diasFuerza: diasDeFuerza(corazon),
      caminos: {
        origen: { calculo: origen, arcano: origen.arcano, carta: (D().arcanos || {})[origen.arcano] },
        transformacion: { calculo: transformacion, arcano: transformacion.arcano, carta: (D().arcanos || {})[transformacion.arcano] },
        destino: { calculo: destino, arcano: destino.arcano, carta: (D().arcanos || {})[destino.arcano] },
        edadCambio: edadCambio
      },
      turbulencias: turbulencias(f, edadCambio),
      estructura: est, tipoEstructura: (D().estructuras || {})[est.tipo],
      aprendizajes: aprendizajes, ejes: ejes, planosTension: planosT,
      imagenAlma: ia, bloqueos: bloqueos,
      cuentas: ca, cuentasFichas: {
        karmico: ficha(ca.karmico), lema: ficha(ca.lemaDeVida)
      },
      vibraciones: vib, efectoSanadorFicha: ficha(vib.efectoSanador),
      afinidad: afinidad(f),
      ciclos: ciclosVitales(f, entrada.anioUniversal)
    };
  }

  function comparaPareja(a, b) {
    var conjunto = reduceTo(reduceOnce(a.corazon.valor + b.corazon.valor), 21);
    var coincidencias = [];
    var ca = a.cuentas, cb = b.cuentas;
    ca.cuentas.forEach(function (x) { if (cb.cuentas.indexOf(x) >= 0) coincidencias.push({ tipo: 'cuenta', valor: x, texto: D().parejas.cuentas.mismaCuenta }); });
    ca.potenciales.forEach(function (x) { if (cb.potenciales.indexOf(x) >= 0) coincidencias.push({ tipo: 'potencial', valor: x, texto: D().parejas.cuentas.mismoPotencial }); });
    ca.cuentas.forEach(function (x) { if (cb.potenciales.indexOf(x) >= 0) coincidencias.push({ tipo: 'cruzado', valor: x, texto: D().parejas.cuentas.cruzado }); });
    cb.cuentas.forEach(function (x) { if (ca.potenciales.indexOf(x) >= 0) coincidencias.push({ tipo: 'cruzado', valor: x, texto: D().parejas.cuentas.cruzado }); });
    var afinIgual = (a.afinidad.diaMes === b.afinidad.diaMes) || (a.afinidad.mesAnio === b.afinidad.mesAnio);
    var portalesComunes = Object.keys(a.estructura.aprendizajes).filter(function (p) { return b.estructura.aprendizajes[p]; }).map(Number);
    var planosComunes = Object.keys(a.imagenAlma.bloqueos).filter(function (c) { return b.imagenAlma.bloqueos[c]; }).map(Number);
    return {
      caminoConjunto: conjunto, cartaConjunta: (D().arcanos || {})[conjunto],
      mismaEstructura: a.estructura.tipo === b.estructura.tipo,
      textoEstructura: a.estructura.tipo === b.estructura.tipo ? D().parejas.estructuras.iguales : D().parejas.estructuras.distintas,
      portalesComunes: portalesComunes, planosComunes: planosComunes,
      coincidencias: coincidencias, afinidadIgual: afinIgual
    };
  }

  root.KEngine = {
    calcula: calcula, comparaPareja: comparaPareja, ficha: ficha, lectura: lectura,
    analizaNombre: analizaNombre, arcanoDesde: arcanoDesde, tensionDe: tensionDe,
    liberacionDe: liberacionDe, sumDigits: sumDigits, reduceTo: reduceTo, letrasDe: letrasDe, esVocal: esVocal
  };
})(window);
