import { useEffect, useState } from "react";
import "./EditProfile.css";

function EditProfile() {

    const [profile, setProfile] = useState(null);

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");

    const [skills, setSkills] = useState([]);
    const [selectedSkills, setSelectedSkills] = useState([]);

    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    // GET PROFILE
    const loadProfile = async () => {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/profile`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load profile");
            }

            const data = await response.json();

            setProfile(data);

            setName(data.name);
            setEmail(data.email);

            // All available skills
            setSkills(data.skills);

            // Existing skills of this user
            const existingIds = data.existingSkills.map(
                skill => skill.skillid
            );

            setSelectedSkills(existingIds);

        } catch (error) {

            setMessage(error.message);

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {
        loadProfile();
    }, []);


    // CHECK / UNCHECK SKILL
    const toggleSkill = (skillid) => {

        setSelectedSkills(previous => {

            if (previous.includes(skillid)) {

                return previous.filter(
                    id => id !== skillid
                );

            }

            return [...previous, skillid];

        });
    };


    // UPDATE PROFILE
    const updateProfile = async (event) => {

        event.preventDefault();

        const token = localStorage.getItem("token");

        setSaving(true);
        setMessage("");

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/profile`,
                {
                    method: "PUT",

                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },

                    body: JSON.stringify({
                        name: name,
                        email: email,
                        skillIds: selectedSkills
                    })
                }
            );

            if (!response.ok) {
                throw new Error("Profile update failed");
            }

            const data = await response.text();

            setMessage(
                data || "Profile updated successfully"
            );

            // Get latest profile from database
            await loadProfile();

        } catch (error) {

            setMessage(error.message);

        } finally {

            setSaving(false);

        }
    };


    if (loading) {
        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );
    }


    return (

        <div className="edit-profile-page">

            <div className="profile-background">
                <div className="glow glow-one"></div>
                <div className="glow glow-two"></div>
            </div>


            <div className="profile-container">

                {/* LEFT SIDE */}

                <div className="profile-intro">

                    <div className="profile-icon">
                        {name
                            ? name.charAt(0).toUpperCase()
                            : "U"
                        }
                    </div>

                    <span className="profile-label">
                        YOUR PROFILE
                    </span>

                    <h1>
                        Shape your
                        <span> profile.</span>
                    </h1>

                    <p>
                        Keep your information and skills
                        up to date so recruiters can see
                        what you actually know.
                    </p>

                    <div className="skill-count">

                        <strong>
                            {selectedSkills.length}
                        </strong>

                        <div>
                            <span>Skills selected</span>
                            <small>
                                from {skills.length} available
                            </small>
                        </div>

                    </div>

                </div>


                {/* RIGHT SIDE */}

                <form
                    className="profile-card"
                    onSubmit={updateProfile}
                >

                    <div className="card-heading">

                        <div>
                            <span>ACCOUNT</span>
                            <h2>Edit Profile</h2>
                        </div>

                        <div className="edit-dot"></div>

                    </div>


                    {/* NAME */}

                    <div className="input-group">

                        <label>
                            FULL NAME
                        </label>

                        <input
                            type="text"
                            value={name}
                            onChange={(e) =>
                                setName(e.target.value)
                            }
                            placeholder="Enter your name"
                            required
                        />

                    </div>


                    {/* EMAIL */}

                    <div className="input-group">

                        <label>
                            EMAIL ADDRESS
                        </label>

                        <input
                            type="email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            placeholder="Enter your email"
                            required
                        />

                    </div>


                    {/* SKILLS */}

                    <div className="skills-heading">

                        <div>
                            <label>
                                YOUR SKILLS
                            </label>

                            <p>
                                Select everything you can work with
                            </p>
                        </div>

                        <span>
                            {selectedSkills.length}
                        </span>

                    </div>


                    <div className="skills-grid">

                        {skills.map(skill => {

                            const checked =
                                selectedSkills.includes(
                                    skill.skillid
                                );

                            return (

                                <label
                                    className={
                                        checked
                                            ? "skill-option selected"
                                            : "skill-option"
                                    }
                                    key={skill.skillid}
                                >

                                    <input
                                        type="checkbox"
                                        checked={checked}
                                        onChange={() =>
                                            toggleSkill(
                                                skill.skillid
                                            )
                                        }
                                    />

                                    <span className="custom-check">
                                        {checked && "✓"}
                                    </span>

                                    <span className="skill-name">
                                        {skill.name}
                                    </span>

                                </label>

                            );

                        })}

                    </div>


                    {/* MESSAGE */}

                    {message && (

                        <div
                            className={
                                message.toLowerCase().includes("failed")
                                    ? "profile-message error"
                                    : "profile-message"
                            }
                        >
                            {message}
                        </div>

                    )}


                    {/* SUBMIT */}

                    <button
                        type="submit"
                        className="save-profile"
                        disabled={saving}
                    >

                        <span>
                            {saving
                                ? "Saving..."
                                : "Save Changes"
                            }
                        </span>

                        {!saving && (
                            <span className="arrow">
                                →
                            </span>
                        )}

                    </button>

                </form>

            </div>

        </div>

    );
}

export default EditProfile;


