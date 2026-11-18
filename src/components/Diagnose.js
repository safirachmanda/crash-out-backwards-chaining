import { useState, useEffect, useMemo, useRef } from "react";
import {
  CpuIcon,
  ThermometerHotIcon,
  MonitorIcon,
  FileXIcon,
  PaperPlaneRightIcon,
  CheckCircleIcon,
  XCircleIcon,
  ArrowCounterClockwiseIcon,
  HouseIcon,
  WrenchIcon,
  CameraIcon,
  UploadSimpleIcon,
  XIcon,
  LaptopIcon,
  DesktopTowerIcon,
  ArrowRightIcon,
  DropIcon,
} from "@phosphor-icons/react";
import { img } from "../Assets";
import {
  CATEGORIES,
  DIAGNOSES,
  SYMPTOMS,
  catName,
  pct,
  verdict,
} from "../data/rules";
import { solve } from "../data/engine";
import "./Diagnose.css";

const VISUAL = {
  overheating: { image: img.overheating, Icon: ThermometerHotIcon },
  thermalpaste: { image: img.thermalPaste, Icon: DropIcon },
  bluescreen: { image: img.blueScreen, Icon: MonitorIcon },
  glitch: { image: img.glitch, Icon: CpuIcon },
  gpuvram: { image: img.gpuVram, Icon: DesktopTowerIcon },
  corrupted: { image: img.corrupted, Icon: FileXIcon },
};

const EMPTY_SPEC = {
  type: "",
  model: "",
  cpu: "",
  gpu: "",
  ram: "",
  storage: "",
  os: "",
};

/* ---------- Form spek (sebelum chat, tidak mempengaruhi perhitungan) ---------- */
function SpecForm({ spec, setSpec, onDone, onExit }) {
  const [error, setError] = useState("");

  const change = (e) => {
    setSpec({ ...spec, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = (e) => {
    e.preventDefault();
    if (!spec.type) return setError("Pilih dulu jenis perangkatmu.");
    onDone();
  };

  return (
    <form className="spec-card" onSubmit={submit} noValidate>
      <div className="spec-head">
        <span className="bot-avatar">
          <CpuIcon size={20} color="#fafafa" weight="fill" />
        </span>
        <div>
          <h2>Spek perangkatmu</h2>
          <p>Isi sebisanya saja. Data ini hanya sebagai catatan dan tidak mempengaruhi hasil diagnosa.</p>
        </div>
      </div>

      <p className="spec-label">Jenis perangkat</p>
      <div className="type-row">
        <button
          type="button"
          className={spec.type === "Laptop" ? "type-btn on" : "type-btn"}
          onClick={() => {
            setSpec({ ...spec, type: "Laptop" });
            setError("");
          }}
        >
          <LaptopIcon size={26} weight="duotone" /> Laptop
        </button>
        <button
          type="button"
          className={spec.type === "PC Desktop" ? "type-btn on" : "type-btn"}
          onClick={() => {
            setSpec({ ...spec, type: "PC Desktop" });
            setError("");
          }}
        >
          <DesktopTowerIcon size={26} weight="duotone" /> PC Desktop
        </button>
      </div>

      <div className="spec-grid">
        <label className="spec-field">
          <span>Merek / model</span>
          <input name="model" value={spec.model} onChange={change} placeholder="Contoh: ASUS VivoBook 14" />
        </label>
        <label className="spec-field">
          <span>Prosesor (CPU)</span>
          <input name="cpu" value={spec.cpu} onChange={change} placeholder="Contoh: Intel Core i5-1135G7" />
        </label>
        <label className="spec-field">
          <span>Kartu grafis (GPU)</span>
          <input name="gpu" value={spec.gpu} onChange={change} placeholder="Contoh: NVIDIA GTX 1650 / bawaan" />
        </label>
        <label className="spec-field">
          <span>RAM</span>
          <select name="ram" value={spec.ram} onChange={change}>
            <option value="">Pilih</option>
            <option>4 GB</option>
            <option>8 GB</option>
            <option>16 GB</option>
            <option>32 GB</option>
            <option>64 GB atau lebih</option>
            <option>Tidak tahu</option>
          </select>
        </label>
        <label className="spec-field">
          <span>Penyimpanan</span>
          <select name="storage" value={spec.storage} onChange={change}>
            <option value="">Pilih</option>
            <option>SSD</option>
            <option>HDD</option>
            <option>SSD + HDD</option>
            <option>Tidak tahu</option>
          </select>
        </label>
        <label className="spec-field">
          <span>Sistem operasi</span>
          <select name="os" value={spec.os} onChange={change}>
            <option value="">Pilih</option>
            <option>Windows 11</option>
            <option>Windows 10</option>
            <option>Windows lainnya</option>
            <option>Linux</option>
            <option>macOS</option>
            <option>Tidak tahu</option>
          </select>
        </label>
      </div>

      {error && <p className="error">{error}</p>}

      <div className="spec-actions">
        <button type="button" className="btn btn-ghost" onClick={onExit}>
          Kembali
        </button>
        <button type="submit" className="btn btn-dark">
          Mulai chat <ArrowRightIcon size={16} weight="bold" />
        </button>
      </div>
    </form>
  );
}

/* ---------- Screenshot & deskripsi tambahan (sebelum chat, semua opsional) ---------- */
function ExtraForm({ note, setNote, shot, setShot, onDone, onBack }) {
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (shot) URL.revokeObjectURL(shot.url);
    setShot({ url: URL.createObjectURL(f), name: f.name });
  };

  const removeShot = () => {
    if (shot) URL.revokeObjectURL(shot.url);
    setShot(null);
  };

  return (
    <div className="spec-card">
      <div className="spec-head">
        <span className="bot-avatar">
          <CameraIcon size={20} color="#fafafa" weight="fill" />
        </span>
        <div>
          <h2>Screenshot &amp; deskripsi tambahan</h2>
          <p>Boleh dikosongkan. Kalau tidak ada, langsung tekan OK untuk mulai chat.</p>
        </div>
      </div>

      <p className="spec-label">
        Screenshot masalah <span className="opt-tag">Opsional</span>
      </p>
      <div className="shot-row">
        {shot ? (
          <div className="shot">
            <img src={shot.url} alt="Screenshot masalah" />
            <span>{shot.name}</span>
            <button
              type="button"
              className="shot-x"
              aria-label="Hapus screenshot"
              onClick={removeShot}
            >
              <XIcon size={14} weight="bold" />
            </button>
          </div>
        ) : (
          <label className="upload">
            <UploadSimpleIcon size={18} />
            Upload screenshot masalah
            <input type="file" accept="image/*" onChange={onFile} hidden />
          </label>
        )}
      </div>

      <p className="spec-label">
        Deskripsi tambahan <span className="opt-tag">Opsional</span>
      </p>
      <textarea
        className="note"
        rows={4}
        placeholder="Contoh: PC mulai panas sejak ganti casing, kipas berisik terutama saat main game..."
        value={note}
        onChange={(e) => setNote(e.target.value)}
      />

      <div className="spec-actions">
        <button type="button" className="btn btn-ghost" onClick={onBack}>
          Kembali
        </button>
        <button type="button" className="btn btn-dark" onClick={onDone}>
          OK, mulai chat <ArrowRightIcon size={16} weight="bold" />
        </button>
      </div>
    </div>
  );
}


/* ---------- Pilih kategori (boleh lebih dari satu) ---------- */
function CategoryPicker({ done, picked, setPicked, onStart }) {
  const free = CATEGORIES.filter((c) => !done.includes(c.id));
  const toggle = (id) =>
    setPicked(picked.includes(id) ? picked.filter((x) => x !== id) : [...picked, id]);

  return (
    <div className="msg bot">
      <div className="bubble prompt wide">
        <p className="prompt-q">
          {done.length ? "Mau periksa masalah lain?" : "Pilih masalah yang mau ditelusuri"}
        </p>
        <p className="prompt-hint">Boleh pilih lebih dari satu.</p>
        <div className="hypo-grid">
          {CATEGORIES.map((c) => {
            const { image, Icon } = VISUAL[c.id];
            const isDone = done.includes(c.id);
            const on = picked.includes(c.id);
            return (
              <button
                key={c.id}
                type="button"
                disabled={isDone}
                className={`hypo-card${on ? " on" : ""}${isDone ? " done" : ""}`}
                onClick={() => toggle(c.id)}
              >
                <img src={image} alt={c.name} />
                <div>
                  <b>
                    <Icon size={16} weight="fill" /> {c.name}
                  </b>
                  <small>{isDone ? "Sudah diperiksa" : c.desc}</small>
                </div>
                {on && (
                  <span className="hypo-check">
                    <CheckCircleIcon size={22} weight="fill" />
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="pick-actions">
          <button
            type="button"
            className="btn btn-ghost btn-sm"
            onClick={() => setPicked(free.map((c) => c.id))}
          >
            Pilih semua
          </button>
          <button
            type="button"
            className="btn btn-dark btn-sm"
            disabled={!picked.length}
            onClick={onStart}
          >
            Mulai diagnosa{picked.length ? ` (${picked.length})` : ""}{" "}
            <ArrowRightIcon size={14} weight="bold" />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Pertanyaan gejala, tahap 1: Ya / Tidak ---------- */
function YesNoBubble({ id, number, onYes, onNo }) {
  const s = SYMPTOMS[id];
  return (
    <div className="msg bot">
      <div className="bubble prompt">
        <div className="q-tags">
          <span className="q-tag">Gejala ke-{number}</span>
        </div>
        <p className="prompt-q">{s.question}</p>
        {s.hint && <p className="prompt-hint">{s.hint}</p>}
        <div className="yn-row">
          <button type="button" className="yn-btn yes" onClick={onYes}>
            <CheckCircleIcon size={20} weight="fill" /> Ya
          </button>
          <button type="button" className="yn-btn no" onClick={onNo}>
            <XCircleIcon size={20} weight="fill" /> Tidak
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------- Tahap 2: pilihan kata (tanpa angka) ---------- */
function LevelBubble({ id, number, picked, setPicked, onSubmit }) {
  const s = SYMPTOMS[id];
  return (
    <div className="msg bot">
      <div className="bubble prompt">
        <div className="q-tags">
          <span className="q-tag">Gejala ke-{number}</span>
        </div>
        <p className="prompt-q">{s.levelQ}</p>
        <div className="options">
          {s.options.map((o, i) => (
            <label key={o.label} className={picked === i ? "opt on" : "opt"}>
              <input type="radio" name={`lv-${id}`} checked={picked === i} onChange={() => setPicked(i)} />
              <span className="dot" />
              <span className="opt-label">
                {o.label}
                {o.sub && <small>{o.sub}</small>}
              </span>
            </label>
          ))}
        </div>
        <button
          className="btn btn-dark btn-sm send"
          disabled={picked === null}
          onClick={() => onSubmit(picked)}
        >
          Kirim <PaperPlaneRightIcon size={14} weight="fill" />
        </button>
      </div>
    </div>
  );
}

/* ---------- Hasil ---------- */
function Results({ goals, cats, sol }) {
  const found = goals
    .filter((d) => sol.nodes[d]?.state === "yes")
    .map((d) => ({ id: d, cf: sol.nodes[d].cf }))
    .sort((a, b) => b.cf - a.cf);
  const top = found[0];

  return (
    <div className="after-card" style={{ "--d": "0ms" }}>
      <div className="after-head">
        <span className="after-icon">
          <WrenchIcon size={20} weight="fill" />
        </span>
        <div>
          <h3>Hasil diagnosis</h3>
          <p>
            {top
              ? `Yang paling mungkin: ${DIAGNOSES[top.id].name} (${pct(top.cf)}%).`
              : "Belum ada diagnosis yang terbukti dari jawabanmu."}
          </p>
        </div>
      </div>

      {found.length === 0 && (
        <p className="result-none">
          Jawabanmu belum memenuhi syarat diagnosis apa pun di {cats.map(catName).join(", ")}. Coba
          periksa masalah lain, atau ulangi dengan jawaban yang lebih sesuai. Kalau PC tetap
          bermasalah, bawa ke teknisi.
        </p>
      )}

      {found.length > 0 && (
        <div className="score-list">
          {found.map(({ id, cf }) => {
            const v = verdict(cf);
            return (
              <div key={id} className="score-row">
                <div className="score-top">
                  <span>{DIAGNOSES[id].short}</span>
                  <b className={v.tone}>
                    {pct(cf)}% · {v.label}
                  </b>
                </div>
                <div className="bar">
                  <div className={`bar-fill ${v.tone}`} style={{ width: `${pct(cf)}%` }} />
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="dx-list">
        {found.map(({ id, cf }) => {
          const d = DIAGNOSES[id];
          const v = verdict(cf);
          return (
            <article key={id} className="dx">
              <header className="dx-head">
                <div>
                  <h4>Rekomendasi: {d.short}</h4>
                  <small>
                    Keyakinan {pct(cf)}% · {v.label}
                  </small>
                </div>
              </header>
              <ol className="steps">
                {d.solutions.map((s, i) => (
                  <li key={i}>
                    <span className="step-no">{i + 1}</span>
                    <p>{s}</p>
                  </li>
                ))}
              </ol>
            </article>
          );
        })}
      </div>
    </div>
  );
}

/* ---------- Halaman utama ---------- */
function Diagnose({ user, onExit }) {
  const firstName = user?.name?.split(" ")[0] || "kamu";

  const [spec, setSpec] = useState(EMPTY_SPEC);
  const [specDone, setSpecDone] = useState(false);
  const [extraDone, setExtraDone] = useState(false);
  const [note, setNote] = useState("");
  const [shot, setShot] = useState(null); // { url, name }

  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState("pick"); // pick | ask | done
  const [picked, setPicked] = useState([]); // kategori yang dicentang
  const [cats, setCats] = useState([]); // kategori yang sudah dimulai
  const [wm, setWm] = useState({}); // jawaban: { G1: { answer, cf } }
  const [stage, setStage] = useState("yn"); // yn | level
  const [lv, setLv] = useState(null);
  const [typing, setTyping] = useState(false);

  const idRef = useRef(1);
  const timers = useRef([]);
  const bodyRef = useRef(null);
  const afterRef = useRef(null);

  const later = (fn, ms) => {
    timers.current.push(setTimeout(fn, ms));
  };
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const add = (...items) => {
    const withIds = items.map((it) => ({ id: idRef.current++, ...it }));
    setMessages((m) => [...m, ...withIds]);
  };

  const goals = useMemo(
    () => cats.flatMap((c) => CATEGORIES.find((x) => x.id === c).goals),
    [cats]
  );
  const sol = useMemo(() => solve(goals, wm), [goals, wm]);

  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, phase, sol.ask, stage]);

  useEffect(() => {
    if (phase !== "done") return;
    const t = setTimeout(() => {
      afterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1200);
    return () => clearTimeout(t);
  }, [phase]);

  const startChat = () => {
    const parts = [spec.type, spec.model].filter(Boolean).join(" ");
    const extras = [shot && "screenshot", note.trim() && "deskripsi tambahan"].filter(Boolean);
    setExtraDone(true);
    window.scrollTo({ top: 0 });
    add(
      { from: "bot", text: `Hai ${firstName}! Aku sudah catat perangkatmu: ${parts}.` },
      ...(extras.length ? [{ from: "bot", text: `${extras.join(" dan ")} darimu juga sudah kucatat.` }] : []),
      { from: "bot", text: "Sekarang, masalah apa yang mau kita telusuri di PC-mu?" }
    );
  };

  const finish = () => {
    add({ from: "bot", text: "Selesai. Hasil dan rekomendasinya ada di bawah." });
    setPhase("done");
  };

  const startCats = () => {
    const names = picked.map(catName).join(", ");
    const newCats = [...cats, ...picked];
    const newGoals = newCats.flatMap((c) => CATEGORIES.find((x) => x.id === c).goals);
    add({ from: "user", text: names });
    setTyping(true);
    later(() => {
      const after = solve(newGoals, wm);
      add({
        from: "bot",
        text: `Oke, kita telusuri ${names}. Aku tanya satu per satu, dan pertanyaannya akan makin mengerucut sesuai jawabanmu.`,
      });
      setCats(newCats);
      setPicked([]);
      setStage("yn");
      setLv(null);
      if (after.ask) setPhase("ask");
      else finish();
      setTyping(false);
    }, 700);
  };

  // simpan jawaban, hitung ulang, lanjut ke pertanyaan berikutnya
  const record = (g, answer, cf) => {
    const wm2 = { ...wm, [g]: { answer, cf } };
    const after = solve(goals, wm2);
    setWm(wm2);
    setStage("yn");
    setLv(null);
    setTyping(true);
    later(() => {
      if (!after.ask) finish();
      setTyping(false);
    }, 600);
  };

  const answerNo = () => {
    const g = sol.ask;
    add({ from: "bot", text: SYMPTOMS[g].question }, { from: "user", text: "Tidak" });
    record(g, "no", 0);
  };

  const answerYes = () => {
    const g = sol.ask;
    add({ from: "bot", text: SYMPTOMS[g].question }, { from: "user", text: "Ya" });
    setStage("level");
  };

  const answerLevel = (i) => {
    const g = sol.ask;
    const o = SYMPTOMS[g].options[i];
    add({ from: "bot", text: SYMPTOMS[g].levelQ }, { from: "user", text: o.label });
    record(g, "yes", o.cf);
  };

  const another = () => {
    add({ from: "user", text: "Periksa masalah lain" });
    setPicked([]);
    setPhase("pick");
  };

  const restart = () => {
    timers.current.forEach(clearTimeout);
    setMessages([]);
    setWm({});
    setCats([]);
    setPicked([]);
    setStage("yn");
    setLv(null);
    setTyping(false);
    setPhase("pick");
    add({ from: "bot", text: "Diagnosa diulang dari awal. Masalah apa yang mau kita telusuri?" });
  };

  const showPick = !typing && phase === "pick" && extraDone && messages.length > 0;
  const showAsk = !typing && phase === "ask" && sol.ask;
  const showEnd = !typing && phase === "done";
  const canMore = cats.length < CATEGORIES.length;
  const number = Object.keys(wm).length + 1;
  const specSummary = [spec.type, spec.cpu].filter(Boolean).join(" · ");

  if (!specDone) {
    return (
      <section className="diag">
        <div className="diag-shell">
          <SpecForm
            spec={spec}
            setSpec={setSpec}
            onDone={() => {
              setSpecDone(true);
              window.scrollTo({ top: 0 });
            }}
            onExit={onExit}
          />
        </div>
      </section>
    );
  }

  if (!extraDone) {
    return (
      <section className="diag">
        <div className="diag-shell">
          <ExtraForm
            note={note}
            setNote={setNote}
            shot={shot}
            setShot={setShot}
            onDone={startChat}
            onBack={() => setSpecDone(false)}
          />
        </div>
      </section>
    );
  }

  return (
    <section className="diag">
      <div className="diag-shell">
        <div className="chat">
          <div className="chat-head">
            <span className="bot-avatar">
              <CpuIcon size={20} color="#fafafa" weight="fill" />
            </span>
            <div>
              <strong>Asisten crash-out</strong>
              <small>{specSummary || "Troubleshooting PC pintar"}</small>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onExit}>
              <HouseIcon size={14} weight="bold" /> Beranda
            </button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m) => (
              <div key={m.id} className={`msg ${m.from}`}>
                <div className="bubble">{m.text}</div>
              </div>
            ))}

            {typing && (
              <div className="msg bot">
                <div className="bubble typing">
                  <span /> <span /> <span />
                </div>
              </div>
            )}

            {showPick && (
              <CategoryPicker done={cats} picked={picked} setPicked={setPicked} onStart={startCats} />
            )}

            {showAsk && stage === "yn" && (
              <YesNoBubble key={`yn-${sol.ask}`} id={sol.ask} number={number} onYes={answerYes} onNo={answerNo} />
            )}

            {showAsk && stage === "level" && (
              <LevelBubble
                key={`lv-${sol.ask}`}
                id={sol.ask}
                number={number}
                picked={lv}
                setPicked={setLv}
                onSubmit={answerLevel}
              />
            )}

            {showEnd && (
              <div className="end-actions">
                {canMore && (
                  <button className="btn btn-dark btn-sm" onClick={another}>
                    <ArrowRightIcon size={14} weight="bold" /> Cek masalah lain
                  </button>
                )}
                <button className="btn btn-ghost btn-sm" onClick={restart}>
                  <ArrowCounterClockwiseIcon size={14} weight="bold" /> Ulangi dari awal
                </button>
                <button className="btn btn-ghost btn-sm" onClick={onExit}>
                  Kembali ke beranda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {phase === "done" && (
        <div className="diag-after" ref={afterRef}>
          <Results goals={goals} cats={cats} sol={sol} />
        </div>
      )}
    </section>
  );
}

export default Diagnose;
