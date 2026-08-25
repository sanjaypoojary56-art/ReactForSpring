import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import "./Register.css";

function Register() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleRegister = async (e) => {
        e.preventDefault();

        setMessage("");

        if (password !== confirmPassword) {
            setMessage("Passwords do not match");
            return;
        }

        if (password.length < 6) {
            setMessage("Password must contain at least 6 characters");
            return;
        }

        setLoading(true);

        try {

            const response = await fetch(`${import.meta.env.VITE_API_URL}/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.text();

            if (response.ok) {
                setMessage(data);

                setEmail("");
                setPassword("");
                setConfirmPassword("");

                setTimeout(() => {
                    navigate("/login");
                }, 1200);

            } else {
                setMessage(data || "Registration failed");
            }

        } catch (error) {
            console.error(error);
            setMessage("Unable to connect to server");
        }

        setLoading(false);
    };

    return (
        <div className="register-page">

            <div className="register-left">

                <div className="brand">
                    <span className="brand-mark">J</span>
                    <span>JobBridge</span>
                </div>

                <div className="welcome-text">
                    <p className="small-heading">START YOUR JOURNEY</p>

                    <h1>
                        Build your career.
                        <br />
                        Find your opportunity.
                    </h1>

                    <p>
                        Create your student account and discover jobs,
                        internships and opportunities designed for you.
                    </p>
                </div>

                <div className="feature-list">

                    <div className="feature">
                        <span>✓</span>
                        <div>
                            <strong>Discover opportunities</strong>
                            <p>Find jobs and internships matching your skills.</p>
                        </div>
                    </div>

                    <div className="feature">
                        <span>✓</span>
                        <div>
                            <strong>Build your profile</strong>
                            <p>Show recruiters your education and skills.</p>
                        </div>
                    </div>

                    <div className="feature">
                        <span>✓</span>
                        <div>
                            <strong>Apply easily</strong>
                            <p>Apply for suitable jobs from one place.</p>
                        </div>
                    </div>

                </div>

            </div>


            <div className="register-right">

                <div className="register-card">

                    <div className="mobile-brand">
                        <span className="brand-mark">J</span>
                        JobBridge
                    </div>

                    <div className="form-heading">
                        <span className="account-label">STUDENT ACCOUNT</span>

                        <h2>Create your account</h2>

                        <p>
                            Register to start exploring career opportunities.
                        </p>
                    </div>


                    <form onSubmit={handleRegister}>

                        <div className="input-group">
                            <label>Email address</label>

                            <input
                                type="email"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>


                        <div className="input-group">
                            <label>Password</label>

                            <input
                                type="password"
                                placeholder="Create a password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>


                        <div className="input-group">
                            <label>Confirm password</label>

                            <input
                                type="password"
                                placeholder="Enter your password again"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                required
                            />
                        </div>


                        <div className="role-box">
                            <div className="role-icon">S</div>

                            <div>
                                <strong>Student</strong>
                                <p>
                                    Your account will be registered as a student.
                                </p>
                            </div>
                        </div>


                        {message && (
                            <div
                                className={
                                    message === "Registration successful!"
                                        ? "message success"
                                        : "message error"
                                }
                            >
                                {message}
                            </div>
                        )}


                        <button
                            type="submit"
                            className="register-button"
                            disabled={loading}
                        >
                            {loading ? "Creating account..." : "Create account"}
                        </button>

                    </form>


                    <div className="login-link">
                        Already have an account?
                        <Link to="/login"> Sign in<br /></Link>
                    </div>
                    <div className="login-link">
                        Company looking to hire?
                        <Link to="/recruiter-register">
                        Register as a recruiter</Link>
                    </div>

                </div>

            </div>

        </div>
    );
}

export default Register;