"use client";
import { css } from "@/lib/css";
import { useApp, type View } from "@/lib/app-context";
import ConsultaScreen from "./screens/ConsultaScreen";
import PanelScreen from "./screens/PanelScreen";
import EstudioScreen from "./screens/EstudioScreen";
import ParejaScreen from "./screens/ParejaScreen";
import DetalleModal from "./DetalleModal";

const TABS: Array<{ k: View; label: string }> = [
  { k: "inicio", label: "Consulta" },
  { k: "panel", label: "Panel" },
  { k: "estudio", label: "Estudio" },
  { k: "pareja", label: "Pareja" },
];

export default function Shell() {
  const { view, setView, r } = useApp();

  return (
    <div
      data-app-root=""
      style={css(
        "min-height:100vh;background:var(--bg);background-image:radial-gradient(1100px 620px at 8% -12%, rgba(201,168,76,.22), transparent 62%),radial-gradient(900px 560px at 96% 2%, rgba(120,150,255,.18), transparent 58%),radial-gradient(820px 520px at 50% 108%, rgba(190,120,220,.12), transparent 60%);background-attachment:fixed;color:var(--text);font-family:var(--font-ui);"
      )}
    >
      <header
        data-chrome="1"
        data-app-header=""
        style={css(
          "position:sticky;top:0;z-index:40;display:flex;align-items:center;gap:clamp(12px,2vw,22px);flex-wrap:wrap;padding:12px clamp(14px,3vw,28px);background:rgba(245,245,247,.72);backdrop-filter:blur(14px);border-bottom:1px solid var(--border);"
        )}
      >
        <div style={css("display:flex;align-items:center;gap:13px;")}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo.jpeg"
            alt="Escuela de Sabiduría 33"
            style={css("width:38px;height:38px;flex:none;border-radius:50%;object-fit:cover;box-shadow:0 0 0 1px rgba(201,168,76,.4),0 0 22px var(--border-accent);")}
          />
          <div style={css("display:flex;flex-direction:column;gap:2px;")}>
            <div style={css("font-family:var(--font-ui);font-weight:600;font-size:clamp(11px,1.4vw,14px);letter-spacing:.16em;color:var(--gold);line-height:1.1;")}>ESCUELA DE SABIDURÍA 33</div>
            <div style={css("font-size:10px;letter-spacing:.22em;text-transform:uppercase;color:var(--text-4);")}>Estudio de Kábala</div>
          </div>
        </div>
        {view !== "inicio" && (
          <button
            onClick={() => setView(view === "panel" ? "inicio" : "panel")}
            title={view === "panel" ? "Volver a la consulta" : "Volver al panel"}
            style={css(
              "display:inline-flex;align-items:center;gap:7px;padding:8px 14px;border-radius:var(--r-sm);cursor:pointer;border:1px solid var(--border-accent);background:rgba(0,0,0,.025);color:var(--gold);font-size:10px;letter-spacing:.18em;text-transform:uppercase;transition:all .2s;"
            )}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M19 12H5" />
              <path d="m12 19-7-7 7-7" />
            </svg>
            Volver
          </button>
        )}
        <nav data-nav="" style={css("display:flex;gap:4px;flex-wrap:wrap;margin-left:auto;")}>
          {TABS.map((t) => {
            const on = view === t.k;
            const bloqueado = t.k !== "inicio" && !r;
            return (
              <button
                key={t.k}
                onClick={() => {
                  if (!bloqueado) setView(t.k);
                }}
                style={css(
                  "padding:9px 17px;border-radius:var(--r-sm);cursor:" +
                    (bloqueado ? "not-allowed" : "pointer") +
                    ";font-size:11px;letter-spacing:.19em;text-transform:uppercase;border:1px solid " +
                    (on ? "var(--gold)" : "transparent") +
                    ";background:" +
                    (on ? "var(--gold-soft)" : "transparent") +
                    ";color:" +
                    (on ? "var(--gold)" : bloqueado ? "var(--text-4)" : "var(--text-3)") +
                    ";transition:all .22s;"
                )}
              >
                {t.label}
              </button>
            );
          })}
        </nav>
      </header>

      {view === "inicio" && <ConsultaScreen />}
      {view === "panel" && <PanelScreen />}
      {view === "estudio" && <EstudioScreen />}
      {view === "pareja" && <ParejaScreen />}

      <DetalleModal />
    </div>
  );
}
