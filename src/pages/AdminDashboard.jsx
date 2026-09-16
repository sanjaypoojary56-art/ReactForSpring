import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {
    const [applications, setApplications] = useState([]);
    const [skills, setSkills] = useState([]);
    const [newSkill, setNewSkill] = useState("");
    const [message, setMessage] = useState("");
    const [skillsMessage, setSkillsMessage] = useState("");
    const [skillsLoading, setSkillsLoading] = useState(false);
    const [addingSkill, setAddingSkill] = useState(false);

    const token = localStorage.getItem("token");
    const apiUrl = import.meta.env.VITE_API_URL;

    const loadApplications = async () => {
        try {
            const response = await fetch(
                `${apiUrl}/admin/recruiter-applications`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                setMessage("Unable to load applications");
                return;
            }

            const data = await response.json();
            setApplications(data);
        } catch (error) {
            console.error(error);
            setMessage("Server connection failed");
        }
    };

    const loadSkills = async () => {
        setSkillsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/admin/addskills`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            if (!response.ok) {
                setSkillsMessage("Unable to load skills.");
                return;
            }

            const data = await response.json();
            setSkills(Array.isArray(data) ? data : []);
            setSkillsMessage("");
        } catch (error) {
            console.error(error);
            setSkillsMessage("Unable to connect to the server.");
        } finally {
            setSkillsLoading(false);
        }
    };

    useEffect(() => {
        loadApplications();
        loadSkills();
    }, []);

    const approveApplication = async (id) => {
        const response = await fetch(
            `${apiUrl}/admin/recruiter-applications/${id}/approve`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            setMessage("Recruiter approved.");
            loadApplications();
        } else {
            setMessage("Approval failed.");
        }
    };

    const viewDocument = async (id) => {
        const response = await fetch(
            `${apiUrl}/admin/recruiter-applications/${id}/document`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (!response.ok) {
            alert("Unable to open");
            return;
        }

        const blob = await response.blob();
        const url = URL.createObjectURL(blob);
        window.open(url, "_blank");
    };

    const rejectApplication = async (id) => {
        const response = await fetch(
            `${apiUrl}/admin/recruiter-applications/${id}/reject`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        if (response.ok) {
            setMessage("Application rejected.");
            loadApplications();
        } else {
            setMessage("Rejection failed.");
        }
    };

    const addSkill = async (event) => {
        event.preventDefault();

        const enteredName = newSkill.trim();
        if (!enteredName) {
            setSkillsMessage("Enter a skill name.");
            return;
        }

        const alreadyExists = skills.some(
            (skill) =>
                skill?.name?.trim().toLowerCase() === enteredName.toLowerCase()
        );

        if (alreadyExists) {
            setSkillsMessage(`"${enteredName}" is already available.`);
            return;
        }

        const skillToAdd = { name: enteredName };

        setAddingSkill(true);
        try {
            const response = await fetch(`${apiUrl}/admin/addskills`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    skills: [skillToAdd]
                })
            });

            if (!response.ok) {
                setSkillsMessage("Unable to add skill.");
                return;
            }

            setNewSkill("");
            setSkillsMessage(`"${enteredName}" added successfully.`);
            await loadSkills();
        } catch (error) {
            console.error(error);
            setSkillsMessage("Unable to connect to the server.");
        } finally {
            setAddingSkill(false);
        }
    };

    return (
        <div className="admin-page">
            <div className="admin-header">
                <div>
                    <span>ADMIN PANEL</span>
                    <h1>Recruiter Applications</h1>
                    <p>
                        Review companies before allowing them to join
                        the platform.
                    </p>
                </div>
            </div>

            {message && <div className="admin-message">{message}</div>}

            <section className="skills-panel">
                <div className="skills-header">
                    <div>
                        <span>SKILL MANAGEMENT</span>
                        <h2>Available Skills</h2>
                        <p>Manage the skills that recruiters can use for jobs.</p>
                    </div>
                    <span className="skill-count">{skills.length} skills</span>
                </div>

                {skillsMessage && (
                    <div className="skills-message">{skillsMessage}</div>
                )}

                <form className="add-skill-form" onSubmit={addSkill}>
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(event) => setNewSkill(event.target.value)}
                        placeholder="Enter a new skill"
                        aria-label="New skill name"
                    />
                    <button type="submit" disabled={addingSkill}>
                        {addingSkill ? "Adding..." : "Add Skill"}
                    </button>
                </form>

                <div className="skills-list">
                    {skillsLoading ? (
                        <div className="skills-empty">Loading skills...</div>
                    ) : skills.length === 0 ? (
                        <div className="skills-empty">No skills available.</div>
                    ) : (
                        skills.map((skill) => (
                            <span className="skill-chip" key={skill.skillid}>
                                {skill.name}
                            </span>
                        ))
                    )}
                </div>
            </section>

            <div className="application-list">
                {applications.length === 0 ? (
                    <div className="empty">No pending applications.</div>
                ) : (
                    applications.map((application) => (
                        <div className="application-card" key={application.id}>
                            <div className="company-info">
                                <div className="company-icon">C</div>
                                <div>
                                    <h3>{application.email}</h3>
                                    <p>
                                        Application ID: {application.id}
                                    </p>
                                    <span className="pending">PENDING</span>
                                </div>
                            </div>

                            <div className="application-actions">
                                <button onClick={() => viewDocument(application.id)}>
                                    View Document
                                </button>
                                <button
                                    className="allow-button"
                                    onClick={() => approveApplication(application.id)}
                                >
                                    Allow
                                </button>
                                <button
                                    className="reject-button"
                                    onClick={() => rejectApplication(application.id)}
                                >
                                    Reject
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}

export default AdminDashboard;
