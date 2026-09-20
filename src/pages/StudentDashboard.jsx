import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import AIChat from "../components/AIChat";

function StudentDashboard() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [skills, setSkills] = useState([]);
    const [jobs, setJobs] = useState([]);

    const [loading, setLoading] = useState(true);
    const [message, setMessage] = useState("");

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (!token) {
            navigate("/login");
            return;
        }

        fetch(`${import.meta.env.VITE_API_URL}/dashboard`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then(response => {

                if (!response.ok) {
                    throw new Error("Failed to load dashboard");
                }

                return response.json();
            })
            .then(data => {

                /*
                 * Your backend previously returned
                 * a user object and a separate skills list.
                 */

                setUser(data.user || data);
                setSkills(data.user.skill || data.user.skills || []);
                setJobs(data.job || data.jobs || data.js || []);
                setLoading(false);
            })
            .catch(error => {

                setMessage(error.message);
                setLoading(false);

            });

    }, [navigate]);


    /*
     * This replaces:
     *
     * <Link to="/jobs">All Jobs</Link>
     *
     * It first fetches the jobs from Spring Boot.
     */

    const openAllJobs = async () => {

        const token = localStorage.getItem("token");

        try {

            setMessage("");

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/jobs`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load jobs");
            }

            const data = await response.json();

            setJobs(data);

            /*
             * Store the fetched jobs temporarily so
             * AllJobs can display exactly what was fetched.
             */

            sessionStorage.setItem(
                "jobs",
                JSON.stringify(data)
            );

            navigate("/jobs");

        } catch (error) {

            setMessage(error.message);

        }
    };


    const openEditProfile = () => {
        navigate("/edit-profile");
    };


    const logout = () => {

        localStorage.removeItem("token");
        sessionStorage.removeItem("jobs");

        navigate("/login");
    };


    if (loading) {
        return (
            <div className="dashboard-loading">
                <div className="loading-spinner"></div>
                <p>Loading your dashboard...</p>
            </div>
        );
    }


    return (
        <div className="dashboard-layout">

            {/* SIDEBAR */}

            <aside className="sidebar">

                <div className="brand">
                    <div className="brand-icon">
                        J
                    </div>

                    <span>
                        JobMatch
                    </span>
                </div>


                <div className="sidebar-menu">

                    <button className="sidebar-item active">
                        <span>⌂</span>
                        Dashboard
                    </button>


                    {/* LINK IS REPLACED WITH FETCH */}

                    <button
                        className="sidebar-item"
                        onClick={openAllJobs}
                    >
                        <span>▣</span>
                        All Jobs
                    </button>


                    <button
                        className="sidebar-item"
                        onClick={openEditProfile}
                    >
                        <span>◉</span>
                        Edit Profile
                    </button>

                </div>


                <button
                    className="sidebar-logout"
                    onClick={logout}
                >
                    <span>↪</span>
                    Logout
                </button>

            </aside>


            {/* MAIN */}

            <main className="dashboard-main">

                <header className="dashboard-topbar">

                    <div>
                        <p className="topbar-small">
                            Student Portal
                        </p>

                        <h2>
                            Dashboard
                        </h2>
                    </div>


                    <div className="user-mini">

                        <div className="avatar">
                            {user?.email
                                ? user.email
                                    .charAt(0)
                                    .toUpperCase()
                                : "U"}
                        </div>

                        <div>
                            <strong>
                                {user?.email || "Student"}
                            </strong>

                            <span>
                                Student
                            </span>
                        </div>

                    </div>

                </header>


                <section className="welcome-card">

                    <div>

                        <p className="welcome-label">
                            Welcome back 👋
                        </p>

                        <h1>
                            Find your next opportunity.
                        </h1>

                        <p>
                            Discover jobs that match
                            your skills and career goals.
                        </p>

                        <button
                            className="hero-button"
                            onClick={openAllJobs}
                        >
                            Explore Jobs
                            <span>→</span>
                        </button>

                    </div>

                    <div className="welcome-decoration">
                        <div className="decoration-circle circle-one"></div>
                        <div className="decoration-circle circle-two"></div>
                        <div className="briefcase">
                            💼
                        </div>
                    </div>

                </section>


                {message && (
                    <div className="dashboard-error">
                        {message}
                    </div>
                )}


                {/* STATS */}

                <section className="stats-row">

                    <div className="dashboard-stat">

                        <div className="stat-icon purple">
                            ♧
                        </div>

                        <div>
                            <span>
                                Your Skills
                            </span>

                            <strong>
                                {skills.length}
                            </strong>
                        </div>

                    </div>


                    <div className="dashboard-stat">

                        <div className="stat-icon blue">
                            ▣
                        </div>

                        <div>
                            <span>
                                Available Jobs
                            </span>

                            <strong>
                                {jobs.length || "—"}
                            </strong>
                        </div>

                    </div>


                    <div className="dashboard-stat">

                        <div className="stat-icon green">
                            ✓
                        </div>

                        <div>
                            <span>
                                Account
                            </span>

                            <strong>
                                Active
                            </strong>
                        </div>

                    </div>

                </section>


                {/* PROFILE */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <h2>
                                Your Profile
                            </h2>

                            <p>
                                Your current account information
                            </p>
                        </div>

                        <button
                            className="outline-button"
                            onClick={openEditProfile}
                        >
                            Edit Profile
                        </button>

                    </div>


                    <div className="profile-panel">

                        <div className="profile-main">

                            <div className="large-avatar">
                                {user?.email
                                    ? user.email
                                        .charAt(0)
                                        .toUpperCase()
                                    : "U"}
                            </div>

                            <div>

                                <h3>
                                    {user?.name ||
                                     user?.username ||
                                     "Student"}
                                </h3>

                                <p>
                                    {user?.email}
                                </p>

                            </div>

                        </div>


                        <div className="profile-information">

                            <div>
                                <span>Email</span>
                                <strong>
                                    {user?.email || "Not available"}
                                </strong>
                            </div>


                            <div>
                                <span>Role</span>
                                <strong>
                                    {user?.role || "STUDENT"}
                                </strong>
                            </div>


                            <div>
                                <span>Skills</span>

                                <div className="skill-list">

                                    {skills.length === 0 ? (

                                        <small>
                                            No skills added
                                        </small>

                                    ) : (

                                        skills.map((skill, index) => (

                                            <span
                                                className="skill-tag"
                                                key={
                                                    skill.id ||
                                                    skill.skillid ||
                                                    index
                                                }
                                            >
                                                {skill.name}
                                            </span>

                                        ))

                                    )}

                                </div>

                            </div>

                        </div>

                    </div>

                </section>


                {/* JOBS */}

                <section className="dashboard-section">

                    <div className="section-heading">

                        <div>
                            <h2>
                                Recommended Jobs
                            </h2>

                            <p>
                                Opportunities waiting for you
                            </p>
                        </div>

                        <button
                            className="text-button"
                            onClick={openAllJobs}
                        >
                            View all →
                        </button>

                    </div>


                    {jobs.length === 0 ? (

                        <div className="empty-jobs">
                            <div>
                                🔎
                            </div>

                            <h3>
                                Find your next job
                            </h3>

                            <p>
                                Explore the latest opportunities
                                posted by recruiters.
                            </p>

                            <button
                                className="primary-small-button"
                                onClick={openAllJobs}
                            >
                                Browse Jobs
                            </button>
                        </div>

                    ) : (

                        <div className="dashboard-job-grid">

                            {jobs.slice(0, 3).map(job => (

                                <div
                                    className="dashboard-job-card"
                                    key={job.jobid}
                                >

                                    <div className="job-card-top">

                                        <div className="company-logo">
                                            {(job.company ||
                                                "C")
                                                .charAt(0)
                                                .toUpperCase()}
                                        </div>

                                        <span className="job-badge">
                                            New
                                        </span>

                                    </div>


                                    <h3>
                                        {job.title}
                                    </h3>

                                    <p className="job-company">
                                        {job.company ||
                                         "Company"}
                                    </p>

                                    <p className="job-location">
                                        📍 {job.location}
                                    </p>

                                    <p className="job-summary">
                                        {job.description ||
                                         job.discription ||
                                         "No description available."}
                                    </p>


                                    <button
                                        className="job-view-button"
                                        onClick={() =>
                                            navigate(
                                                `/jobs/${job.jobid}`
                                            )
                                        }
                                    >
                                        View Job
                                        <span>→</span>
                                    </button>

                                </div>

                            ))}

                        </div>

                    )}

                </section>

            </main>
<AIChat/>
        </div>
    );
}

export default StudentDashboard;