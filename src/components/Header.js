import { useState, useEffect } from "react";
import { CpuIcon } from "@phosphor-icons/react";

function Header({ currentUser, page, setPage, onNavigate, onSignOut }) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // transparan di atas hero (beranda) dan di atas foto pada halaman masuk / daftar
  const transparent =
    (page === "home" && !scrolled) || page === "signin" || page === "signup";

  return (
    <header className={transparent ? "header top" : "header solid"}>
      <div className="logo" onClick={() => onNavigate("top")}>
        <span className="logo-icon">
          <CpuIcon size={22} color="#fafafa" weight="fill" />
        </span>
        <div>
          <strong>
            Crash<span>-Out</span>
          </strong>
          <small>Troubleshooting PC pintar</small>
        </div>
      </div>

      <nav className="nav">
        <button onClick={() => onNavigate("top")}>Beranda</button>
        <button onClick={() => onNavigate("problems")}>Masalah</button>
        <button onClick={() => onNavigate("about")}>Tentang</button>
        <button onClick={() => onNavigate("reviews")}>Ulasan</button>
      </nav>

      <div className="auth-buttons">
        {currentUser ? (
          <>
            <span className="hello">Hai, {currentUser.name}</span>
            <button className="btn btn-dark" onClick={onSignOut}>
              Keluar
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => setPage("signin")}>
              Masuk
            </button>
            <button className="btn btn-dark" onClick={() => setPage("signup")}>
              Daftar
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;