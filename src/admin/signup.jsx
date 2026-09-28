import { useState } from "react";
import { BookOpen, Eye, EyeOff, Lock, Mail, User } from "lucide-react";
import "../styles/login.css";
import { API_BASE } from "../api.js";

export default function Signup({ onNavigate }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const set = (key) => (event) => {
    // Clear custom error message when the user starts typing again
    event.target.setCustomValidity("");
    setForm({ ...form, [key]: event.target.value });
  };

  async function handleSubmit(event) {
    event.preventDefault();
    setMessage("");
    setErrorMessage("");

    // Custom check for matching passwords
    if (form.password !== form.confirm) {
      const confirmInput = event.target.querySelector("#signup-confirm");
      confirmInput.setCustomValidity("Passwords do not match.");
      confirmInput.reportValidity();
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${API_BASE}/signup.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        setMessage(data.message || "Account created. Redirecting to login...");
        // Reset form
        setForm({ name: "", email: "", password: "", confirm: "" });
        
        // Redirect to login screen after 1.5 seconds
        setTimeout(() => {
          onNavigate("login");
        }, 1500);
      } else {
        setErrorMessage(data.message || "Failed to create account.");
      }
    } catch {
      setErrorMessage("Unable to connect to server. Check database status.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <section className="auth-brand-panel">
        <div className="auth-brand">
          <div className="auth-logo">
            <BookOpen size={38} />
          </div>
          <h1>Class Attendance</h1>
          <p className="auth-subtitle">Monitoring System</p>
          <p className="auth-description">
            Create an administrator account to get started with smarter
            attendance tracking.
          </p>
        </div>
      </section>
      <main className="auth-form-panel">
        <div className="auth-card">
          <h2>Create account</h2>
          <p className="auth-lead">Set up your administrator account.</p>
          <form onSubmit={handleSubmit}>
            {/* Name / Username Field */}
            <div className="auth-field">
              <label htmlFor="signup-name">Name</label>
              <div className="auth-input-wrap">
                <User size={18} />
                <input
                  id="signup-name"
                  value={form.name}
                  onChange={set("name")}
                  placeholder="Enter your name"
                  minLength={5}
                  required
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Name must be at least 5 characters.")
                  }
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="auth-field">
              <label htmlFor="signup-email">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="signup-email"
                  type="email"
                  value={form.email}
                  onChange={set("email")}
                  placeholder="you@example.com"
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  required
                  onInvalid={(e) => {
                    if (e.target.validity.patternMismatch) {
                      e.target.setCustomValidity(
                        "Please include an '@' and a domain extension like .com, .ph, or .edu"
                      );
                    } else {
                      e.target.setCustomValidity("Please fill out this field.");
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-field">
              <label htmlFor="signup-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="signup-password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={set("password")}
                  placeholder="Enter password"
                  minLength={6}
                  pattern="(?=.*\d)(?=.*[!@#$%^&*(),.?&quot;:{}|<>]).{6,}"
                  required
                  onInvalid={(e) => {
                    if (e.target.validity.tooShort) {
                      e.target.setCustomValidity("Password must be at least 6 characters.");
                    } else {
                      e.target.setCustomValidity("Please fill out this field.");
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
                <button
                  type="button"
                  className="auth-password-toggle"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="auth-field">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="signup-confirm"
                  type={showPassword ? "text" : "password"}
                  value={form.confirm}
                  onChange={set("confirm")}
                  placeholder="Confirm your password"
                  required
                  onInvalid={(e) =>
                    e.target.setCustomValidity("Please fill out this field.")
                  }
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>
            </div>

            {/* Response Message Feedback */}
            {message && <p className="auth-success">{message}</p>}
            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>

            <div className="auth-divider">
              <p>
                Already have an account?{" "}
                <button
                  className="auth-link"
                  type="button"
                  onClick={() => onNavigate("login")}
                >
                  Sign in
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}