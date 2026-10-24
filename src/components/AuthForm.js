import { useState, useEffect } from "react";
import {
  UserIcon,
  EnvelopeSimpleIcon,
  LockIcon,
  EyeIcon,
  EyeSlashIcon,
  ArrowRightIcon,
  ThermometerHotIcon,
  ChatCircleDotsIcon,
  ShieldCheckIcon,
} from "@phosphor-icons/react";
import { img } from "../Assets";

const slides = [img.main1, img.main2, img.main3];

function AuthForm({ mode, onSubmit, onSwitch }) {
  const isSignUp = mode === "signup";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");
  const [show, setShow] = useState(false);
  const [slide, setSlide] = useState(0);

  // foto latar berganti tiap 5 detik (fade)
  useEffect(() => {
    const timer = setInterval(() => {
      setSlide((s) => (s + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp && !form.name.trim()) return setError("Nama wajib diisi.");
    if (!form.email.includes("@")) return setError("Masukkan email yang valid.");
    if (form.password.length < 6)
      return setError("Password minimal 6 karakter.");
    if (isSignUp && form.password !== form.confirm)
      return setError("Konfirmasi password tidak cocok.");

    const result = onSubmit({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
    if (result) setError(result);
  };

  // panel kiri menampilkan foto berikutnya, jadi beda dari latar
  const panelSlide = (slide + 1) % slides.length;

  return (
    <section className="auth">
      <div className="auth-slides">
        {slides.map((src, i) => (
          <img
            key={i}
            src={src}
            alt=""
            className={i === slide ? "hero-slide active" : "hero-slide"}
          />
        ))}
      </div>
      <div className="auth-shade" />

      <div className="auth-shell" key={mode}>
        <aside className="auth-visual">
          <div className="auth-visual-slides">
            {slides.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className={i === panelSlide ? "hero-slide active" : "hero-slide"}
              />
            ))}
          </div>
          <div className="auth-visual-shade" />
          <div className="auth-visual-content">
            <p className="eyebrow light">TROUBLESHOOTING PC · SISTEM PAKAR</p>
            <h2>
              {isSignUp ? (
                <>
                  Mulai benerin <em>PC-mu</em> sekarang.
                </>
              ) : (
                <>
                  Senang ketemu <em>lagi.</em>
                </>
              )}
            </h2>
            <ul>
              <li><ChatCircleDotsIcon size={18} weight="fill" /> Diagnosa lewat chat</li>
              <li><ShieldCheckIcon size={18} weight="fill" /> Hasil dengan tingkat keyakinan</li>
            </ul>
            <div className="auth-chip">
              <span><ThermometerHotIcon size={18} weight="fill" /> Overheating</span>
              <strong>CF 80%</strong>
            </div>
          </div>
        </aside>

        <form className="auth-form" onSubmit={handleSubmit} noValidate>
          <h1>{isSignUp ? "Buat akun" : "Selamat datang kembali"}</h1>
          <p className="auth-sub">
            {isSignUp
              ? "Daftar untuk mulai mendiagnosa PC-mu."
              : "Masuk untuk lanjut mendiagnosa."}
          </p>

          {isSignUp && (
            <label className="field">
              <UserIcon size={18} />
              <input
                name="name"
                placeholder="Nama"
                value={form.name}
                onChange={handleChange}
              />
            </label>
          )}

          <label className="field">
            <EnvelopeSimpleIcon size={18} />
            <input
              name="email"
              type="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
            />
          </label>

          <label className="field">
            <LockIcon size={18} />
            <input
              name="password"
              type={show ? "text" : "password"}
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
            />
            <button
              type="button"
              className="eye"
              onClick={() => setShow(!show)}
              aria-label="Tampilkan atau sembunyikan password"
            >
              {show ? <EyeSlashIcon size={18} /> : <EyeIcon size={18} />}
            </button>
          </label>

          {isSignUp && (
            <label className="field">
              <LockIcon size={18} />
              <input
                name="confirm"
                type={show ? "text" : "password"}
                placeholder="Konfirmasi password"
                value={form.confirm}
                onChange={handleChange}
              />
            </label>
          )}

          {error && <p className="error">{error}</p>}

          <button type="submit" className="btn btn-dark btn-lg auth-submit">
            {isSignUp ? "Daftar" : "Masuk"} <ArrowRightIcon size={16} weight="bold" />
          </button>

          <p className="switch">
            {isSignUp ? "Sudah punya akun? " : "Belum punya akun? "}
            <span onClick={onSwitch}>{isSignUp ? "Masuk" : "Daftar"}</span>
          </p>
        </form>
      </div>
    </section>
  );
}

export default AuthForm;