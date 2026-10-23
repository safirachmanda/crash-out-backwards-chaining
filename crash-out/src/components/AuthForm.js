import { useState } from "react";

function AuthForm({ mode, onSubmit, onSwitch }) {
  const isSignUp = mode === "signup";
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (isSignUp && !form.name.trim()) return setError("Please enter your name.");
    if (!form.email.includes("@")) return setError("Please enter a valid email.");
    if (form.password.length < 6)
      return setError("Password must be at least 6 characters.");
    if (isSignUp && form.password !== form.confirm)
      return setError("Passwords do not match.");

    const result = onSubmit({
      name: form.name.trim(),
      email: form.email.trim().toLowerCase(),
      password: form.password,
    });
    if (result) setError(result);
  };

  return (
    <section className="auth">
      <form className="auth-card" onSubmit={handleSubmit}>
        <h2>{isSignUp ? "Create account" : "Welcome back"}</h2>
        <p className="section-sub">
          {isSignUp ? "Sign up to start diagnosing." : "Sign in to continue."}
        </p>

        {isSignUp && (
          <input
            name="name"
            placeholder="Name"
            value={form.name}
            onChange={handleChange}
          />
        )}
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
        />
        {isSignUp && (
          <input
            name="confirm"
            type="password"
            placeholder="Confirm password"
            value={form.confirm}
            onChange={handleChange}
          />
        )}

        {error && <p className="error">{error}</p>}

        <button type="submit" className="btn btn-primary btn-lg">
          {isSignUp ? "Sign up" : "Sign in"}
        </button>

        <p className="switch">
          {isSignUp ? "Already have an account? " : "No account yet? "}
          <span onClick={onSwitch}>{isSignUp ? "Sign in" : "Sign up"}</span>
        </p>
      </form>
    </section>
  );
}

export default AuthForm;