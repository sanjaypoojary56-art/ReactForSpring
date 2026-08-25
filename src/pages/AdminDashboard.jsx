
import { useEffect, useState } from "react";
import "./AdminDashboard.css";

function AdminDashboard() {

    const [applications, setApplications] = useState([]);
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    const loadApplications = async () => {

        try {

            const response = await fetch(
                `${import.meta.env.VITE_API_URL}/admin/recruiter-applications`,
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


    useEffect(() => {
        loadApplications();
    }, []);


    const approveApplication = async (id) => {

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/admin/recruiter-applications/${id}/approve`,
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
        const token = localStorage.getItem("token");
        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/admin/recruiter-applications/${id}/document`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );
        if(!response.ok)
        {
            alert("Unable to open");
            return;
        }
        const blob=await response.blob();
        const url=URL.createObjectURL(blob);
        window.open(url,"_blank");

    };
    const rejectApplication = async (id) => {

        const response = await fetch(
            `${import.meta.env.VITE_API_URL}/admin/recruiter-applications/${id}/reject`,
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


            {message && (
                <div className="admin-message">
                    {message}
                </div>
            )}


            <div className="application-list">

                {applications.length === 0 ? (

                    <div className="empty">
                        No pending applications.
                    </div>

                ) : (

                    applications.map((application) => (

                        <div
                            className="application-card"
                            key={application.id}
                        >

                            <div className="company-info">

                                <div className="company-icon">
                                    C
                                </div>

                                <div>

                                    <h3>
                                        {application.email}
                                    </h3>

                                    <p>
                                        Application ID:
                                        {" "}
                                        {application.id}
                                    </p>

                                    <span className="pending">
                                        PENDING
                                    </span>

                                </div>

                            </div>


                            <div className="application-actions">

                                <button
                                onClick={()=>viewDocument(application.id)}>
                                    View Document
                                </button>


                                <button
                                    className="allow-button"
                                    onClick={() =>
                                        approveApplication(application.id)
                                    }
                                >
                                    Allow
                                </button>


                                <button
                                    className="reject-button"
                                    onClick={() =>
                                        rejectApplication(application.id)
                                    }
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
