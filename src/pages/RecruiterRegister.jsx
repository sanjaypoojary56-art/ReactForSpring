
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./RecruiterRegister.css";

function RecruiterRegister() {

    const navigate = useNavigate();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [companyFile, setCompanyFile] = useState(null);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setMessage("");

        if (!companyFile) {
            setMessage("Please upload your company document.");
            return;
        }

        setLoading(true);

        try {

            const formData = new FormData();

            formData.append("email", email);
            formData.append("password", password);
            formData.append("companyDocument", companyFile);

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/recruiter-register`,
                {
                    method: "POST",
                    body: formData
                }
            );

            const data = await response.text();

            if (response.ok) {

                setMessage(
                    "Application submitted. Wait for admin approval."
                );

                setEmail("");
                setPassword("");
                setCompanyFile(null);

                document.getElementById("companyDocument").value = "";

            } else {
                setMessage(data || "Registration failed.");
            }

        } catch (error) {

            console.error(error);
            setMessage("Unable to connect to server.");

        }

        setLoading(false);
    };

    return (

        <div className="recruiter-register-page">

            <div className="recruiter-register-card">

                <div className="recruiter-logo">
                    J
                </div>

                <span className="recruiter-label">
                    RECRUITER REGISTRATION
                </span>

                <h1>
                    Register your company
                </h1>

                <p className="recruiter-description">
                    Submit your company details for verification.
                    Your recruiter account will be activated only
                    after admin approval.
                </p>


                <form onSubmit={handleSubmit}>

                    <div className="recruiter-input-group">

                        <label>Email address</label>

                        <input
                            type="email"
                            placeholder="company@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />

                    </div>


                    <div className="recruiter-input-group">

                        <label>Password</label>

                        <input
                            type="password"
                            placeholder="Create a password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            minLength="6"
                            required
                        />

                    </div>


                    <div className="recruiter-input-group">

                        <label>Company document</label>

                        <div className="file-upload">

                            <input
                                id="companyDocument"
                                type="file"
                                accept=".pdf,.jpg,.jpeg,.png"
                                onChange={(e) =>
                                    setCompanyFile(e.target.files[0])
                                }
                                required
                            />

                            <div className="file-text">
                                <strong>
                                    Upload company details
                                </strong>

                                <span>
                                    PDF, JPG or PNG
                                </span>
                            </div>

                        </div>

                    </div>


                    <div className="verification-notice">

                        <div className="notice-icon">
                            !
                        </div>

                        <div>
                            <strong>Admin verification required</strong>

                            <p>
                                Your account will remain pending until
                                the administrator verifies your company
                                document.
                            </p>
                        </div>

                    </div>


                    {message && (
                        <div className="recruiter-message">
                            {message}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="recruiter-register-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Submitting..."
                            : "Submit for verification"}
                    </button>

                </form>


                <div className="recruiter-login">

                    Already have an account?

                    <Link to="/login">
                        Sign in
                    </Link>

                </div>


                <div className="student-register">

                    Looking for a job?

                    <Link to="/register">
                        Register as student
                    </Link>

                </div>

            </div>

        </div>
    );
}

export default RecruiterRegister;