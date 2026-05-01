import { useState } from "react";
import { supabase } from "./supabase";

const COLORS = {
  bg: "linear-gradient(135deg, #c4b5fd 0%, #e879f9 55%, #f9a8d4 100%)",
  primary: "#D946A8",
  primaryLight: "#FCE4F3",
  secondary: "#7C3AED",
  text: "#1a1528",
  textMuted: "#7c6b8a",
  border: "#F0E8F8",
  error: "#E07070",
};

export default function AuthScreen() {
  const [mode, setMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setMessage(null);
    setLoading(true);

    if (mode === "login") {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) setError(error.message);
    } else {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setError(error.message);
      else setMessage("Check your email to confirm your account! / Tingnan ang email mo!");
    }

    setLoading(false);
  };

  const inputStyle = {
    width: "100%",
    padding: ".8rem 1rem",
    borderRadius: "12px",
    border: `2px solid ${COLORS.border}`,
    fontFamily: "inherit",
    fontSize: "1rem",
    color: COLORS.text,
    background: "#F5F0FC",
    outline: "none",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      fontFamily: "'Inter', 'Segoe UI', system-ui, sans-serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      padding: "1.5rem",
    }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap'); * { box-sizing: border-box; }`}</style>

      <div style={{ textAlign: "center", marginBottom: "2rem" }}>
        <div style={{ fontSize: "2.5rem", fontWeight: "800", color: "#fff", letterSpacing: "-1px", textShadow: "0 2px 12px rgba(100,0,100,0.18)" }}>
          Bloom 🌸
        </div>
        <div style={{ fontSize: ".95rem", color: "rgba(255,255,255,0.85)", marginTop: ".35rem" }}>
          Your daily mind garden · Ang iyong hardin ng isipan
        </div>
      </div>

      <div style={{
        background: "rgba(255,255,255,0.97)",
        borderRadius: "24px",
        padding: "2rem 1.75rem",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 8px 40px rgba(120,0,180,0.18)",
      }}>
        <div style={{ fontSize: "1.2rem", fontWeight: "700", color: COLORS.text, marginBottom: ".3rem" }}>
          {mode === "login" ? "Welcome back! 👋" : "Create account"}
        </div>
        <div style={{ fontSize: ".85rem", color: COLORS.textMuted, marginBottom: "1.5rem" }}>
          {mode === "login" ? "Sign in to continue your journey" : "Start your recovery journey today"}
        </div>

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: ".85rem" }}>
          <input
            type="email"
            placeholder="Email address"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            style={inputStyle}
            onFocus={e => e.target.style.borderColor = COLORS.primary}
            onBlur={e => e.target.style.borderColor = COLORS.border}
          />

          {error && (
            <div style={{ fontSize: ".85rem", color: COLORS.error, background: "#FDE8E8", borderRadius: "10px", padding: ".65rem .9rem" }}>
              {error}
            </div>
          )}
          {message && (
            <div style={{ fontSize: ".85rem", color: "#10B981", background: "#EBF7F1", borderRadius: "10px", padding: ".65rem .9rem" }}>
              {message}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              background: loading ? COLORS.border : `linear-gradient(135deg, ${COLORS.primary}, ${COLORS.secondary})`,
              color: loading ? COLORS.textMuted : "#fff",
              border: "none",
              borderRadius: "14px",
              padding: ".9rem",
              fontSize: "1rem",
              fontWeight: "700",
              cursor: loading ? "default" : "pointer",
              fontFamily: "inherit",
              marginTop: ".25rem",
              boxShadow: loading ? "none" : "0 4px 15px rgba(180,0,160,0.25)",
            }}
          >
            {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
          </button>
        </form>

        <div style={{ textAlign: "center", marginTop: "1.25rem", fontSize: ".9rem", color: COLORS.textMuted }}>
          {mode === "login" ? "Don't have an account? " : "Already have an account? "}
          <button
            onClick={() => { setMode(mode === "login" ? "signup" : "login"); setError(null); setMessage(null); }}
            style={{ background: "none", border: "none", color: COLORS.primary, fontWeight: "700", cursor: "pointer", fontFamily: "inherit", fontSize: ".9rem", padding: 0 }}
          >
            {mode === "login" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}
