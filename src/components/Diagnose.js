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
  NotePencilIcon,
  UploadSimpleIcon,
  XIcon,
  ArrowDownIcon,
} from "@phosphor-icons/react";
import { img } from "../Assets";
import { LEVELS, HYPOTHESES, calcCF, verdict } from "../data/rules";
import "./Diagnose.css";

const THRESHOLD = 40; // batas persentase hipotesis dianggap cocok

const VISUAL = {
  overheating: { image: img.overheating, Icon: ThermometerHotIcon },
  bluescreen: { image: img.blueScreen, Icon: MonitorIcon },
  glitch: { image: img.glitch, Icon: CpuIcon },
  corrupted: { image: img.corrupted, Icon: FileXIcon },
};

/* ---------- Bubble hasil: skor confidence + ringkasan ---------- */
function ResultCard({ hypo, res }) {
  const pct = Math.round(res.cf * 100);
  const v = verdict(res.cf);
  const match = pct >= THRESHOLD;

  // gejala yang kamu jawab cukup yakin ke atas (>= 0.6)
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
            <p className="result-sub">Gejala yang kamu yakini:</p>
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
            <ArrowDownIcon size={14} weight="bold" /> Cara penanganan dan
            deskripsi tambahan ada di bawah
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

  const [messages, setMessages] = useState(() => [
    { id: 1, from: "bot", text: `Hai ${firstName}! Aku bantu cari tahu kenapa PC-mu bermasalah ya.` },
    { id: 2, from: "bot", text: "Apa hipotesis masalah PC-mu?" },
  ]);
  const [phase, setPhase] = useState("pick"); // pick | ask | result | low
  const [hypo, setHypo] = useState(null);
  const [qIndex, setQIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [typing, setTyping] = useState(false);
  const [result, setResult] = useState(null); // { hypo, res } hanya kalau skor cocok

  // deskripsi tambahan
  const [note, setNote] = useState("");
  const [shot, setShot] = useState(null); // { url, name }
  const [saved, setSaved] = useState(false);

  const idRef = useRef(3);
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

  /* 1. user memilih hipotesis (goal) */
  const pickHypothesis = (h) => {
    add({ from: "user", text: h.name });
    setTyping(true);
    later(() => {
      add({
        from: "bot",
        text: `Oke, kita uji "${h.name}". Aku akan cek ${h.symptoms.length} gejala satu per satu sebagai bukti.`,
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
    const level = LEVELS[selected];
    const symptom = hypo.symptoms[qIndex];
    const nextAnswers = [...answers, level];

    add({ from: "bot", text: symptom.question }, { from: "user", text: level.label });
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
          // hipotesis cocok -> tampilkan troubleshooting + deskripsi di bawah
          setResult({ hypo, res });
          setPhase("result");
          setTyping(false);
        } else {
          // kemungkinan kecil -> bot tanya mau cek lagi atau tidak
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
    setNote("");
    setShot(null);
    setSaved(false);
    setTyping(true);
    later(() => {
      add({ from: "bot", text: "Siap! Hipotesis mana yang mau diuji berikutnya?" });
      setHypo(null);
      setAnswers([]);
      setQIndex(0);
      setTyping(false);
    }, 700);
  };

  /* deskripsi tambahan */
  const onFile = (e) => {
    const f = e.target.files?.[0];
    if (!f) return;
    setShot({ url: URL.createObjectURL(f), name: f.name });
    setSaved(false);
  };

  const showPick = !typing && phase === "pick";
  const showAsk = !typing && phase === "ask" && hypo;
  const showEnd = !typing && phase === "result";
  const showLow = !typing && phase === "low";

  return (
    <section className="diag">
      <div className="diag-shell">
        {/* ---------- Chat ---------- */}
        <div className="chat">
          <div className="chat-head">
            <span className="bot-avatar">
              <CpuIcon size={20} color="#fafafa" weight="fill" />
            </span>
            <div>
              <strong>Asisten Crash-Out</strong>
              <small>Diagnosa dengan Certainty Factor</small>
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

            {/* pertanyaan gejala dengan 5 tingkat keyakinan */}
            {showAsk && (
              <div className="msg bot">
                <div className="bubble prompt">
                  <span className="q-tag">
                    Pertanyaan {qIndex + 1} dari {hypo.symptoms.length}
                  </span>
                  <p className="prompt-q">{hypo.symptoms[qIndex].question}</p>
                  <div className="options">
                    {LEVELS.map((l, i) => (
                      <label key={l.label} className={selected === i ? "opt on" : "opt"}>
                        <input
                          type="radio"
                          name="level"
                          checked={selected === i}
                          onChange={() => setSelected(i)}
                        />
                        <span className="dot" />
                        <span className="opt-label">{l.label}</span>
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

      {/* ---------- Di bawah chat: 2 bagian, hanya muncul kalau skor cocok ---------- */}
      {result && (
        <div className="diag-after" ref={afterRef}>
          {/* 1. Cara troubleshooting */}
          <div className="after-card" style={{ "--d": "0ms" }}>
            <div className="after-head">
              <span className="after-icon">
                <WrenchIcon size={20} weight="fill" />
              </span>
              <div>
                <h3>Cara Troubleshooting</h3>
                <p>Penanganan untuk {result.hypo.name}</p>
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

          {/* 2. Deskripsi tambahan */}
          <div className="after-card" style={{ "--d": "150ms" }}>
            <div className="after-head">
              <span className="after-icon">
                <NotePencilIcon size={20} weight="fill" />
              </span>
              <div>
                <h3>Deskripsi Tambahan</h3>
                <p>Ceritakan hal lain yang belum tertanya di chat</p>
              </div>
            </div>

            <textarea
              className="note"
              rows={5}
              placeholder="Contoh: PC mulai panas sejak ganti casing, kipas berisik terutama saat main game..."
              value={note}
              onChange={(e) => {
                setNote(e.target.value);
                setSaved(false);
              }}
            />

            <div className="shot-row">
              {shot ? (
                <div className="shot">
                  <img src={shot.url} alt="Screenshot masalah" />
                  <span>{shot.name}</span>
                  <button
                    type="button"
                    className="shot-x"
                    aria-label="Hapus screenshot"
                    onClick={() => {
                      setShot(null);
                      setSaved(false);
                    }}
                  >
                    <XIcon size={14} weight="bold" />
                  </button>
                </div>
              ) : (
                <label className="upload">
                  <UploadSimpleIcon size={18} />
                  Upload screenshot masalah (opsional)
                  <input type="file" accept="image/*" onChange={onFile} hidden />
                </label>
              )}
            </div>

            <div className="note-actions">
              <button
                className="btn btn-dark btn-sm"
                disabled={!note.trim() && !shot}
                onClick={() => setSaved(true)}
              >
                Simpan deskripsi
              </button>
              {saved && (
                <span className="saved">
                  <CheckCircleIcon size={16} weight="fill" /> Tersimpan
                </span>
              )}
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

export default Diagnose;