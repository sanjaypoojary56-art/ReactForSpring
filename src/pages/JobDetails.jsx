
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "./JobDetails.css";

function JobDetails() {

  const { id } = useParams();

  const navigate = useNavigate();

  const [job, setJob] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState(false);


  // GET ONE JOB
  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetch(`${import.meta.env.VITE_API_URL}/jobs/${id}`, {
      method: "GET",

      headers: {
        Authorization: `Bearer ${token}`
      }
    })

      .then(async (response) => {

        if (response.status === 401 ||
            response.status === 403) {

          localStorage.removeItem("token");
          localStorage.removeItem("role");

          navigate("/login");

          throw new Error("Session expired");
        }

        if (!response.ok) {
          throw new Error("Failed to load job");
        }

        return response.json();
      })

      .then((data) => {

        setJob(data);
        setLoading(false);

      })

      .catch((error) => {

        console.error(error);

        setMessage(error.message);
        setLoading(false);

      });

  }, [id, navigate]);


  // APPLY FOR JOB
  const applyJob = async () => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    setApplying(true);
    setMessage("");

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/jobs/${id}/apply`,
        {
          method: "POST",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      const data = await response.text();


      if (!response.ok) {

        setMessage(data || "Unable to apply");

        setApplying(false);

        return;
      }


      setMessage(data);

    } catch (error) {

      console.error(error);

      setMessage(
        "Unable to connect to server"
      );

    }

    setApplying(false);
  };


  if (loading) {

    return (
      <div className="job-loading">
        <div className="job-loader"></div>

        <p>
          Loading job details...
        </p>
      </div>
    );

  }


  if (!job) {

    return (
      <div className="job-error">

        <h2>
          Unable to load job
        </h2>

        <p>
          {message}
        </p>

        <button
          onClick={() => navigate("/jobs")}
        >
          Back to All Jobs
        </button>

      </div>
    );

  }


  return (

    <div className="job-details-page">

      <div className="job-details-card">


        {/* BACK BUTTON */}

        <button
          className="back-button"
          onClick={() => navigate("/jobs")}
        >
          ← Back to All Jobs
        </button>


        {/* JOB HEADER */}

        <div className="job-header">

          <div className="company-logo">
            {job.title
              ? job.title.charAt(0).toUpperCase()
              : "J"}
          </div>


          <div>

            <p className="job-label">
              JOB OPPORTUNITY
            </p>

            <h1>
              {job.title}
            </h1>

          </div>

        </div>


        {/* BASIC INFORMATION */}

        <div className="job-info-grid">

          <div className="info-box">

            <span>
              Location
            </span>

            <strong>
              {job.location || "Not specified"}
            </strong>

          </div>


          <div className="info-box">

            <span>
              Recruiter
            </span>

            <strong>
              Recruiter #{job.recruiterid}
            </strong>

          </div>


          <div className="info-box">

            <span>
              Match
            </span>

            <strong>
              {job.matchpercentage != null
                ? `${Math.round(
                    job.matchpercentage
                  )}%`
                : "N/A"}
            </strong>

          </div>

        </div>


        {/* DESCRIPTION */}

        <section className="job-section">

          <h2>
            About this Job
          </h2>

          <p className="job-description">
            {job.discription}
          </p>

        </section>


        {/* REQUIRED SKILLS */}

        <section className="job-section">

          <h2>
            Required Skills
          </h2>


          <div className="skills-list">

            {(job.skill || []).length > 0 ? (

              job.skill.map((skill) => (

                <span
                  className="skill"
                  key={skill.skillid}
                >
                  {skill.name}
                </span>

              ))

            ) : (

              <p className="no-skills">
                No specific skills listed.
              </p>

            )}

          </div>

        </section>


        {/* APPLY */}

        <section className="apply-section">

          <div>

            <h2>
              Interested in this job?
            </h2>

            <p>
              Submit your application to the recruiter.
            </p>

          </div>


          <button
            className="apply-button"
            onClick={applyJob}
            disabled={applying}
          >

            {applying
              ? "Applying..."
              : "Apply for Job"}

          </button>

        </section>


        {/* RESPONSE MESSAGE */}

        {message && (

          <div className="application-message">

            {message}

          </div>

        )}

      </div>

    </div>

  );
}

export default JobDetails;
