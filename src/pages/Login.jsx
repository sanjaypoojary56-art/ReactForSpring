import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./login.css";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault();

    setError("");

    if (!email.trim() || !password.trim()) {
      setError("Please enter your email and password.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.trim(),
          password: password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || data.error || "Invalid email or password."
        );
      }

      if (!data.token) {
        throw new Error("Login succeeded, but no authentication token was received.");
      }

      // Store JWT received from Spring Boot
      localStorage.setItem("token", data.token);
      if(data.role=="ADMIN")
      {
        navigate("/admin");
      }
      else if(data.role=="STUDENT")
      {
      // Navigate to protected dashboard
      navigate("/dashboard");
      }
      else if(data.role=="RECRUITER")
      {
        navigate("/recruiter-dashboard");


      }

    } catch (err) {
      console.error("Login error:", err);
      setError(err.message || "Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* LEFT SIDE */}
      <section className="login-visual">

        <div className="visual-content">

          <div className="brand">
            <div className="brand-mark">J</div>
            <span>JobMatch</span>
          </div>

          <div className="visual-main">

            <span className="eyebrow">
              YOUR CAREER STARTS HERE
            </span>

            <h1>
              Find opportunities
              <br />
              that <span>fit you.</span>
            </h1>

            <p>
              Discover jobs based on your skills, explore relevant
              opportunities, and take the next step toward your career.
            </p>

          </div>

          <div className="visual-footer">
            <div className="mini-stat">
              <strong>Skills</strong>
              <span>Personalized matching</span>
            </div>

            <div className="mini-stat">
              <strong>Jobs</strong>
              <span>Relevant opportunities</span>
            </div>

            <div className="mini-stat">
              <strong>Career</strong>
              <span>Built around you</span>
            </div>
          </div>

        </div>

      </section>


      {/* RIGHT SIDE */}
      <section className="login-section">

        <div className="login-container">

          <div className="mobile-brand">
            <div className="brand-mark">J</div>
            <span>JobMatch</span>
          </div>

          <div className="login-heading">

            <span className="form-label">
              STUDENT PORTAL
            </span>

            <h2>Welcome back</h2>

            <p>
              Sign in to continue exploring opportunities.
            </p>

          </div>


          {/* ERROR */}
          {error && (
            <div className="login-error">
              <span className="error-icon">!</span>
              <span>{error}</span>
            </div>
          )}


          {/* FORM */}
          <form onSubmit={handleLogin}>

            {/* EMAIL */}
            <div className="input-group">

              <label htmlFor="email">
                Email address
              </label>

              <div className="input-wrapper">

                <span className="input-icon">
                  @
                </span>

                <input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                  disabled={loading}
                />

              </div>

            </div>


            {/* PASSWORD */}
            <div className="input-group">

              <div className="password-label-row">

                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-button"
                  onClick={() => alert("Password reset can be added here.")}
                >
                  Forgot password?
                </button>

              </div>

              <div className="input-wrapper">

                <span className="input-icon">
                  •
                </span>

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  disabled={loading}
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? "Hide" : "Show"}
                </button>

              </div>

            </div>


            {/* LOGIN BUTTON */}
            <button
              type="submit"
              className="login-button"
              disabled={loading}
            >

              {loading ? (
                <>
                  <span className="button-spinner"></span>
                  Signing in...
                </>
              ) : (
                <>
                  Sign in
                  <span className="arrow">→</span>
                </>
              )}

            </button>

          </form>


          {/* REGISTER */}
          <div className="register-section">

            <span>
              Don't have an account?
            </span>

            <Link to="/register">
              Create an account
            </Link>

          </div>


          <p className="security-note">
            Your connection is protected by secure authentication.
          </p>

        </div>

      </section>

    </div>
  );
}

export default Login;