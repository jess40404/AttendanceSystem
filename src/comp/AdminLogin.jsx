import React, { useState } from "react";
import "./AdminLogin.css";

export default function AdminLogin() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please enter your email and password.");
      return;
    }

    // Connect your backend/login authentication here
    console.log({
      email,
      password,
      remember,
    });
  };

  return (
    <main className="admin-login-page">
      <section className="login-card">

        {/* Logo / System Name */}
        <div className="login-brand">
          <div className="brand-icon">
            <svg viewBox="0 0 48 48">
              <path
                d="M8 12.5C8 10.57 9.57 9 11.5 9H22c2.21 0 4 1.79 4 4v25c-1.8-2.08-4.13-3-7-3h-8.5A2.5 2.5 0 0 1 8 32.5v-20Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />

              <path
                d="M40 12.5C40 10.57 38.43 9 36.5 9H26c-2.21 0-4 1.79-4 4v25c1.8-2.08 4.13-3 7-3h8.5a2.5 2.5 0 0 0 2.5-2.5v-20Z"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <h1>Attendance</h1>
          <p>Monitoring System</p>
        </div>

        {/* Heading */}
        <div className="login-heading">
          <h2>Welcome Back!</h2>
          <p>Sign in to your administrator account</p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="login-form">

          {/* Email */}
          <div className="form-group">
            <label htmlFor="admin-email">
              Email Address
            </label>

            <div className="input-wrapper">
              <span className="input-icon">
                <svg viewBox="0 0 24 24">
                  <path
                    d="M4 5.5h16A1.5 1.5 0 0 1 21.5 7v10A1.5 1.5 0 0 1 20 18.5H4A1.5 1.5 0 0 1 2.5 17V7A1.5 1.5 0 0 1 4 5.5Z"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="m3.5 7 8 6a.85.85 0 0 0 1 0l8-6"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </svg>
              </span>

              <input
                id="admin-email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="username"
              />
            </div>
          </div>

          {/* Password */}
          <div className="form-group">

            <div className="password-label-row">
              <label htmlFor="admin-password">
                Password
              </label>

              <button
                type="button"
                className="forgot-link"
              >
                Forgot Password?
              </button>
            </div>

            <div className="input-wrapper">

              <span className="input-icon">
                <svg viewBox="0 0 24 24">
                  <rect
                    x="4"
                    y="10"
                    width="16"
                    height="11"
                    rx="2"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                  />

                  <path
                    d="M8 10V7a4 4 0 0 1 8 0v3"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />

                  <circle
                    cx="12"
                    cy="15.5"
                    r="1.2"
                    fill="currentColor"
                  />
                </svg>
              </span>

              <input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword((value) => !value)
                }
              >
                {showPassword ? "Hide" : "Show"}
              </button>

            </div>
          </div>

          {/* Remember Me */}
          <label className="remember-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(e) =>
                setRemember(e.target.checked)
              }
            />

            <span>Remember me</span>
          </label>

          {/* Sign In */}
          <button
            type="submit"
            className="login-button"
          >
            Sign In
            <span>→</span>
          </button>

        </form>

        {/* Footer */}
        <div className="login-footer">
          <span>
            © 2026 Attendance Monitoring System
          </span>

          <span>
            Administrator Access
          </span>
        </div>

      </section>
    </main>
  );
}