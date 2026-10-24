import { useState, useEffect, useRef } from "react";
import {
  PuzzlePieceIcon,
  BinocularsIcon,
  ChartLineIcon,
  WalletIcon,
  ArrowRightIcon,
  CaretLeftIcon,
  CaretRightIcon,
  StarIcon,
  ThermometerHotIcon,
  MonitorIcon,
  CpuIcon,
  FileXIcon,
  ChatCircleDotsIcon,
  WrenchIcon,
  ShieldCheckIcon,
  ListChecksIcon,
  LeafIcon,
} from "@phosphor-icons/react";
import { img } from "../Assets";

const heroSlides = [img.main1, img.main2, img.main3];

const problems = [
  { image: img.overheating, icon: <ThermometerHotIcon size={18} weight="fill" />, name: "Overheating", text: "CPU atau GPU panas, kipas berisik, performa lambat" },
  { image: img.blueScreen, icon: <MonitorIcon size={18} weight="fill" />, name: "Blue Screen", text: "Crash mendadak dan kode error (BSOD)" },
  { image: img.glitch, icon: <CpuIcon size={18} weight="fill" />, name: "Graphic Glitch", text: "Artefak, layar berkedip, atau tampilan rusak" },
  { image: img.corrupted, icon: <FileXIcon size={18} weight="fill" />, name: "Corrupted Install", text: "File rusak saat install aplikasi" },
];

const features = [
  {
    image: img.confidence,
    badge: "Certainty Factor",
    title: "Hasil dengan tingkat keyakinan",
    text: "Setiap jawaban membawa tingkat keyakinanmu, jadi hasilnya berupa persentase, bukan sekadar ya atau tidak.",
    meta: [
      { icon: <ChartLineIcon size={16} />, label: "Persentase CF" },
      { icon: <ChatCircleDotsIcon size={16} />, label: "Pilihan jawaban mudah" },
    ],
  },
  {
    image: img.steps,
    badge: "Panduan perbaikan",
    title: "Penanganan langkah demi langkah",
    text: "Setelah masalah ketemu, kamu dapat langkah perbaikan yang jelas, satu per satu.",
    meta: [
      { icon: <ListChecksIcon size={16} />, label: "Langkah jelas" },
      { icon: <WrenchIcon size={16} />, label: "Sesuai masalah" },
    ],
  },
];

const stats = [
  { icon: <PuzzlePieceIcon size={32} color="#fafafa" />, value: "4+", label: "Jenis masalah" },
  { icon: <BinocularsIcon size={32} color="#fafafa" />, value: "20+", label: "Gejala dicek" },
  { icon: <ChartLineIcon size={32} color="#fafafa" />, value: "Mudah", label: "Pilihan jawaban" },
  { icon: <WalletIcon size={32} color="#fafafa" />, value: "Gratis", label: "Dipakai" },
];

const reviews = [
  { user: "User 1", avatar: img.pp1, diagnose: "Overheating", stars: 5, text: "Suara kipas akhirnya hilang setelah ikuti langkahnya!" },
  { user: "User 2", avatar: img.pp2, diagnose: "Blue Screen", stars: 4, text: "Pertanyaannya gampang, dan hasilnya sesuai masalahku." },
  { user: "User 3", avatar: img.pp3, diagnose: "Graphic Glitch", stars: 5, text: "Tadinya bingung mulai dari mana, sekarang jadi tahu." },
  { user: "User 4", avatar: img.pp4, diagnose: "Corrupted Install", stars: 4, text: "Simpel dan cepat, tanpa istilah teknis yang ribet." },
  { user: "User 5", avatar: img.pp5, diagnose: "Overheating", stars: 5, text: "Persentase keyakinannya bikin hasilnya gampang dipercaya." },
];

/* Elemen meluncur masuk saat muncul di layar.
   dir: "up" | "left" | "right", delay dalam ms (untuk jeda berurutan) */
function Reveal({ as: Tag = "div", className = "", dir = "up", delay = 0, children, ...rest }) {
  const ref = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`reveal ${dir} ${shown ? "in" : ""} ${className}`}
      style={{ "--d": `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
}

const getPerView = () => (window.innerWidth <= 900 ? 1 : 3);

function Home({ onStart }) {
  const [slide, setSlide] = useState(0);
  const [index, setIndex] = useState(0);
  const [perView, setPerView] = useState(getPerView);
  const [paused, setPaused] = useState(false);

  const maxIndex = reviews.length - perView;
  const safeIndex = Math.min(index, maxIndex);

  // latar hero berganti tiap 5 detik
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % heroSlides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slide]);

  useEffect(() => {
    const onResize = () => setPerView(getPerView());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  // ulasan bergeser otomatis tiap 4,5 detik (berhenti saat di-hover)
  useEffect(() => {
    if (paused) return;
    const timer = setInterval(() => {
      setIndex((i) => {
        const cur = Math.min(i, maxIndex);
        return cur >= maxIndex ? 0 : cur + 1;
      });
    }, 4500);
    return () => clearInterval(timer);
  }, [paused, maxIndex, index]);

  const prev = () => setIndex(safeIndex <= 0 ? maxIndex : safeIndex - 1);
  const next = () => setIndex(safeIndex >= maxIndex ? 0 : safeIndex + 1);

  return (
    <main id="top">
      {/* ============ BAGIAN 1: HERO ============ */}
      <section className="hero">
        <div className="hero-slides">
          {heroSlides.map((src, i) => (
            <img
              key={i}
              src={src}
              alt=""
              className={i === slide ? "hero-slide active" : "hero-slide"}
            />
          ))}
        </div>
        <div className="hero-overlay" />

        <div className="hero-text">
          <p className="eyebrow">TROUBLESHOOTING PC · SISTEM PAKAR</p>
          <h1>
            Siap diagnosa
            <br />
            <em>PC-mu bareng kami?</em>
          </h1>
          <p className="hero-sub">
            Ceritakan masalahnya, jawab beberapa pertanyaan, dan cari tahu
            kenapa PC-mu bermasalah, lengkap dengan cara memperbaikinya.
          </p>
          <button className="btn btn-dark btn-lg" onClick={onStart}>
            Mulai diagnosa <ArrowRightIcon size={16} weight="bold" />
          </button>
          <div className="trust">
            <span><ChatCircleDotsIcon size={18} weight="fill" /> Lewat chat</span>
            <span><WrenchIcon size={18} weight="fill" /> Perbaikan bertahap</span>
            <span><ShieldCheckIcon size={18} weight="fill" /> Tanpa istilah ribet</span>
          </div>
        </div>

        <div className="hero-dots">
          {heroSlides.map((_, i) => (
            <span
              key={i}
              className={i === slide ? "hero-dot active" : "hero-dot"}
              onClick={() => setSlide(i)}
            />
          ))}
        </div>
      </section>

      {/* ============ BAGIAN 2: FITUR ============ */}
      <section id="problems" className="features">
        <LeafIcon className="leaf leaf-a" size={200} weight="duotone" />
        <LeafIcon className="leaf leaf-b" size={160} weight="duotone" />

        <Reveal className="section-head" dir="left">
          <div>
            <h2>Masalah PC yang Umum</h2>
            <p>Pilih yang bikin PC-mu bermasalah, kami tanyakan hal yang tepat.</p>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onStart}>
            Mulai diagnosa <ArrowRightIcon size={14} weight="bold" />
          </button>
        </Reveal>

        <div className="dest-grid">
          {problems.map((p, i) => (
            <Reveal className="dest-card" key={p.name} dir="up" delay={i * 120}>
              <div className="dest-img">
                <img src={p.image} alt={p.name} />
              </div>
              <div className="dest-row">
                <span className="dest-name">
                  {p.icon}
                  <b>{p.name}</b>
                </span>
                <button className="round-btn" onClick={onStart} aria-label={p.name}>
                  <ArrowRightIcon size={14} weight="bold" />
                </button>
              </div>
              <p>{p.text}</p>
            </Reveal>
          ))}
        </div>

        <Reveal id="about" className="section-head second" dir="left">
          <div>
            <h2>Tentang Crash-Out</h2>
            <p>Crash-Out membantu kamu tahu apa yang salah dengan komputermu, karena kadang googling "kenapa" saja tidak cukup.</p>
          </div>
        </Reveal>

        <div className="pack-grid">
          {features.map((f, i) => (
            <Reveal
              className="pack-card"
              key={f.title}
              dir={i % 2 === 0 ? "left" : "right"}
              delay={i * 150}
            >
              <div className="pack-img">
                <img src={f.image} alt={f.title} />
                <span className="pack-badge">{f.badge}</span>
              </div>
              <div className="pack-body">
                <div className="pack-row">
                  <h3>{f.title}</h3>
                  <button className="round-btn" onClick={onStart} aria-label={f.title}>
                    <ArrowRightIcon size={14} weight="bold" />
                  </button>
                </div>
                <p>{f.text}</p>
                <div className="pack-meta">
                  {f.meta.map((m) => (
                    <span key={m.label}>{m.icon} {m.label}</span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ============ BAND STATISTIK ============ */}
      <section
        className="stats"
        style={{
          backgroundImage: `linear-gradient(rgba(16,44,42,0.78), rgba(16,44,42,0.9)), url("${img.main2}")`,
        }}
      >
        <svg className="wave wave-t" viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path d="M0 0H1440V36Q1320 70 1200 42T960 34T720 52T480 30T240 54T0 34Z" />
        </svg>
        <svg className="mtn" viewBox="0 0 1440 200" preserveAspectRatio="none">
          <path d="M0 200V120L120 60L220 110L360 30L520 120L680 50L840 130L1000 40L1180 120L1300 70L1440 120V200Z" />
        </svg>

        <Reveal as="h2" dir="up">
          Diagnosa yang <em>Masuk Akal</em>
        </Reveal>
        <Reveal as="p" dir="up" delay={100}>
          Gejala nyata, dibobot dengan pengetahuan pakar, dijelaskan dengan jelas.
        </Reveal>
        <div className="stats-row">
          {stats.map((s, i) => (
            <Reveal className="stat" key={s.label} dir="up" delay={150 + i * 120}>
              <div className="stat-icon">{s.icon}</div>
              <div>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </Reveal>
          ))}
        </div>

        <svg className="wave wave-b" viewBox="0 0 1440 70" preserveAspectRatio="none">
          <path d="M0 70H1440V36Q1320 4 1200 30T960 38T720 20T480 42T240 18T0 36Z" />
        </svg>
      </section>

      {/* ============ BAGIAN 3: ULASAN ============ */}
      <section id="reviews" className="reviews">
        <Reveal className="section-head" dir="left">
          <div>
            <h2>Kata Pengguna Kami</h2>
            <p>Diagnosa nyata, perbaikan nyata.</p>
          </div>
          <div className="arrows">
            <button className="round-btn big" onClick={prev} aria-label="Sebelumnya">
              <CaretLeftIcon size={18} weight="bold" />
            </button>
            <button className="round-btn big" onClick={next} aria-label="Berikutnya">
              <CaretRightIcon size={18} weight="bold" />
            </button>
          </div>
        </Reveal>

        <Reveal
          className="rev-viewport"
          dir="up"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div
            className="rev-track"
            style={{ "--per": perView, "--i": safeIndex }}
          >
            {reviews.map((r) => (
              <div className="rev-card" key={r.user}>
                <div className="rev-user">
                  <img src={r.avatar} alt={r.user} />
                  <div>
                    <h4>{r.user}</h4>
                    <small>Diagnosa: {r.diagnose}</small>
                  </div>
                </div>
                <div className="stars">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <StarIcon key={n} size={16} weight={n <= r.stars ? "fill" : "regular"} />
                  ))}
                </div>
                <p>"{r.text}"</p>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="dots">
          {Array.from({ length: maxIndex + 1 }).map((_, i) => (
            <span
              key={i}
              className={i === safeIndex ? "dot active" : "dot"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </section>

      {/* ============ CTA AKHIR ============ */}
      <Reveal as="section" className="cta" dir="up" style={{ backgroundImage: `url("${img.main3}")` }}>
        <div className="cta-card">
          <h2>
            Siap <em>benerin</em> PC-mu?
          </h2>
          <p>Mulai diagnosa sekarang dan dapatkan jawabannya lewat beberapa pertanyaan.</p>
          <button className="btn btn-dark" onClick={onStart}>
            Mulai diagnosa <ArrowRightIcon size={14} weight="bold" />
          </button>
        </div>
      </Reveal>
    </main>
  );
}

export default Home;