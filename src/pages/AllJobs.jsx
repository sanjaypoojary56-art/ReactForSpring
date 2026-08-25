
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AllJobs.css";

function AllJobs() {

  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }


    fetch(
      `${import.meta.env.VITE_API_URL}/jobs`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    )
      .then(response => {

        if (!response.ok) {
          throw new Error("Unable to load jobs.");
        }

        return response.json();

      })
      .then(data => {

        setJobs(data);
        setLoading(false);

      })
      .catch(err => {

        setError(err.message);
        setLoading(false);

      });

  }, [navigate]);


  const filteredJobs = jobs.filter(job => {

    const text = `
      ${job.title || ""}
      ${job.company || ""}
      ${job.location || ""}
      ${job.discription || ""}
    `.toLowerCase();

    return text.includes(
      search.toLowerCase()
    );

  });


  const logout = () => {

    localStorage.removeItem("token");

    navigate("/login");

  };


  if (loading) {
    return (
      <div className="jobs-loading">
        Loading jobs...
      </div>
    );
  }


  return (
    <div className="jobs-page">

      <header className="jobs-header">

        <div className="jobs-brand">

          <div className="jobs-logo">
            J
          </div>

          JobMatch

        </div>


        <nav>

          <button
            onClick={() => navigate("/dashboard")}
          >
            Dashboard
          </button>

          <button
            onClick={() => navigate("/profile")}
          >
            Profile
          </button>

          <button
            className="logout-button"
            onClick={logout}
          >
            Logout
          </button>

        </nav>

      </header>


      <main className="jobs-content">

        <div className="jobs-title">

          <div>

            <span>
              OPPORTUNITIES
            </span>

            <h1>
              Explore jobs
            </h1>

            <p>
              Find opportunities matching your skills.
            </p>

          </div>


          <div className="job-count">
            {filteredJobs.length} jobs
          </div>

        </div>


        <div className="job-search">

          <span>
            ⌕
          </span>

          <input
            type="text"
            placeholder="Search jobs, companies or locations..."
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
          />

        </div>


        {error && (
          <div className="jobs-error">
            {error}
          </div>
        )}


        <div className="jobs-list">

          {filteredJobs.length === 0 ? (

            <div className="no-jobs">

              <h2>
                No jobs found
              </h2>

              <p>
                Try another search.
              </p>

            </div>

          ) : (

            filteredJobs.map(job => (

              <article
                className="job-card"
                key={job.jobid}
              >

                <div className="job-main">

                  <div className="job-company-icon">
                    {job.title?.charAt(0)?.toUpperCase()}
                  </div>


                  <div className="job-information">

                    <h2>
                      {job.title}
                    </h2>

                    {job.company && (
                      <p className="job-company">
                        {job.company}
                      </p>
                    )}

                    {job.location && (
                      <span className="job-location">
                        📍 {job.location}
                      </span>
                    )}

                    <p className="job-description">
                      {job.discription}
                    </p>

                  </div>

                </div>


                <div className="job-side">

                  {job.matchpercentage !== undefined && (

                    <div className="match-box">

                      <strong>
                        {job.matchpercentage}%
                      </strong>

                      <span>
                        Match
                      </span>

                    </div>

                  )}


                  <button
                    className="job-view-button"
                    onClick={() =>
                      navigate(`/jobs/${job.jobid}`)
                    }
                  >
                    View job →
                  </button>

                </div>

              </article>

            ))

          )}

        </div>

      </main>

    </div>
  );
}

export default AllJobs;