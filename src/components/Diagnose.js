import { useState, useEffect, useRef } from "react";
import {
  CpuIcon,
  ThermometerHotIcon,
  MonitorIcon,
  FileXIcon,
  PaperPlaneRightIcon,
  CheckCircleIcon,
  ArrowCounterClockwiseIcon,
  HouseIcon,
  WrenchIcon,
  CameraIcon,
  UploadSimpleIcon,
  XIcon,
  ArrowDownIcon,
  LaptopIcon,
  DesktopTowerIcon,
  ArrowRightIcon,
} from "@phosphor-icons/react";
import { img } from "../Assets";
import { HYPOTHESES, calcCF, verdict } from "../data/rules";
import "./Diagnose.css";

const THRESHOLD = 40; // batas persentase hipotesis dianggap cocok

const VISUAL = {
  overheating: { image: img.overheating, Icon: ThermometerHotIcon },
  bluescreen: { image: img.blueScreen, Icon: MonitorIcon },
  glitch: { image: img.glitch, Icon: CpuIcon },
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

/* ---------- Bubble hasil: skor confidence + ringkasan ---------- */
function ResultCard({ hypo, res }) {
  const pct = Math.round(res.cf * 100);
  const v = verdict(res.cf);
  const match = pct >= THRESHOLD;

  // gejala yang jawabannya kuat (>= 0.6)
  const strong = res.rows.filter((r) => r.user >= 0.6);

  return (
    <div className="msg bot">
      <div className="bubble result">
        <p className="result-intro">Semua gejala sudah dicek. Berikut hasilnya:</p>

        <div className={`result-pct ${v.tone}`}>
          <strong>{pct}%</strong>
          <span>{v.label}</span>
        </div>
        <div className="bar">
          <div className={`bar-fill ${v.tone}`} style={{ width: `${pct}%` }} />
        </div>

        <p className="result-line">
          {match ? (
            <>
              Skor confidence-ku adalah <b>{pct}%</b>, artinya PC-mu mengalami
              masalah <b>{hypo.name}</b>.
            </>
          ) : (
            <>
              Skor confidence-ku hanya <b>{pct}%</b>, jadi PC-mu kemungkinan
              kecil mengalami <b>{hypo.name}</b>.
            </>
          )}
        </p>

        {strong.length > 0 && (
          <>
            <p className="result-sub">Yang kamu laporkan:</p>
            <ul className="result-list">
              {strong.map((r, i) => (
                <li key={i}>
                  <CheckCircleIcon size={16} weight="fill" />
                  <span>
                    {r.question} <em>{r.userLabel}</em>
                  </span>
                </li>
              ))}
            </ul>
          </>
        )}

        {match && (
          <p className="result-hint">
            <ArrowDownIcon size={14} weight="bold" /> Rekomendasi perbaikan ada di bawah
          </p>
        )}

        <details className="calc">
          <summary>Lihat perhitungan</summary>
          <table>
            <thead>
              <tr>
                <th>Gejala</th>
                <th>Pakar</th>
                <th>User</th>
                <th>CF</th>
              </tr>
            </thead>
            <tbody>
              {res.rows.map((r, i) => (
                <tr key={i}>
                  <td>{r.question}</td>
                  <td>{r.expert}</td>
                  <td>
                    {r.user} <small>({r.userLabel})</small>
                  </td>
                  <td>{r.value.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className="calc-note">
            CF(gejala) = pakar × user. Gabungan: CFlama + CFbaru × (1 − CFlama).
          </p>
        </details>
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

  const [messages, setMessages] = useState([]);
  const [phase, setPhase] = useState("pick"); // pick | ask | result | low
  const [hypo, setHypo] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]); // opsi yang dipilih per gejala
  const [selected, setSelected] = useState(null);
  const [typing, setTyping] = useState(false);
  const [result, setResult] = useState(null); // { hypo, res } hanya kalau skor cocok

  // screenshot & deskripsi tambahan (diisi sebelum chat)
  const [note, setNote] = useState("");
  const [shot, setShot] = useState(null); // { url, name }

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

  // chat selalu scroll ke bawah
  useEffect(() => {
    const el = bodyRef.current;
    if (el) el.scrollTo({ top: el.scrollHeight, behavior: "smooth" });
  }, [messages, typing, qIndex, phase]);

  // setelah hasil cocok keluar, halaman scroll ke dua bagian di bawah chat
  useEffect(() => {
    if (!result) return;
    const t = setTimeout(() => {
      afterRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 1800);
    return () => clearTimeout(t);
  }, [result]);

  /* 0. spek selesai diisi -> mulai chat */
  const startChat = () => {
    const parts = [spec.type, spec.model].filter(Boolean).join(" ");
    const extras = [shot && "screenshot", note.trim() && "deskripsi tambahan"].filter(Boolean);
    setExtraDone(true);
    window.scrollTo({ top: 0 });
    add(
      { from: "bot", text: `Hai ${firstName}! Aku sudah catat perangkatmu: ${parts}.` },
      ...(extras.length
        ? [{ from: "bot", text: `${extras.join(" dan ")} darimu juga sudah kucatat.` }]
        : []),
      { from: "bot", text: "Sekarang, apa hipotesis masalah PC-mu?" }
    );
  };

  /* 1. user memilih hipotesis (goal) */
  const pickHypothesis = (h) => {
    add({ from: "user", text: h.name });
    setTyping(true);
    later(() => {
      add({
        from: "bot",
        text: `Oke, kita uji "${h.name}". Aku akan tanya ${h.symptoms.length} hal satu per satu sebagai bukti.`,
      });
      setHypo(h);
      setQIndex(0);
      setAnswers([]);
      setSelected(null);
      setPhase("ask");
      setTyping(false);
    }, 800);
  };

  /* 2. user menjawab pertanyaan gejala */
  const sendAnswer = () => {
    if (selected === null || !hypo) return;
    const symptom = hypo.symptoms[qIndex];
    const option = symptom.options[selected];
    const nextAnswers = [...answers, option];

    add({ from: "bot", text: symptom.question }, { from: "user", text: option.label });
    setAnswers(nextAnswers);
    setSelected(null);
    setTyping(true);

    if (qIndex + 1 < hypo.symptoms.length) {
      later(() => {
        setQIndex(qIndex + 1);
        setTyping(false);
      }, 600);
    } else {
      // 3. semua bukti terkumpul -> hitung CF
      later(() => {
        const res = calcCF(hypo, nextAnswers);
        const pct = Math.round(res.cf * 100);
        add({ from: "bot", type: "result", hypo, res });

        if (pct >= THRESHOLD) {
          setResult({ hypo, res });
          setPhase("result");
          setTyping(false);
        } else {
          setPhase("low");
          later(() => {
            add({
              from: "bot",
              text: `Sepertinya tidak ada yang cocok dengan gejalamu untuk "${hypo.name}". Apakah mau cek masalah lain?`,
            });
            setTyping(false);
          }, 900);
        }
      }, 1100);
    }
  };

  /* 4. uji hipotesis lain */
  const another = () => {
    add({ from: "user", text: "Cek masalah lain" });
    setPhase("pick");
    setResult(null);
    setTyping(true);
    later(() => {
      add({ from: "bot", text: "Siap! Hipotesis mana yang mau diuji berikutnya?" });
      setHypo(null);
      setAnswers([]);
      setQIndex(0);
      setTyping(false);
    }, 700);
  };

  const showPick = !typing && phase === "pick";
  const showAsk = !typing && phase === "ask" && hypo;
  const showEnd = !typing && phase === "result";
  const showLow = !typing && phase === "low";

  // ringkasan spek singkat untuk header chat
  const specSummary = [spec.type, spec.cpu].filter(Boolean).join(" · ");

  /* ---------- Tahap 1: form spek ---------- */
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

  /* ---------- Tahap 2: screenshot & deskripsi tambahan (opsional) ---------- */
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

  /* ---------- Tahap 3: chat ---------- */
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
              <small>{specSummary || "Diagnosa dengan Certainty Factor"}</small>
            </div>
            <button className="btn btn-ghost btn-sm" onClick={onExit}>
              <HouseIcon size={14} weight="bold" /> Beranda
            </button>
          </div>

          <div className="chat-body" ref={bodyRef}>
            {messages.map((m) =>
              m.type === "result" ? (
                <ResultCard key={m.id} hypo={m.hypo} res={m.res} />
              ) : (
                <div key={m.id} className={`msg ${m.from}`}>
                  <div className="bubble">{m.text}</div>
                </div>
              )
            )}

            {typing && (
              <div className="msg bot">
                <div className="bubble typing">
                  <span /> <span /> <span />
                </div>
              </div>
            )}

            {/* pilih hipotesis */}
            {showPick && (
              <div className="msg bot">
                <div className="bubble prompt wide">
                  <p className="prompt-q">Pilih masalah yang mau diuji</p>
                  <div className="hypo-grid">
                    {HYPOTHESES.map((h) => {
                      const { image, Icon } = VISUAL[h.id];
                      return (
                        <button key={h.id} className="hypo-card" onClick={() => pickHypothesis(h)}>
                          <img src={image} alt={h.name} />
                          <div>
                            <b>
                              <Icon size={16} weight="fill" /> {h.name}
                            </b>
                            <small>{h.symptoms.length} pertanyaan</small>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* pertanyaan gejala dengan pilihan sesuai pertanyaan */}
            {showAsk && (
              <div className="msg bot">
                <div className="bubble prompt">
                  <span className="q-tag">
                    Pertanyaan {qIndex + 1} dari {hypo.symptoms.length}
                  </span>
                  <p className="prompt-q">{hypo.symptoms[qIndex].question}</p>
                  <div className="options">
                    {hypo.symptoms[qIndex].options.map((o, i) => (
                      <label key={`${qIndex}-${o.label}`} className={selected === i ? "opt on" : "opt"}>
                        <input
                          type="radio"
                          name={`q-${qIndex}`}
                          checked={selected === i}
                          onChange={() => setSelected(i)}
                        />
                        <span className="dot" />
                        <span className="opt-label">
                          {o.label}
                          {o.hint && <small>{o.hint}</small>}
                        </span>
                      </label>
                    ))}
                  </div>
                  <button
                    className="btn btn-dark btn-sm send"
                    disabled={selected === null}
                    onClick={sendAnswer}
                  >
                    Kirim <PaperPlaneRightIcon size={14} weight="fill" />
                  </button>
                </div>
              </div>
            )}

            {/* skor cocok */}
            {showEnd && (
              <div className="end-actions">
                <button className="btn btn-dark btn-sm" onClick={another}>
                  <ArrowCounterClockwiseIcon size={14} weight="bold" /> Cek masalah lain
                </button>
                <button className="btn btn-ghost btn-sm" onClick={onExit}>
                  Kembali ke beranda
                </button>
              </div>
            )}

            {/* skor kecil -> tanya mau cek lagi */}
            {showLow && (
              <div className="end-actions">
                <button className="btn btn-dark btn-sm" onClick={another}>
                  <ArrowCounterClockwiseIcon size={14} weight="bold" /> Ya, cek lagi
                </button>
                <button className="btn btn-ghost btn-sm" onClick={onExit}>
                  Tidak, kembali ke beranda
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ---------- Di bawah chat: hanya muncul kalau skor cocok ---------- */}
      {result && (
        <div className="diag-after" ref={afterRef}>
          <div className="after-card" style={{ "--d": "0ms" }}>
            <div className="after-head">
              <span className="after-icon">
                <WrenchIcon size={20} weight="fill" />
              </span>
              <div>
                <h3>Rekomendasi Perbaikan</h3>
                <p>Saran penanganan untuk {result.hypo.name}</p>
              </div>
            </div>

            <ol className="steps">
              {result.hypo.solutions.map((s, i) => (
                <li key={i}>
                  <span className="step-no">{i + 1}</span>
                  <p>{s}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      )}
    </section>
  );
}

export default Diagnose;