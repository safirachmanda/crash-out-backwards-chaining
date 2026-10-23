function Header({ currentUser, setPage, onNavigate, onSignOut }) {
  return (
    <header className="header">
      <div className="logo" onClick={() => onNavigate("top")}>
        <span className="logo-icon">🖥️</span>
        <div>
          <strong>
            Why<span>PC</span>
          </strong>
          <small>Smart PC troubleshooting</small>
        </div>
      </div>

      <nav className="nav">
        <button onClick={() => onNavigate("top")}>Home</button>
        <button onClick={() => onNavigate("about")}>Features</button>
        <button onClick={() => onNavigate("reviews")}>Reviews</button>
      </nav>

      <div className="auth-buttons">
        {currentUser ? (
          <>
            <span className="hello">Hi, {currentUser.name}</span>
            <button className="btn btn-dark" onClick={onSignOut}>
              Sign out
            </button>
          </>
        ) : (
          <>
            <button className="btn btn-ghost" onClick={() => setPage("signin")}>
              Sign in
            </button>
            <button className="btn btn-dark" onClick={() => setPage("signup")}>
              Sign up
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;