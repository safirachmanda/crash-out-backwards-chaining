import { useState } from "react";

const problems = [
  { icon: "🌡️", name: "Overheating", text: "Hot CPU or GPU, loud fans, slow performance", tone: "t1" },
  { icon: "💙", name: "Blue Screen", text: "Sudden crashes and error codes (BSOD)", tone: "t2" },
  { icon: "🎮", name: "Graphic Glitch", text: "Artifacts, flickering, or distorted display", tone: "t3" },
  { icon: "📦", name: "Corrupted Install", text: "Files break when installing software", tone: "t4" },
];

const features = [
  { icon: "💬", badge: "Chat style", title: "Talk to it like a technician", text: "Answer simple questions one by one, no technical terms needed." },
  { icon: "📊", badge: "Certainty Factor", title: "Results with a confidence level", text: "Every answer carries how sure you are, so you get a percentage, not just yes or no." },
  { icon: "🛠️", badge: "Fix guide", title: "Step-by-step handling", text: "Once the problem is identified, get clear steps to fix it." },
];

const stats = [
  { icon: "🧩", value: "4+", label: "Problem types" },
  { icon: "🔍", value: "20+", label: "Symptoms checked" },
  { icon: "🎚️", value: "6", label: "Certainty levels" },
  { icon: "✅", value: "Free", label: "To use" },
];

const reviews = [
  { user: "User 1", diagnose: "Overheating", stars: 5, text: "Fan noise finally stopped after following the steps!" },
  { user: "User 2", diagnose: "Blue Screen", stars: 4, text: "Easy questions, and the result matched my problem." },
  { user: "User 3", diagnose: "Graphic Glitch", stars: 5, text: "Didn't know where to start, now I do." },
  { user: "User 4", diagnose: "Corrupted Install", stars: 4, text: "Simple and quick, no technical terms needed." },
];

function Home({ onStart }) {
  const [index, setIndex] = useState(0);
  const prev = () => setIndex((index - 1 + reviews.length) % reviews.length);
  const next = () => setIndex((index + 1) % reviews.length);
  const r = reviews[index];

  return (
    <main id="top">
      {/* ============ SECTION 1: HERO ============ */}
      <section className="hero">
        <div className="blob blob-a" />
        <div className="blob blob-b" />

        <div className="hero-text">
          <p className="eyebrow">PC TROUBLESHOOTING · EXPERT SYSTEM</p>
          <h1>
            Ready to diagnose
            <br />
            <em>ur PC</em> with us?
          </h1>
          <p className="hero-sub">
            Tell us what's wrong, answer a few questions, and find out why your
            PC is acting up, with a fix to follow.
          </p>
          <button className="btn btn-dark btn-lg" onClick={onStart}>
            Start diagnosing →
          </button>
          <div className="trust">
            <span>✔ Chat-style</span>
            <span>✔ Step-by-step fixes</span>
            <span>✔ No jargon</span>
          </div>
        </div>

        <div className="hero-visual">
          <svg className="scene" viewBox="0 0 600 460" preserveAspectRatio="xMidYMid slice">
            <defs>
              <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#cfe3ee" />
                <stop offset="100%" stopColor="#f3e6d8" />
              </linearGradient>
            </defs>
            <rect width="600" height="460" fill="url(#sky)" />
            <circle cx="470" cy="110" r="42" fill="#fff6e5" opacity="0.9" />
            <path d="M0 300 L110 190 L210 280 L330 150 L450 290 L600 200 L600 460 L0 460Z" fill="#7aa5a8" opacity="0.75" />
            <path d="M0 350 L140 250 L260 340 L400 230 L520 330 L600 280 L600 460 L0 460Z" fill="#3e7a78" />
            <path d="M0 410 Q150 340 300 400 T600 380 L600 460 L0 460Z" fill="#1f4d4a" />
          </svg>

          <div className="bubble bubble-sys">Is your PC's temperature above 70°?</div>
          <div className="bubble bubble-user">Cukup yakin</div>
          <div className="result-chip">
            <span>🌡️ Overheating</span>
            <strong>CF 80%</strong>
          </div>
        </div>
      </section>

      {/* ============ SECTION 2: FEATURES ============ */}
      <section id="about" className="features">
        <div className="section-head">
          <div>
            <h2>Common PC Problems</h2>
            <p>Pick what's bugging your PC, we'll ask the right questions.</p>
          </div>
          <button className="btn btn-ghost" onClick={onStart}>
            Start now →
          </button>
        </div>

        <div className="problem-grid">
          {problems.map((p) => (
            <div className="problem-card" key={p.name}>
              <div className={`problem-img ${p.tone}`}>
                <span>{p.icon}</span>
              </div>
              <div className="problem-body">
                <div>
                  <h3>{p.name}</h3>
                  <p>{p.text}</p>
                </div>
                <button className="round-btn" onClick={onStart} aria-label={p.name}>
                  →
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="section-head second">
          <div>
            <h2>About the web</h2>
            <p>WhyPC helps you figure out what's wrong, because sometimes Googling "why" isn't enough.</p>
          </div>
        </div>

        <div className="feature-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-top">
                <span className="feature-icon">{f.icon}</span>
                <span className="badge">{f.badge}</span>
              </div>
              <h3>{f.title}</h3>
              <p>{f.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* stats band with wavy edges */}
      <div className="wave wave-top">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0 60 L0 30 Q120 0 240 25 T480 30 T720 20 T960 35 T1200 15 T1440 30 L1440 60Z" fill="#1f4d4a" />
        </svg>
      </div>
      <section className="stats">
        <h2>
          Diagnosis That <em>Makes Sense</em>
        </h2>
        <p>Real symptoms, weighted by expert knowledge, explained clearly.</p>
        <div className="stats-row">
          {stats.map((s) => (
            <div className="stat" key={s.label}>
              <div className="stat-icon">{s.icon}</div>
              <div>
                <strong>{s.value}</strong>
                <span>{s.label}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
      <div className="wave wave-bottom">
        <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
          <path d="M0 0 L0 20 Q120 55 240 30 T480 25 T720 40 T960 20 T1200 45 T1440 25 L1440 0Z" fill="#1f4d4a" />
        </svg>
      </div>

      {/* ============ SECTION 3: REVIEWS ============ */}
      <section id="reviews" className="reviews">
        <div className="section-head center">
          <div>
            <h2>What Our Users Say</h2>
            <p>Real diagnoses, real fixes.</p>
          </div>
        </div>

        <div className="carousel">
          <button className="round-btn big" onClick={prev} aria-label="Previous">
            ‹
          </button>
          <div className="review-card" key={index}>
            <div className="review-user">
              <div className="avatar">{r.user.slice(-1)}</div>
              <div>
                <h4>{r.user}</h4>
                <small>Diagnose: {r.diagnose}</small>
              </div>
            </div>
            <div className="stars">
              {"★".repeat(r.stars)}
              {"☆".repeat(5 - r.stars)}
            </div>
            <p>"{r.text}"</p>
          </div>
          <button className="round-btn big" onClick={next} aria-label="Next">
            ›
          </button>
        </div>

        <div className="dots">
          {reviews.map((_, i) => (
            <span
              key={i}
              className={i === index ? "dot active" : "dot"}
              onClick={() => setIndex(i)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}

export default Home;