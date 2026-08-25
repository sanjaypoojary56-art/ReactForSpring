import { useEffect, useState } from "react";
import "./RecruiterDashboard.css";

function RecruiterDashboard() {

  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  // NEW: available skills
  const [skills, setSkills] = useState([]);

  // NEW: skills selected while creating job
  const [selectedSkills, setSelectedSkills] = useState([]);

  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const [showJobForm, setShowJobForm] = useState(false);

  const [jobForm, setJobForm] = useState({
    title: "",
    description: "",
    location:""
  });

  const token = localStorage.getItem("token");


  // =========================================
  // LOAD DASHBOARD
  // =========================================

  useEffect(() => {

    if (!token) {
      window.location.href = "/login";
      return;
    }

    loadDashboard();

  }, []);


  const loadDashboard = async () => {

    try {

      setLoading(true);


      // GET JOBS
      const jobsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/recruiter/jobs`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      // GET APPLICATIONS
      const applicationsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/recruiter/applications`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      // NEW: GET ALL SKILLS
      const skillsResponse = await fetch(
        `${import.meta.env.VITE_API_URL}/recruiter/skill`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (!jobsResponse.ok) {
        throw new Error("Unable to load jobs");
      }


      if (!applicationsResponse.ok) {
        throw new Error(
          "Unable to load applications"
        );
      }


      if (!skillsResponse.ok) {
        throw new Error(
          "Unable to load skills"
        );
      }


      const jobsData =
        await jobsResponse.json();


      const applicationsData =
        await applicationsResponse.json();


      // NEW
      const skillsData =
        await skillsResponse.json();


      setJobs(jobsData);

      setApplications(applicationsData);
      console.log(skillsData);
      // NEW
      setSkills(skillsData);


    } catch (error) {

      setMessage(error.message);

    } finally {

      setLoading(false);

    }

  };


  // =========================================
  // JOB FORM
  // =========================================

  const handleJobChange = (event) => {

    const { name, value } = event.target;

    setJobForm({
      ...jobForm,
      [name]: value
    });

  };


  // =========================================
  // NEW: SELECT / UNSELECT SKILL
  // =========================================

  const toggleSkill = (skill) => {

    const alreadySelected =
      selectedSkills.some(
        selected =>
          selected.skillid === skill.skillid
      );


    if (alreadySelected) {

      setSelectedSkills(
        selectedSkills.filter(
          selected =>
            selected.skillid !== skill.skillid
        )
      );

    } else {

      setSelectedSkills([
        ...selectedSkills,
        skill
      ]);

    }

  };


  // =========================================
  // POST JOB
  // =========================================

  const postJob = async (event) => {

    event.preventDefault();


    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/recruiter/jobs`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({

            title: jobForm.title,

            description:
              jobForm.description,
            location:jobForm.location,
            // NEW: selected skills
            skill: selectedSkills

          })
        }
      );


      if (!response.ok) {
        throw new Error(
          "Unable to post job"
        );
      }


      const newJob =
        await response.json();


      setJobs(previousJobs => [
        ...previousJobs,
        newJob
      ]);


      setJobForm({
        title: "",
        description: "",
        location:""
      });


      // NEW: clear selected skills
      setSelectedSkills([]);


      setShowJobForm(false);


      showMessage(
        "Job posted successfully"
      );


    } catch (error) {

      showMessage(error.message);

    }

  };


  // =========================================
  // DELETE JOB
  // =========================================

  const deleteJob = async (jobid) => {

    const confirmed =
      window.confirm(
        "Are you sure you want to delete this job?"
      );


    if (!confirmed) {
      return;
    }


    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/recruiter/jobs/${jobid}`,
        {
          method: "DELETE",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (!response.ok) {
        throw new Error(
          "Unable to delete job"
        );
      }


      setJobs(previousJobs =>
        previousJobs.filter(
          job => job.jobid !== jobid
        )
      );


      showMessage(
        "Job deleted successfully"
      );


    } catch (error) {

      showMessage(error.message);

    }

  };


  // =========================================
  // UPDATE APPLICATION STATUS
  // =========================================

  const changeStatus = async (
    applicationid,
    status
  ) => {

    try {

      const response = await fetch(
        `${import.meta.env.VITE_API_URL}/recruiter/applications/${applicationid}/status/${status}`,
        {
          method: "PUT",

          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );


      if (!response.ok) {
        throw new Error(
          "Unable to update application"
        );
      }


      const updatedApplication =
        await response.json();
await loadDashboard();

      setApplications(
        previousApplications =>
          previousApplications.map(
            application =>
              application.applicationid ===
              applicationid
                ? updatedApplication
                : application
          )
      );


      showMessage(
        `Application marked as ${formatStatus(status)}`
      );


    } catch (error) {

      showMessage(error.message);

    }

  };


  // =========================================
  // MESSAGE
  // =========================================

  const showMessage = (text) => {

    setMessage(text);

    setTimeout(() => {
      setMessage("");
    }, 3000);

  };


  // =========================================
  // LOGOUT
  // =========================================

  const logout = () => {

    localStorage.removeItem("token");

    window.location.href = "/login";

  };


  // =========================================
  // STATUS TEXT
  // =========================================

  const formatStatus = (status) => {

    if (!status) {
      return "";
    }

    return status
      .toLowerCase()
      .replace("_", " ")
      .replace(/\b\w/g, letter =>
        letter.toUpperCase()
      );

  };


  // =========================================
  // COUNTS
  // =========================================

  const shortlistedCount =
    applications.filter(
      app =>
        app.status === "SHORTLISTED"
    ).length;


  const interviewCount =
    applications.filter(
      app =>
        app.status === "INTERVIEW"
    ).length;


  const hiredCount =
    applications.filter(
      app =>
        app.status === "HIRED"
    ).length;


  // =========================================
  // LOADING
  // =========================================

  if (loading) {

    return (

      <div className="dashboard-loading">

        <div className="loading-ring"></div>

        <h2>
          Loading dashboard
        </h2>

        <p>
          Preparing your recruiter workspace...
        </p>

      </div>

    );

  }


  return (

    <div className="recruiter-dashboard">


      {/* =====================================
          TOP BAR
      ====================================== */}

      <header className="topbar">

        <div className="brand">

          <div className="brand-mark">
            J
          </div>

          <div>

            <h2>
              JobSphere
            </h2>

            <span>
              Recruiter workspace
            </span>

          </div>

        </div>


        <div className="topbar-right">

          <div className="online-status">

            <span></span>

            Online

          </div>


          <button
            className="logout-btn"
            onClick={logout}
          >
            Logout
          </button>

        </div>

      </header>


      {/* =====================================
          MAIN
      ====================================== */}

      <main className="dashboard-content">


        {/* HERO */}

        <section className="welcome-section">

          <div>

            <span className="eyebrow">
              RECRUITER CONTROL CENTER
            </span>

            <h1>
              Build your next team.
            </h1>

            <p>
              Manage your job openings, review
              candidates, and move the right
              people forward.
            </p>

          </div>


          <button
            className="create-job-btn"
            onClick={() =>
              setShowJobForm(true)
            }
          >

            <span className="plus-icon">
              +
            </span>

            Post New Job

          </button>

        </section>


        {/* MESSAGE */}

        {message && (

          <div className="toast-message">

            <span className="toast-check">
              ✓
            </span>

            {message}

          </div>

        )}


        {/* STATISTICS */}

        <section className="stats-grid">


          <div className="stat-box">

            <div className="stat-top">

              <span className="stat-label">
                ACTIVE JOBS
              </span>

              <span className="stat-symbol purple">
                ◆
              </span>

            </div>

            <strong>
              {jobs.length}
            </strong>

            <p>
              Jobs you've posted
            </p>

          </div>


          <div className="stat-box">

            <div className="stat-top">

              <span className="stat-label">
                APPLICATIONS
              </span>

              <span className="stat-symbol blue">
                ●
              </span>

            </div>

            <strong>
              {applications.length}
            </strong>

            <p>
              Candidates applied
            </p>

          </div>


          <div className="stat-box">

            <div className="stat-top">

              <span className="stat-label">
                SHORTLISTED
              </span>

              <span className="stat-symbol orange">
                ★
              </span>

            </div>

            <strong>
              {shortlistedCount}
            </strong>

            <p>
              Candidates to review
            </p>

          </div>


          <div className="stat-box">

            <div className="stat-top">

              <span className="stat-label">
                HIRED
              </span>

              <span className="stat-symbol green">
                ✓
              </span>

            </div>

            <strong>
              {hiredCount}
            </strong>

            <p>
              Successful placements
            </p>

          </div>


        </section>


        {/* =====================================
            YOUR JOBS
        ====================================== */}

        <section className="content-section">

          <div className="section-title-row">

            <div>

              <span className="section-number">
                01
              </span>

              <div className="section-title">

                <h2>
                  Your Job Openings
                </h2>

                <p>
                  Manage every position you've posted.
                </p>

              </div>

            </div>


            <span className="count-pill">
              {jobs.length} jobs
            </span>

          </div>


          {jobs.length === 0 ? (

            <div className="empty-state">

              <div className="empty-art">
                +
              </div>

              <h3>
                No job openings yet
              </h3>

              <p>
                Create your first position and
                start finding candidates.
              </p>

              <button
                className="create-job-btn"
                onClick={() =>
                  setShowJobForm(true)
                }
              >
                Post Your First Job
              </button>

            </div>

          ) : (

            <div className="jobs-list">

              {jobs.map(job => {

                const jobApplications =
                  applications.filter(
                    application =>
                      application.job?.jobid ===
                      job.jobid
                  );


                return (

                  <article
                    className="job-item"
                    key={job.jobid}
                  >

                    <div className="job-accent"></div>


                    <div className="job-main">

                      <div className="job-icon">
                        {job.title
                          ?.charAt(0)
                          ?.toUpperCase()}
                      </div>


                      <div className="job-info">

                        <span className="job-id">
                          JOB #{job.jobid}
                        </span>

                        <h3>
                          {job.title}
                        </h3>

                        <p>
                          {job.description}
                        </p>

                      </div>

                    </div>


                    <div className="job-meta">

                      <div>

                        <strong>
                          {jobApplications.length}
                        </strong>

                        <span>
                          Applicants
                        </span>

                      </div>


                      <button
                        className="delete-job-btn"
                        onClick={() =>
                          deleteJob(job.jobid)
                        }
                      >
                        Delete
                      </button>

                    </div>

                  </article>

                );

              })}

            </div>

          )}

        </section>


        {/* =====================================
            APPLICATIONS
        ====================================== */}

        <section className="content-section">

          <div className="section-title-row">

            <div>

              <span className="section-number">
                02
              </span>

              <div className="section-title">

                <h2>
                  Candidate Applications
                </h2>

                <p>
                  Review candidates and decide
                  who moves forward.
                </p>

              </div>

            </div>


            <span className="count-pill">
              {applications.length} applications
            </span>

          </div>


          {applications.length === 0 ? (

            <div className="empty-state">

              <div className="empty-art">
                ◎
              </div>

              <h3>
                Your inbox is quiet
              </h3>

              <p>
                Candidate applications will appear
                here when students apply.
              </p>

            </div>

          ) : (

            <div className="applications-grid">

              {applications.map(application => {

                const student =
                  application.user;

                const appliedJob =
                  application.job;


                return (

                  <article
                    className="candidate-card"
                    key={
                      application.applicationid
                    }
                  >


                    <div className="candidate-top">

                      <div className="candidate-profile">

                        <div className="avatar">

                          {student?.name
                            ?.charAt(0)
                            ?.toUpperCase() || "?"}

                        </div>


                        <div>

                          <h3>
                            {student?.name ||
                              "Unknown Student"}
                          </h3>

                          <p>
                            {student?.email}
                          </p>

                        </div>

                      </div>


                      <span
                        className={
                          `application-status status-${application.status?.toLowerCase()}`
                        }
                      >
                        {formatStatus(
                          application.status
                        )}
                      </span>

                    </div>


                    <div className="applied-position">

                      <span>
                        APPLIED FOR
                      </span>

                      <strong>
                        {appliedJob?.title ||
                          "Unknown Job"}
                      </strong>

                    </div>


                    <div className="candidate-skills">

                      <span className="skills-heading">
                        SKILLS
                      </span>


                      <div className="skill-list">

                        {application.user.skills?.skill &&
                        application.user.skills.length > 0 ? (

                          application.user.skills.map(
                            (skill, index) => (

                              <span
                                className="skill"
                                key={
                                  skill.skillid ||
                                  skill.id ||
                                  index
                                }
                              >
                                {skill.name}
                              </span>

                            )
                          )

                        ) : (

                          <span className="no-skills">
                            No skills added
                          </span>

                        )}

                      </div>

                    </div>


                    <div className="candidate-actions">


                      {application.status ===
                        "APPLIED" && (

                        <>

                          <button
                            className="action-primary"
                            onClick={() =>
                              changeStatus(
                                application.id,
                                "SHORTLISTED"
                              )
                            }
                          >
                            Shortlist
                          </button>


                          <button
                            className="action-danger"
                            onClick={() =>
                              changeStatus(
                                application.id,
                                "REJECTED"
                              )
                            }
                          >
                            Reject
                          </button>

                        </>

                      )}


                      {application.status ===
                        "SHORTLISTED" && (

                        <>

                          <button
                            className="action-primary"
                            onClick={() =>
                              changeStatus(
                                application.id,
                                "INTERVIEW"
                              )
                            }
                          >
                            Move to Interview
                          </button>


                          <button
                            className="action-danger"
                            onClick={() =>
                              changeStatus(
                                application.id,
                                "REJECTED"
                              )
                            }
                          >
                            Reject
                          </button>

                        </>

                      )}


                      {application.status ===
                        "INTERVIEW" && (

                        <>

                          <button
                            className="action-success"
                            onClick={() =>
                              changeStatus(
                                application.id,
                                "HIRED"
                              )
                            }
                          >
                            Hire Candidate
                          </button>


                          <button
                            className="action-danger"
                            onClick={() =>
                              changeStatus(
                                application.id,
                                "REJECTED"
                              )
                            }
                          >
                            Reject
                          </button>

                        </>

                      )}


                      {application.status ===
                        "HIRED" && (

                        <div className="completed hired">
                          ✓ Candidate hired
                        </div>

                      )}


                      {application.status ===
                        "REJECTED" && (

                        <div className="completed rejected">
                          Application rejected
                        </div>

                      )}

                    </div>

                  </article>

                );

              })}

            </div>

          )}

        </section>

      </main>


      {/* =====================================
          POST JOB MODAL
      ====================================== */}

      {showJobForm && (

        <div
          className="modal-overlay"
          onClick={() =>
            setShowJobForm(false)
          }
        >

          <div
            className="job-modal"
            onClick={event =>
              event.stopPropagation()
            }
          >


            <div className="modal-top">

              <div>

                <span className="eyebrow">
                  NEW OPPORTUNITY
                </span>

                <h2>
                  Create a Job
                </h2>

              </div>


              <button
                className="modal-close"
                onClick={() =>
                  setShowJobForm(false)
                }
              >
                ×
              </button>

            </div>


            <form onSubmit={postJob}>


              <label>
                Job title
              </label>

              <input
                type="text"
                name="title"
                value={jobForm.title}
                onChange={handleJobChange}
                placeholder="e.g. Java Backend Developer"
                required
              />


              <label>
                Job description
              </label>

              <textarea
                name="description"
                value={jobForm.description}
                onChange={handleJobChange}
                placeholder="Describe the responsibilities, requirements and expectations..."
                rows="7"
                required
              />
              <label>
                Location
              </label>
              <input type="text"
              name="location"
              value={jobForm.location}
              onChange={handleJobChange}
              placeholder="e.g.Bengaluru"
              required
              />

              {/* =================================
                  NEW: SKILL CHECKBOXES
              ================================== */}

              <label>
                Required Skills
              </label>


              <div className="skills-checkbox-container">

                {skills.length === 0 ? (

                  <p className="no-skills-message">
                    No skills available.
                  </p>

                ) : (

                  skills.map(skill => {

                    const checked =
                      selectedSkills.some(
                        selected =>
                          selected.skillid ===
                          skill.skillid
                      );


                    return (

                      <label
                        className={
                          checked
                            ? "skill-checkbox selected"
                            : "skill-checkbox"
                        }
                        key={skill.skillid}
                      >

                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() =>
                            toggleSkill(skill)
                          }
                        />


                        <span className="custom-checkbox">

                          {checked && "✓"}

                        </span>


                        <span className="skill-name">

                          {skill.name}

                        </span>

                      </label>

                    );

                  })

                )}

              </div>


              <div className="modal-footer">

                <button
                  type="button"
                  className="modal-cancel"
                  onClick={() =>
                    setShowJobForm(false)
                  }
                >
                  Cancel
                </button>


                <button
                  type="submit"
                  className="modal-submit"
                >
                  Publish Job
                </button>

              </div>


            </form>

          </div>

        </div>

      )}

    </div>

  );

}

export default RecruiterDashboard;