import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Jobs.css";

function Jobs() {

  const [jobs, setJobs] = useState([]);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const navigate = useNavigate();


  useEffect(() => {

    const token =
      localStorage.getItem("token");


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

      .then(async response => {

        if (response.status === 401 ||
            response.status === 403) {

          localStorage.removeItem("token");

          navigate("/login");

          throw new Error("Session expired");

        }


        if (!response.ok) {

          throw new Error(
            "Failed to load jobs"
          );

        }


        return response.json();

      })

      .then(data => {

        setJobs(data);

        setLoading(false);

      })

      .catch(error => {

        setError(error.message);

        setLoading(false);

      });

  }, [navigate]);


  if (loading) {

    return <h2>Loading jobs...</h2>;

  }


  if (error) {

    return <h2>{error}</h2>;

  }


  return (

    <div className="jobs-page">

      <h1>
        All Jobs
      </h1>


      <div className="jobs-container">

        {jobs.map(job => (

          <div
            className="job-card"
            key={job.jobid}
          >

            <h2>
              {job.title}
            </h2>

            <p>
              {job.discription}
            </p>

            <p>
              Location: {job.location}
            </p>

            <p>
              Recruiter: #{job.recruiterid}
            </p>


            <button
              onClick={() =>
                navigate(
                  `/jobs/${job.jobid}`
                )
              }
            >
              View Job
            </button>

          </div>

        ))}

      </div>

    </div>

  );

}

export default Jobs;
