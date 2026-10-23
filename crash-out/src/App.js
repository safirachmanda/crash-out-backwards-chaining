import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Home from "./components/Home";
import AuthForm from "./components/AuthForm";

function App() {
  const [page, setPage] = useState("home"); // home | signin | signup | diagnose
  const [users, setUsers] = useState(
    () => JSON.parse(localStorage.getItem("users")) || []
  );
  const [currentUser, setCurrentUser] = useState(
    () => JSON.parse(localStorage.getItem("currentUser")) || null
  );

  useEffect(() => {
    localStorage.setItem("users", JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem("currentUser", JSON.stringify(currentUser));
  }, [currentUser]);

  // return an error string, or null if success
  const handleSignUp = ({ name, email, password }) => {
    if (users.some((u) => u.email === email)) {
      return "Email is already registered.";
    }
    setUsers([...users, { name, email, password }]);
    setCurrentUser({ name, email });
    setPage("home");
    return null;
  };

  const handleSignIn = ({ email, password }) => {
    const found = users.find(
      (u) => u.email === email && u.password === password
    );
    if (!found) return "Wrong email or password.";
    setCurrentUser({ name: found.name, email: found.email });
    setPage("home");
    return null;
  };

  const handleSignOut = () => {
    setCurrentUser(null);
    setPage("home");
  };

  const handleStart = () => {
    setPage(currentUser ? "diagnose" : "signin");
  };

  const goTo = (id) => {
    setPage("home");
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: "smooth" });
      else window.scrollTo({ top: 0, behavior: "smooth" });
    }, 50);
  };

  return (
    <div className="app">
      <Header
        currentUser={currentUser}
        setPage={setPage}
        onNavigate={goTo}
        onSignOut={handleSignOut}
      />

      {page === "home" && <Home onStart={handleStart} />}

      {page === "signin" && (
        <AuthForm
          mode="signin"
          onSubmit={handleSignIn}
          onSwitch={() => setPage("signup")}
        />
      )}

      {page === "signup" && (
        <AuthForm
          mode="signup"
          onSubmit={handleSignUp}
          onSwitch={() => setPage("signin")}
        />
      )}

      {page === "diagnose" && (
        <section className="placeholder">
          <h2>Diagnosis page coming next 🛠️</h2>
          <p>Hi {currentUser?.name}, this is where the chat + CF flow will go.</p>
          <button className="btn btn-primary" onClick={() => setPage("home")}>
            Back to home
          </button>
        </section>
      )}

      <footer className="footer">© 2026 WhyPC (temporary name)</footer>
    </div>
  );
}

export default App;