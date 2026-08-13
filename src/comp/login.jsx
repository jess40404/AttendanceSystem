import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';
import '../App.css';
const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const handleLogin = e => {
    e.preventDefault();
    setLoading(true);
    console.log('Login attempt:', {
      email,
      password
    });

    // Simulate login process
    setTimeout(() => {
      setLoading(false);
      alert('Welcome to Class Attendance System!');
      setEmail('');
      setPassword('');
    }, 1500);
  };
  const handleForgotPassword = () => {
    console.log('Forgot password clicked');
  };
  const handleSignUp = () => {
    console.log('Sign up clicked');
  };
  return <div className="login-style-1">
      {/* Left Side - Branding */}
      <div className="login-style-2">
        <div className="login-style-3">
          <div className="login-style-4">
            📚
          </div>
          <h1 className="login-style-5">
            Class Attendance
          </h1>
          <p className="login-style-6">
            Monitoring System
          </p>
          <p className="login-style-7">
            Streamline attendance tracking and ensure every student is accounted for
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="login-style-8">
        <div className="login-style-9">
          <h2 className="login-style-10">
            Welcome Back
          </h2>
          <p className="login-style-11">
            Sign in to your account to continue
          </p>

          <form onSubmit={handleLogin}>
            {/* Email Field */}
            <div className="login-style-12">
              <label className="login-style-13">
                Email Address
              </label>
              <div className="login-style-14">
                <Mail size={18} className="login-style-15" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com" required className="login-style-16" />
              </div>
            </div>

            {/* Password Field */}
            <div className="login-style-17">
              <label className="login-style-18">
                Password
              </label>
              <div className="login-style-19">
                <Lock size={18} className="login-style-20" />
                <input type={showPassword ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter your password" required className="login-style-21" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="login-style-22">
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Forgot Password Link */}
            <div className="login-style-23">
              <button type="button" onClick={handleForgotPassword} className="login-style-24">
                Forgot password?
              </button>
            </div>

            {/* Login Button */}
            <button type="submit" disabled={loading} className="login-submit-button">
              {loading ? 'Signing in...' : 'Sign In'}
            </button>

            {/* Sign Up Link */}
            <div className="login-style-25">
              <p className="login-style-26">
                Don't have an account?{' '}
                <button type="button" onClick={handleSignUp} className="login-style-27">
                  Sign Up
                </button>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>;
};
export default Login;
