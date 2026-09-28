import { useState } from "react";
import { BookOpen, Eye, EyeOff, Lock, Mail } from "lucide-react";
import "../styles/login.css";
import { API_BASE } from "../api.js";

export default function Login({ onNavigate }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const response = await fetch(`${API_BASE}/login.php`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        // Save authenticated user data to local storage
        localStorage.setItem("user", JSON.stringify(data.user));
        
        // Navigate to home/dashboard
        onNavigate("home");
      } else {
        setErrorMessage(data.message || "Invalid email or password.");
      }
    } catch {
      setErrorMessage("Unable to connect to the server. Please check your database.");
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
            Streamline attendance tracking and ensure every student is accounted for.
          </p>
        </div>
      </section>

      <main className="auth-form-panel">
        <div className="auth-card">
          <h2>Welcome Admin</h2>
          <p className="auth-lead">Sign in to your account to continue.</p>
          
          <form onSubmit={handleSubmit}>
            {/* Email Field */}
            <div className="auth-field">
              <label htmlFor="login-email">Email Address</label>
              <div className="auth-input-wrap">
                <Mail size={18} />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                    setEmail(e.target.value);
                  }}
                  placeholder="you@example.com"
                  pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                  required
                  onInvalid={(e) => {
                    if (e.target.validity.valueMissing) {
                      e.target.setCustomValidity("Please fill out this field.");
                    } else if (e.target.validity.patternMismatch) {
                      e.target.setCustomValidity(
                        "Please include an '@' and a valid domain extension like .com, .ph, or .edu"
                      );
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="auth-field">
              <label htmlFor="login-password">Password</label>
              <div className="auth-input-wrap">
                <Lock size={18} />
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => {
                    e.target.setCustomValidity("");
                    setPassword(e.target.value);
                  }}
                  placeholder="Enter your password"
                  minLength={6}
                  pattern="^(?=.*\d)(?=.*[!@#$%^&*(),.?&quot;:{}|<>]).{6,}$"
                  required
                  onInvalid={(e) => {
                    if (e.target.validity.valueMissing) {
                      e.target.setCustomValidity("Please fill out this field.");
                    } else if (e.target.validity.tooShort) {
                      e.target.setCustomValidity("Password must be at least 6 characters long.");
                    } else if (e.target.validity.patternMismatch) {
                      e.target.setCustomValidity(
                        "Password must contain at least 1 number and 1 special character."
                      );
                    }
                  }}
                  onInput={(e) => e.target.setCustomValidity("")}
                />
                <button
                  className="auth-password-toggle"
                  type="button"
                  aria-label="Toggle password visibility"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Error Message Display */}
            {errorMessage && <p className="auth-error">{errorMessage}</p>}

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Login"}
            </button>

            <div className="auth-divider">
              <p>
                Don't have an account?{" "}
                <button
                  className="auth-link"
                  type="button"
                  onClick={() => onNavigate("signup")}
                >
                  Sign up
                </button>
              </p>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}