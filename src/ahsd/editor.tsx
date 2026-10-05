import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { endings as originalEndings, routeLabels, scenes as originalScenes, statLabels, type Choice, type Ending, type RouteKey, type Scene, type StatKey } from "./story";

const statKeys = Object.keys(statLabels) as StatKey[];
const routeKeys = Object.keys(routeLabels) as RouteKey[];
const imageExtensions = ["webp", "png", "jpg", "jpeg", "svg"] as const;
const imageUrl = (name: string) => `${import.meta.env.BASE_URL}ahsd/images/${encodeURIComponent(name)}`;
const clone = <T,>(value: T): T => JSON.parse(JSON.stringify(value)) as T;
const padded = (id: number) => String(id).padStart(2, "0");

const sourceFor = (scenes: Scene[], endings: Ending[]) => `export type StatKey = ${statKeys.map((key) => JSON.stringify(key)).join(" | ")};
export type RouteKey = ${routeKeys.map((key) => JSON.stringify(key)).join(" | ")};

export type Choice = {
  text: string;
  outcome: string;
  deltas: Partial<Record<StatKey, number>>;
  plausible: boolean;
  image?: string;
};

export type Scene = {
  id: number;
  date: string;
  age: string;
  title: string;
  image?: string;
  routes: RouteKey[];
  complicator: string;
  event: string[];
  question: string;
  choices?: Choice[];
};

export const statLabels: Record<StatKey, string> = ${JSON.stringify(statLabels, null, 2)};

export const routeLabels: Record<RouteKey, string> = ${JSON.stringify(routeLabels, null, 2)};

export const scenes: Scene[] = ${JSON.stringify(scenes, null, 2)};

export type EndingId = ${originalEndings.map((ending) => JSON.stringify(ending.id)).join(" | ")};
export type Ending = { id: EndingId; title: string; choice: string; body: string[]; statBias: Partial<Record<StatKey, number>> };

export const endings: Ending[] = ${JSON.stringify(endings, null, 2)};
`;

function SceneArtwork({ scene, image, fallbackName = padded(scene.id) }: { scene: Scene; image?: string; fallbackName?: string }) {
  const [attempt, setAttempt] = useState(0);
  const [missing, setMissing] = useState(false);
  useEffect(() => { setAttempt(0); setMissing(false); }, [image, scene.id]);
  const sourceNames = image ? [image] : [...imageExtensions.map((extension) => `${fallbackName}.${extension}`), ...(fallbackName.startsWith("0") ? imageExtensions.map((extension) => `${fallbackName.slice(1)}.${extension}`) : [])];
  if (missing) return <div className="editor-image-empty">Imagem ausente · Cena {padded(scene.id)}</div>;
  return <img className="editor-image-preview" src={imageUrl(sourceNames[attempt] ?? sourceNames[0])} alt={scene.title || `Cena ${scene.id}`} onError={() => {
    if (image || attempt >= sourceNames.length - 1) setMissing(true);
    else setAttempt((current) => current + 1);
  }} />;
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return <label className="editor-field"><span>{label}</span>{children}</label>;
}

function ParagraphEditor({ value, label, onChange, onRemove }: { value: string; label: string; onChange: (next: string) => void; onRemove?: () => void }) {
  return <div className="editor-paragraph-row">
    <Field label={label}><textarea rows={3} value={value} onChange={(event) => onChange(event.target.value)} /></Field>
    {onRemove ? <button type="button" className="editor-icon-button" title="Remover parágrafo" onClick={onRemove}>×</button> : null}
  </div>;
}

function ImageSelector({ value, scene, available, onChange, onUpload, fallbackName }: { value?: string; scene: Scene; available: string[]; onChange: (name: string) => void; onUpload: (file: File) => Promise<void>; fallbackName?: string }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    setUploading(true);
    setError("");
    try { await onUpload(file); }
    catch (reason) { setError(reason instanceof Error ? reason.message : "Falha ao enviar imagem."); }
    finally { setUploading(false); }
  };
  return <div className="editor-image-control">
    <SceneArtwork key={`${scene.id}:${fallbackName ?? ""}:${value ?? ""}`} scene={scene} image={value} fallbackName={fallbackName} />
    <div className="editor-image-actions">
      <Field label="Imagem da cena">
        <select value={value ?? ""} onChange={(event) => onChange(event.target.value)}>
          <option value="">Usar imagem padrão da cena ({padded(scene.id)}.*)</option>
          {available.map((name) => <option key={name} value={name}>{name}</option>)}
        </select>
      </Field>
      <label className="editor-upload">{uploading ? "Enviando…" : "Enviar imagem"}<input type="file" accept=".webp,.png,.jpg,.jpeg,.svg,image/*" disabled={uploading} onChange={handleFile} /></label>
      {value ? <button type="button" className="editor-link-button" onClick={() => onChange("")}>Limpar seleção</button> : null}
      {error ? <span className="editor-error">{error}</span> : null}
    </div>
  </div>;
}

export function AhsdSceneEditor() {
  const [scenes, setScenes] = useState(() => clone(originalScenes));
  const [endingData, setEndingData] = useState(() => clone(originalEndings));
  const [availableImages, setAvailableImages] = useState<string[]>([]);
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [message, setMessage] = useState("");
  const [filter, setFilter] = useState("");

  useEffect(() => {
    fetch("/__ahsd-editor/images").then((response) => response.ok ? response.json() as Promise<string[]> : []).then(setAvailableImages).catch(() => setAvailableImages([]));
  }, []);

  const updateScene = (id: number, update: (scene: Scene) => Scene) => setScenes((current) => current.map((scene) => scene.id === id ? update(scene) : scene));
  const updateChoice = (sceneId: number, index: number, update: (choice: Choice) => Choice) => updateScene(sceneId, (scene) => ({ ...scene, choices: (scene.choices ?? []).map((choice, choiceIndex) => choiceIndex === index ? update(choice) : choice) }));
  const uploadImage = async (sceneId: number, choiceIndex?: number) => async (file: File) => {
    const extension = file.name.split(".").pop()?.toLowerCase() ?? "";
    if (!imageExtensions.includes(extension as typeof imageExtensions[number])) throw new Error("Use WebP, PNG, JPG, JPEG ou SVG.");
    if (file.size > 20_000_000) throw new Error("A imagem deve ter menos de 20 MB.");
    const base = file.name.normalize("NFKD").replace(/[\u0300-\u036f]/g, "").replace(/\.[^.]+$/, "").replace(/[^a-zA-Z0-9_-]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 70) || "imagem";
    const suffix = choiceIndex === undefined ? "" : String.fromCharCode(97 + choiceIndex);
    const name = `${padded(sceneId)}${suffix}-${base}.${extension}`;
    const response = await fetch(`/__ahsd-editor/image?name=${encodeURIComponent(name)}`, { method: "PUT", body: file });
    if (!response.ok) throw new Error(await response.text() || "Falha ao salvar imagem.");
    setAvailableImages((current) => [...new Set([...current, name])].sort());
    if (choiceIndex === undefined) updateScene(sceneId, (scene) => ({ ...scene, image: name }));
    else updateChoice(sceneId, choiceIndex, (choice) => ({ ...choice, image: name }));
  };

  const validate = () => {
    if (scenes.length !== 30 || scenes.some((scene, index) => scene.id !== index + 1)) return "As 30 cenas e sua ordem são necessárias para a lógica atual do jogo.";
    if (scenes.slice(0, 29).some((scene) => !scene.choices?.length)) return "As cenas 1 a 29 precisam ter ao menos uma opção.";
    if (scenes.some((scene) => !scene.title.trim() || !scene.question.trim())) return "Preencha o título e a pergunta de todas as cenas.";
    if (!endingData.length) return "Mantenha ao menos um final.";
    const imageNames = [...scenes.map((scene) => scene.image), ...scenes.flatMap((scene) => scene.choices?.map((choice) => choice.image) ?? [])].filter(Boolean);
    if (imageNames.some((name) => !/^[a-zA-Z0-9][a-zA-Z0-9._-]{0,119}\.(webp|png|jpe?g|svg)$/i.test(name!))) return "O nome da imagem pode conter letras, números, ponto, hífen e sublinhado.";
    return "";
  };

  const saveToGame = async () => {
    const problem = validate();
    if (problem) { setSaveState("error"); setMessage(problem); return; }
    setSaveState("saving");
    setMessage("Gravando narrativa e opções em src/ahsd/story.ts…");
    try {
      const response = await fetch("/__ahsd-editor/story", { method: "PUT", headers: { "Content-Type": "text/plain; charset=utf-8" }, body: sourceFor(scenes, endingData) });
      if (!response.ok) throw new Error(await response.text() || "O servidor de edição não conseguiu salvar.");
      setSaveState("saved");
      setMessage("Salvo no jogo. O Vite atualiza a aplicação com este conteúdo.");
      window.setTimeout(() => setSaveState((current) => current === "saved" ? "idle" : current), 5000);
    } catch (reason) {
      setSaveState("error");
      setMessage(reason instanceof Error ? reason.message : "Não foi possível salvar no jogo. Abra o editor com npm run dev.");
    }
  };

  const downloadBackup = () => {
    const blob = new Blob([JSON.stringify({ scenes, endings: endingData }, null, 2)], { type: "application/json" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "super-desafios-cenas.json";
    link.click();
    window.setTimeout(() => URL.revokeObjectURL(link.href), 1000);
  };

  const importBackup = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;
    try {
      const data = JSON.parse(await file.text()) as { scenes?: Scene[]; endings?: Ending[] };
      if (!Array.isArray(data.scenes) || !Array.isArray(data.endings)) throw new Error("Arquivo incompatível: escolha um backup JSON exportado por este editor.");
      setScenes(data.scenes);
      setEndingData(data.endings);
      setSaveState("idle");
      setMessage("Backup carregado. Salve no jogo para aplicar as alterações.");
    } catch (reason) { setSaveState("error"); setMessage(reason instanceof Error ? reason.message : "Não foi possível ler o backup."); }
  };

  const visibleScenes = scenes.filter((scene) => `${padded(scene.id)} ${scene.title} ${scene.date}`.toLocaleLowerCase().includes(filter.toLocaleLowerCase()));

  return <main className="ahsd-editor">
    <header className="editor-header" id="inicio">
      <div className="editor-heading"><div className="editor-kicker">SUPER DESAFIOS · FERRAMENTAS DE AUTORIA</div><h1>Editor de cenas</h1><p>Edite narrativa, escolhas, atributos e imagens. Salvar grava os dados diretamente no jogo.</p></div>
      <div className="editor-header-actions"><a className="editor-secondary" href="/">Abrir jogo</a><label className="editor-secondary editor-import">Importar backup<input type="file" accept="application/json,.json" onChange={importBackup} /></label><button className="editor-secondary" type="button" onClick={downloadBackup}>Baixar backup JSON</button><button className="editor-save" type="button" disabled={saveState === "saving"} onClick={saveToGame}>{saveState === "saving" ? "Salvando…" : "Salvar no jogo"}</button></div>
      {message ? <div className={`editor-message ${saveState}`} role="status">{message}</div> : null}
    </header>

    <div className="editor-layout">
      <nav className="editor-nav" aria-label="Navegação das cenas">
        <label className="editor-search"><span>Localizar cena</span><input value={filter} onChange={(event) => setFilter(event.target.value)} placeholder="Número ou título" /></label>
        <div className="editor-nav-list">{visibleScenes.map((scene) => <a key={scene.id} href={`#scene-${scene.id}`}><span>{padded(scene.id)}</span>{scene.title || "Cena sem título"}</a>)}{!filter ? endingData.map((ending, index) => <a key={ending.id} href={`#ending-${index}`}><span>F{index + 1}</span>{ending.title || "Final sem título"}</a>) : null}</div>
        <a className="editor-back-top" href="#inicio">↑ Voltar ao início</a>
      </nav>

      <div className="editor-document">
        {visibleScenes.map((scene) => <section className="editor-scene" id={`scene-${scene.id}`} key={scene.id}>
          <header className="editor-scene-heading"><div><span className="editor-scene-number">CENA {padded(scene.id)} / 30</span><h2>{scene.title || "Cena sem título"}</h2></div><a href="#inicio">Topo ↑</a></header>
          <div className="editor-scene-grid">
            <ImageSelector value={scene.image} scene={scene} available={availableImages} onChange={(image) => updateScene(scene.id, (current) => ({ ...current, image: image || undefined }))} onUpload={uploadImage(scene.id)} />
            <div className="editor-meta-grid">
              <Field label="Título"><input value={scene.title} onChange={(event) => updateScene(scene.id, (current) => ({ ...current, title: event.target.value }))} /></Field>
              <Field label="Data / período"><input value={scene.date} onChange={(event) => updateScene(scene.id, (current) => ({ ...current, date: event.target.value }))} /></Field>
              <Field label="Idade"><input value={scene.age} onChange={(event) => updateScene(scene.id, (current) => ({ ...current, age: event.target.value }))} /></Field>
              <Field label="Complicador"><input value={scene.complicator} onChange={(event) => updateScene(scene.id, (current) => ({ ...current, complicator: event.target.value }))} /></Field>
              <fieldset className="editor-routes"><legend>Rotas em cena</legend>{routeKeys.map((route) => <label key={route}><input type="checkbox" checked={scene.routes.includes(route)} onChange={(event) => updateScene(scene.id, (current) => ({ ...current, routes: event.target.checked ? [...current.routes, route] : current.routes.filter((item) => item !== route) }))} />{routeLabels[route]}</label>)}</fieldset>
            </div>
          </div>
          <div className="editor-section-block"><div className="editor-section-title"><h3>Narrativa</h3><button className="editor-link-button" type="button" onClick={() => updateScene(scene.id, (current) => ({ ...current, event: [...current.event, ""] }))}>+ Parágrafo</button></div>
            {scene.event.map((paragraph, index) => <ParagraphEditor key={index} label={`Trecho ${index + 1}`} value={paragraph} onChange={(value) => updateScene(scene.id, (current) => ({ ...current, event: current.event.map((item, itemIndex) => itemIndex === index ? value : item) }))} onRemove={scene.event.length > 1 ? () => updateScene(scene.id, (current) => ({ ...current, event: current.event.filter((_, itemIndex) => itemIndex !== index) })) : undefined} />)}
          </div>
          <div className="editor-section-block"><h3>Pergunta</h3><Field label="Pergunta apresentada ao jogador"><textarea rows={2} value={scene.question} onChange={(event) => updateScene(scene.id, (current) => ({ ...current, question: event.target.value }))} /></Field></div>
          {scene.choices ? <div className="editor-section-block"><div className="editor-section-title"><h3>Opções e consequências</h3><button type="button" className="editor-link-button" disabled={scene.choices.length >= 4} onClick={() => updateScene(scene.id, (current) => ({ ...current, choices: [...(current.choices ?? []), { text: "", outcome: "", deltas: {}, plausible: false }] }))}>+ Opção</button></div>
            <div className="editor-choices">{scene.choices.map((choice, index) => <article className="editor-choice" key={index}>
              <header><strong>OPÇÃO {String.fromCharCode(65 + index)}</strong>{scene.choices!.length > 1 ? <button type="button" className="editor-icon-button" title="Remover opção" onClick={() => updateScene(scene.id, (current) => ({ ...current, choices: current.choices?.filter((_, choiceIndex) => choiceIndex !== index) }))}>Remover ×</button> : null}</header>
              <div className="editor-choice-grid"><Field label="Texto da opção"><textarea rows={3} value={choice.text} onChange={(event) => updateChoice(scene.id, index, (current) => ({ ...current, text: event.target.value }))} /></Field><Field label="Desfecho"><textarea rows={3} value={choice.outcome} onChange={(event) => updateChoice(scene.id, index, (current) => ({ ...current, outcome: event.target.value }))} /></Field></div>
              <div className="editor-choice-bottom"><label className="editor-plausible"><input type="checkbox" checked={choice.plausible} onChange={(event) => updateChoice(scene.id, index, (current) => ({ ...current, plausible: event.target.checked }))} /> Leitura plausível</label><div className="editor-deltas">{statKeys.map((key) => <Field key={key} label={statLabels[key]}><input type="number" step="1" value={choice.deltas[key] ?? 0} onChange={(event) => updateChoice(scene.id, index, (current) => ({ ...current, deltas: { ...current.deltas, [key]: Number(event.target.value) || 0 } }))} /></Field>)}</div></div>
              <details className="editor-outcome-image"><summary>Imagem desta consequência (opcional)</summary><ImageSelector value={choice.image} scene={scene} available={availableImages} fallbackName={`${padded(scene.id)}${String.fromCharCode(97 + index)}`} onChange={(image) => updateChoice(scene.id, index, (current) => ({ ...current, image: image || undefined }))} onUpload={uploadImage(scene.id, index)} /></details>
            </article>)}</div>
          </div> : null}
        </section>)}

        {!filter ? <section className="editor-endings" id="finals"><header className="editor-scene-heading"><div><span className="editor-scene-number">ENCERRAMENTOS</span><h2>Finais da história</h2></div><a href="#inicio">Topo ↑</a></header>
          {endingData.map((ending, index) => <article className="editor-ending" id={`ending-${index}`} key={ending.id}><header><h3>{ending.title || `Final ${index + 1}`}</h3><a href="#inicio">↑</a></header><div className="editor-meta-grid"><Field label="Título"><input value={ending.title} onChange={(event) => setEndingData((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, title: event.target.value } : item))} /></Field><Field label="Escolha final"><textarea rows={2} value={ending.choice} onChange={(event) => setEndingData((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, choice: event.target.value } : item))} /></Field></div>
            <div className="editor-section-block"><div className="editor-section-title"><h4>Texto do final</h4><button className="editor-link-button" type="button" onClick={() => setEndingData((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, body: [...item.body, ""] } : item))}>+ Parágrafo</button></div>{ending.body.map((paragraph, paragraphIndex) => <ParagraphEditor key={paragraphIndex} label={`Trecho ${paragraphIndex + 1}`} value={paragraph} onChange={(value) => setEndingData((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, body: item.body.map((text, textIndex) => textIndex === paragraphIndex ? value : text) } : item))} onRemove={ending.body.length > 1 ? () => setEndingData((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, body: item.body.filter((_, textIndex) => textIndex !== paragraphIndex) } : item)) : undefined} />)}</div>
            <div className="editor-deltas editor-ending-deltas">{statKeys.map((key) => <Field key={key} label={`${statLabels[key]} · ajuste final`}><input type="number" step="1" value={ending.statBias[key] ?? 0} onChange={(event) => setEndingData((current) => current.map((item, itemIndex) => itemIndex === index ? { ...item, statBias: { ...item.statBias, [key]: Number(event.target.value) || 0 } } : item))} /></Field>)}</div>
          </article>)}
        </section> : null}
        <footer className="editor-footer"><a href="#inicio">↑ Voltar ao início</a><button className="editor-save" type="button" disabled={saveState === "saving"} onClick={saveToGame}>{saveState === "saving" ? "Salvando…" : "Salvar alterações no jogo"}</button></footer>
      </div>
    </div>
  </main>;
}
