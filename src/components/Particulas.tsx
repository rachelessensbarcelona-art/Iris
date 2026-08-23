"use client";
import { useEffect, useRef } from "react";
import { css } from "@/lib/css";

/**
 * Polvo dorado suspendido. Va en canvas y no en decenas de nodos animados por
 * CSS: son partículas que se mueven todas a la vez, y así el navegador pinta
 * un solo elemento en lugar de recalcular la disposición de la página.
 *
 * Se queda quieto si el sistema pide menos movimiento, y también cuando la
 * tarjeta no está a la vista: no tiene sentido gastar cuadros en algo que
 * nadie está mirando.
 */
export default function Particulas({ cantidad = 26, color }: { cantidad?: number; color?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const lienzo = ref.current;
    if (!lienzo) return;
    const ctx = lienzo.getContext("2d");
    if (!ctx) return;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    // Sobre fondo oscuro el dorado tostado desaparece: hay que subirlo de luz,
    // igual que se hace con el token de color.
    const oscuro = document.documentElement.dataset.tema === "oscuro";
    const tinta = color || (oscuro ? "236,214,150" : "176,142,52");

    let ancho = 0;
    let alto = 0;
    let visible = true;
    let cuadro = 0;

    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const motas = Array.from({ length: cantidad }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: 1.1 + Math.random() * 2.6,
      // Deriva muy lenta y hacia arriba: tiene que leerse como suspensión, no
      // como lluvia al revés.
      vx: (Math.random() - 0.5) * 0.00022,
      vy: -(0.00012 + Math.random() * 0.00028),
      fase: Math.random() * Math.PI * 2,
      brillo: oscuro ? 0.4 + Math.random() * 0.5 : 0.34 + Math.random() * 0.46,
    }));

    const medir = () => {
      const c = lienzo.getBoundingClientRect();
      ancho = c.width;
      alto = c.height;
      lienzo.width = Math.round(ancho * dpr);
      lienzo.height = Math.round(alto * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    medir();

    const observador = new ResizeObserver(medir);
    observador.observe(lienzo);

    const enPantalla = new IntersectionObserver((e) => (visible = e[0].isIntersecting), { threshold: 0 });
    enPantalla.observe(lienzo);

    let t = 0;
    const pintar = () => {
      cuadro = requestAnimationFrame(pintar);
      if (!visible || ancho === 0) return;
      t += 1;
      ctx.clearRect(0, 0, ancho, alto);
      for (const m of motas) {
        m.x += m.vx;
        m.y += m.vy;
        // Al salir por arriba vuelve a entrar por abajo, en otra columna.
        if (m.y < -0.05) {
          m.y = 1.05;
          m.x = Math.random();
        }
        if (m.x < -0.05) m.x = 1.05;
        if (m.x > 1.05) m.x = -0.05;

        // El titileo es un seno lento y desfasado por partícula, para que no
        // parpadeen todas a la vez.
        const alfa = m.brillo * (0.55 + 0.45 * Math.sin(t * 0.012 + m.fase));
        ctx.beginPath();
        ctx.arc(m.x * ancho, m.y * alto, m.r * 3.4, 0, Math.PI * 2);
        // Un halo suave alrededor de cada mota: sin él se ven como puntos
        // duros, y esto tiene que leerse como polvo suspendido.
        const halo = ctx.createRadialGradient(m.x * ancho, m.y * alto, 0, m.x * ancho, m.y * alto, m.r * 3.4);
        halo.addColorStop(0, `rgba(${tinta},${alfa.toFixed(3)})`);
        halo.addColorStop(0.45, `rgba(${tinta},${(alfa * 0.35).toFixed(3)})`);
        halo.addColorStop(1, `rgba(${tinta},0)`);
        ctx.fillStyle = halo;
        ctx.fill();
      }
    };
    cuadro = requestAnimationFrame(pintar);

    return () => {
      cancelAnimationFrame(cuadro);
      observador.disconnect();
      enPantalla.disconnect();
    };
  }, [cantidad, color]);

  return <canvas ref={ref} aria-hidden="true" style={css("position:absolute;inset:0;width:100%;height:100%;pointer-events:none;border-radius:inherit;")} />;
}
