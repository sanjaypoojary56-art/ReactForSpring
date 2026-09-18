import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div className="home-content">
          <p className="home-kicker">JOBSPHERE</p>
          <h1>Find jobs that match your skills.</h1>
          <p className="home-description">
            JobSphere is a job portal for students and job seekers to discover
            opportunities, match their skills with jobs, and manage applications
            in one place.
          </p>
          <div className="home-actions">
            <Link className="home-primary" to="/jobs">Browse Jobs</Link>
            <Link className="home-secondary" to="/register">Create Account</Link>
          </div>
        </div>
      </section>

      <section className="home-features" aria-label="JobSphere features">
        <article>
          <h2>Discover Jobs</h2>
          <p>Explore available job opportunities in one place.</p>
        </article>
        <article>
          <h2>Skill Matching</h2>
          <p>Compare your skills with the requirements of a job.</p>
        </article>
        <article>
          <h2>Track Applications</h2>
          <p>Keep your job applications and their status organized.</p>
        </article>
      </section>
    </main>
  );
}

export default Home;
