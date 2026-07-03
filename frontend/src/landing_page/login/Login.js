import axios from "axios";
import { useState } from "react";
import "./Login.css";

function Login() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setMessage("");
    setIsLoading(true);

    try {
      await axios.post(
        "https://zerodha-backend-k54v.onrender.com/auth/login",
        { email, password },
        { withCredentials: true }
      );

      window.location.href = "https://zerodha-clone-dashboard-kw8m.onrender.com";

    } catch (err) {
      console.log(err.response);
      setMessage(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-page">
      <section className="login-shell">
        <div className="login-panel">
          <img
            className="login-logo"
            src="/media/images/logo.svg"
            alt="Zerodha"
          />

          <p className="login-kicker">Kite dashboard</p>
          <h1>Login to your account</h1>
          <p className="login-copy">
            Track holdings, place orders, and manage your portfolio from one calm workspace.
          </p>

          {message && <div className="login-alert">{message}</div>}

          <form className="login-form" onSubmit={login}>
            <label htmlFor="login-email">Email address</label>
            <input
              id="login-email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
            />

            <label htmlFor="login-password">Password</label>
            <input
              id="login-password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              required
            />

            <button type="submit" disabled={isLoading}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="login-footer-text">
            New here? <a href="/signup">Create an account</a>
          </p>
        </div>

        <div className="login-visual" aria-hidden="true">
          <img src="/media/images/kite.png" alt="" />
          <div className="login-stat login-stat-primary">
            <span>Equity</span>
            <strong>+5.20%</strong>
          </div>
          <div className="login-stat login-stat-secondary">
            <span>Orders</span>
            <strong>Live</strong>
          </div>
        </div>
      </section>
    </div>
  );
}

export default Login;
