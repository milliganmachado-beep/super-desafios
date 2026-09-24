import { useEffect, useRef, useState, type RefObject } from "react";
import { endings, routeLabels, scenes, statLabels, type Choice, type Ending, type StatKey } from "./story";
import "./game.css";

const STAT_KEYS = Object.keys(statLabels) as StatKey[];
const STAT_ICONS: Record<StatKey, string> = { conexao: "◆", estimulo: "✦", energia: "⚡", autenticidade: "◈", regulacao: "◎", autonomia: "➤" };
const IMAGE_EXTENSIONS = ["webp", "png", "jpg", "jpeg", "svg"] as const;
const INITIAL_STATS: Record<StatKey, number> = { conexao: 60, estimulo: 60, energia: 60, autenticidade: 60, regulacao: 60, autonomia: 60 };
const clamp = (value: number) => Math.max(0, Math.min(100, value));
type Phase = "intro" | "event" | "outcome" | "ending" | "result";
type HistoryEntry = { scene: number; choice: number; plausible: boolean };

function rankGame(stats: Record<StatKey, number>, plausibleCount: number) {
  const values = Object.values(stats);
  const minStat = Math.min(...values);
  const average = values.reduce((a, b) => a + b, 0) / values.length;
  const floorPenalty = values.reduce((sum, value) => sum + Math.max(0, 45 - value) * 1.25, 0);
  const understanding = (plausibleCount / 29) * 100;
  const score = Math.max(0, Math.min(100, understanding * 0.78 + average * 0.22 - floorPenalty));
  if (plausibleCount === 29 && minStat >= 32) return { rank: "S", score: 100 };
  if (score >= 88 && plausibleCount >= 26 && minStat >= 25) return { rank: "A", score };
  if (score >= 74 && minStat >= 20) return { rank: "B", score };
  if (score >= 58 && minStat >= 15) return { rank: "C", score };
  if (score >= 40 && minStat >= 10) return { rank: "D", score };
  return { rank: "F", score };
}

function applyDeltas(stats: Record<StatKey, number>, deltas: Choice["deltas"]) {
  const next = { ...stats };
  for (const key of STAT_KEYS) next[key] = clamp(next[key] + (deltas[key] ?? 0));
  return next;
}

function deltaText(deltas: Choice["deltas"]) {
  return STAT_KEYS.filter((key) => deltas[key]).map((key) => `${statLabels[key]} ${(deltas[key] ?? 0) > 0 ? "+" : ""}${deltas[key]}`).join(" · ");
}

function TypingText({ text, speed = 48, className = "", onComplete }: { text: string; speed?: number; className?: string; onComplete?: () => void }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    if (!text) {
      onComplete?.();
      return;
    }
    let cancelled = false;
    let timer = 0;
    const tick = (index: number) => {
      if (cancelled) return;
      setVisible(index);
      if (index >= text.length) return;
      const nextChar = text[index];
      const punctuationPause = /[.!?]/.test(nextChar) ? 260 : /[,;:]/.test(nextChar) ? 120 : 0;
      timer = window.setTimeout(() => tick(index + 1), speed + punctuationPause);
    };
    timer = window.setTimeout(() => tick(1), speed);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [text, speed]);

  useEffect(() => {
    if (visible >= text.length) onComplete?.();
  }, [visible, text.length, scrollRef, onComplete]);

  return <span className={className}>{text.slice(0, visible)}{visible < text.length ? <span className="typing-cursor">▌</span> : null}</span>;
}

function IntroTypingText({ text, speed = 12, onComplete, scrollRef }: { text: string; speed?: number; onComplete?: () => void; scrollRef: RefObject<HTMLDivElement | null> }) {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    setVisible(0);
    if (!text) {
      onComplete?.();
      return;
    }
    let cancelled = false;
    let timer = 0;

    const tick = (index: number) => {
      if (cancelled) return;
      setVisible(index);
      if (index >= text.length) return;
      timer = window.setTimeout(() => tick(index + 1), speed);
    };

    timer = window.setTimeout(() => tick(1), speed);
    return () => {
      cancelled = true;
      window.clearTimeout(timer);
    };
  }, [text, speed]);

  useEffect(() => {
    const container = scrollRef.current;
    if (container) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: visible >= text.length ? "smooth" : "auto",
      });
    }
    if (visible >= text.length) {
      requestAnimationFrame(() => {
        const finalContainer = scrollRef.current;
        if (finalContainer) {
          finalContainer.scrollTo({ top: finalContainer.scrollHeight, behavior: "smooth" });
        }
        onComplete?.();
      });
    }
  }, [visible, text.length]);

  return (
    <div className="intro-copy">
      <span>{text.slice(0, visible)}</span>
      {visible < text.length ? <span className="typing-cursor">▌</span> : null}
    </div>
  );
}

function SequentialTyping({ paragraphs, speed = 48, pause = 850, onFinished }: { paragraphs: string[]; speed?: number; pause?: number; onFinished?: () => void }) {
  const [active, setActive] = useState(0);
  const [finished, setFinished] = useState(false);

  useEffect(() => {
    setActive(0);
    setFinished(false);
  }, [paragraphs]);

  useEffect(() => {
    if (!paragraphs.length) {
      setFinished(true);
      onFinished?.();
      return;
    }
    if (active >= paragraphs.length - 1) return;
    // The active paragraph completes naturally; advance after its typing finishes.
  }, [active, paragraphs.length, onFinished]);

  const handleComplete = () => {
    if (active >= paragraphs.length - 1) {
      setFinished(true);
      onFinished?.();
      return;
    }
    const timer = window.setTimeout(() => setActive((current) => current + 1), pause);
    return () => window.clearTimeout(timer);
  };

  return (
    <>
      {paragraphs.slice(0, active + 1).map((paragraph, index) => (
        <p key={index}>
          <TypingText text={paragraph} speed={speed} onComplete={index === active ? handleComplete : undefined} />
        </p>
      ))}
      {finished ? <span className="typing-complete" aria-hidden="true">▌</span> : null}
    </>
  );
}

const INTRO_TEXT = [
  "18 ANOS. PRIMEIRO DIA DE ENGENHARIA DE PRODUÇÃO.",
  "Daniel chega à universidade como qualquer calouro: prédio novo, pessoas novas e um caminho que ainda não conhece.",
  "Mas existe algo que não aparece de imediato: Daniel tem AHSD — altas habilidades/superdotação. Aprende rápido, percebe padrões e mergulha profundamente no que desperta seu interesse. Isso também pode trazer sobrecarga, cobrança, sensibilidade e a sensação de que nem sempre há espaço para acompanhar o próprio ritmo.",
  "Esta história começa como um iceberg: o que aparece é só uma parte. Ao longo de cinco anos e 30 momentos, escolhas, contexto e consequências vão revelar o que existe abaixo da superfície. Não há uma resposta perfeita — há o que Daniel consegue sustentar.",
];

function SceneArtwork({ baseName, title }: { baseName: string; title: string }) {
  const [extensionIndex, setExtensionIndex] = useState(0);
  const [missing, setMissing] = useState(false);
  const extension = IMAGE_EXTENSIONS[extensionIndex];
  const src = `${import.meta.env.BASE_URL}ahsd/images/${baseName}.${extension}`;
  const tryNext = () => extensionIndex < IMAGE_EXTENSIONS.length - 1 ? setExtensionIndex((current) => current + 1) : setMissing(true);
  if (missing) return <div className="image-placeholder">IMAGEM {baseName.toUpperCase()}</div>;
  return <img key={src} className="scene-artwork" src={src} alt={title} onError={tryNext} />;
}

export function AhsdGame() {
  const [sceneIndex, setSceneIndex] = useState(0);
  const [phase, setPhase] = useState<Phase>("intro");
  const [stats, setStats] = useState(INITIAL_STATS);
  const [selected, setSelected] = useState<Choice | null>(null);
  const [selectedChoiceIndex, setSelectedChoiceIndex] = useState<number | null>(null);
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [ending, setEnding] = useState<Ending | null>(null);
  const [introReady, setIntroReady] = useState(false);
  const introScrollRef = useRef<HTMLDivElement>(null);
  const scene = scenes[sceneIndex];
  const plausibleCount = history.filter((entry) => entry.plausible).length;
  const progress = ((sceneIndex + (phase === "outcome" ? 0.5 : 0)) / scenes.length) * 100;
  const sceneNumber = String(scene.id).padStart(2, "0");
  // Each story moment uses its own numbered artwork (01 → 30).
  // The outcome keeps the same scene image instead of creating extra 01a/01b assets.
  const artworkBaseName = sceneNumber;

  const choose = (choice: Choice, choiceIndex: number) => {
    if (phase !== "event") return;
    setSelected(choice);
    setSelectedChoiceIndex(choiceIndex);
    setStats((current) => applyDeltas(current, choice.deltas));
    setHistory((current) => [...current, { scene: scene.id, choice: choiceIndex, plausible: choice.plausible }]);
    setPhase("outcome");
  };

  const nextScene = () => {
    setSelected(null);
    setSelectedChoiceIndex(null);
    if (sceneIndex >= 28) { setSceneIndex(29); setPhase("ending"); return; }
    setSceneIndex((current) => current + 1);
    setPhase("event");
  };

  const chooseEnding = (picked: Ending) => {
    setEnding(picked);
    setStats((current) => {
      const next = { ...current };
      for (const key of STAT_KEYS) next[key] = clamp(next[key] + (picked.statBias[key] ?? 0));
      return next;
    });
    setPhase("result");
  };

  const restart = () => {
    setSceneIndex(0); setPhase("intro"); setIntroReady(false); setStats(INITIAL_STATS);
    setSelected(null); setSelectedChoiceIndex(null); setHistory([]); setEnding(null);
  };

  return (
    <main className="ahsd-game">
      <section className={`vn-stage ${phase === "intro" ? "intro-stage" : ""}`} aria-label="Cinco anos abaixo da superfície">
        {phase === "intro" ? (
          <section className="intro-screen">
          <div className="intro-scroll" ref={introScrollRef}>
            <div className="intro-eyebrow">SUPER DESAFIOS · AHSD // PROTOCOLO 01</div>
            <h1>CINCO ANOS<br /><span>ABAIXO DA SUPERFÍCIE</span></h1>
            <div className="intro-line" />
            <IntroTypingText text={INTRO_TEXT.join("\n\n")} speed={24} scrollRef={introScrollRef} onComplete={() => setIntroReady(true)} />
            <button className="intro-start" disabled={!introReady} onClick={() => setPhase("event")}><span>▶</span> {introReady ? "ENTRAR NA HISTÓRIA" : "LENDO..."}</button>
            <div className="intro-hint">Uma vida. 30 momentos. Nenhuma escolha existe sozinha.</div>
          </div>
          </section>
        ) : (
          <>
            <header className="vn-topbar">
              <div><div className="vn-kicker">CINCO ANOS ABAIXO DA SUPERFÍCIE</div><div className="vn-date"><TypingText text={`${scene.date} · ${scene.age}`} speed={18} /></div></div>
              <div className="vn-progress-wrap" aria-label={`Cena ${scene.id} de 30`}><span>{sceneNumber} / 30</span><div className="vn-progress"><i style={{ width: `${progress}%` }} /></div></div>
            </header>

            <div className="vn-visual-row">
              <aside className="vn-hud">
                <div className="portrait" aria-label="Retrato de Daniel"><div className="portrait-placeholder">D</div><div><strong>Daniel</strong><span>Engenharia de Produção</span></div></div>
                <div className="stats">
                  {STAT_KEYS.map((key) => <div className="stat" key={key}><div className="stat-name"><span className="stat-icon">{STAT_ICONS[key]}</span><span>{statLabels[key]}</span><b>{stats[key]}</b></div><div className="stat-bar" role="progressbar" aria-label={statLabels[key]} aria-valuenow={stats[key]} aria-valuemin={0} aria-valuemax={100}><i style={{ width: `${stats[key]}%` }} /></div></div>)}
                </div>
                <div className="routes"><span>HISTÓRIAS EM CENA</span><div>{scene.routes.map((route) => <em key={route}>{routeLabels[route]}</em>)}</div></div>
              </aside>
              <div className="scene-image" role="img" aria-label={`Imagem ${artworkBaseName} da cena ${scene.id}`}><SceneArtwork key={artworkBaseName} baseName={artworkBaseName} title={scene.title} /><div className="image-number">IMG_{artworkBaseName.toUpperCase()}</div><div className="scene-title"><TypingText text={scene.title} speed={35} /></div></div>
            </div>

            {phase === "event" && scene.id < 30 ? <section className="dialogue-panel"><div className="narrative">{scene.event.map((paragraph, index) => <p key={index}><TypingText text={paragraph} /></p>)}</div><div className="question"><span>O QUE ACONTECE AGORA?</span><strong><TypingText text={scene.question} /></strong></div><div className="choices">{scene.choices?.map((choice, index) => <button key={index} onClick={() => choose(choice, index)}><span>{String.fromCharCode(65 + index)}</span><TypingText text={choice.text} speed={12} /></button>)}</div></section> : null}

            {phase === "outcome" && selected ? <section className="dialogue-panel outcome-panel"><div className="outcome-label">ENTRE CENAS // REGISTRO ATUALIZADO</div><p><TypingText text={selected.outcome} /></p><div className="delta-line"><TypingText text={deltaText(selected.deltas) || "Sem alteração imediata"} speed={18} /></div><button className="continue" onClick={nextScene}>AVANÇAR CERCA DE DOIS MESES →</button></section> : null}

            {phase === "ending" ? <section className="dialogue-panel ending-panel"><div className="narrative">{scene.event.map((paragraph, index) => <p key={index}><TypingText text={paragraph} /></p>)}</div><div className="question"><span>ÚLTIMA ESCOLHA</span><strong><TypingText text={scene.question} /></strong></div><div className="choices endings">{endings.map((item, index) => <button key={item.id} onClick={() => chooseEnding(item)}><span>{String.fromCharCode(65 + index)}</span><div><b><TypingText text={item.title} speed={20} /></b><small><TypingText text={item.choice} speed={10} /></small></div></button>)}</div></section> : null}

            {phase === "result" && ending ? <section className="dialogue-panel result-panel"><div className="rank-card"><span>RANKING FINAL</span><strong>{rankGame(stats, plausibleCount).rank}</strong><small>{Math.round(rankGame(stats, plausibleCount).score)} pontos · {plausibleCount}/29 leituras plausíveis</small></div><div className="ending-copy"><h2><TypingText text={ending.title} /></h2>{ending.body.map((paragraph, index) => <p key={index}><TypingText text={paragraph} /></p>)}</div><div className="final-stats">{STAT_KEYS.map((key) => <span key={key}><i>{STAT_ICONS[key]}</i> {statLabels[key]} <b>{stats[key]}</b></span>)}</div><p className="ranking-note">O ranking mede a leitura do estado interno de Daniel e pune estados finais muito degradados.</p><button className="continue" onClick={restart}>JOGAR NOVAMENTE</button></section> : null}
          </>
        )}
      </section>
    </main>
  );
}