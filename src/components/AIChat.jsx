import { useEffect, useRef, useState } from "react";
import "./AIChat.css";

const API_URL = `${import.meta.env.VITE_API_URL}/ai/chat`;

function AIChat() {

  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      id: crypto.randomUUID(),
      sender: "ai",
      type: "TEXT",
      text: "Hi! I'm your JobSphere AI assistant. Ask me about jobs, applications, skills, or anything related to your career."
    }
  ]);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const token = localStorage.getItem("token");


  /* =========================================
     LOCK MAIN PAGE WHEN CHAT IS OPEN
  ========================================= */

  useEffect(() => {

    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };

  }, [open]);


  /* =========================================
     AUTO SCROLL
  ========================================= */

  useEffect(() => {

    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth"
    });

  }, [messages, loading]);


  /* =========================================
     TEXTAREA RESIZE
  ========================================= */

  const resizeTextarea = () => {

    const textarea = textareaRef.current;

    if (!textarea) return;

    textarea.style.height = "auto";

    textarea.style.height =
      Math.min(textarea.scrollHeight, 120) + "px";
  };


  /* =========================================
     SEND MESSAGE
  ========================================= */

  const sendMessage = async () => {

    const text = message.trim();

    if (!text || loading) {
      return;
    }

    setMessages(previous => [
      ...previous,
      {
        id: crypto.randomUUID(),
        sender: "user",
        type: "TEXT",
        text
      }
    ]);

    setMessage("");

    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }

    setLoading(true);

    try {

      const response = await fetch(
        API_URL,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`
          },

          body: JSON.stringify({
            message: text
          })
        }
      );


      if (!response.ok) {

        if (response.status === 401) {
          throw new Error(
            "Your session has expired. Please login again."
          );
        }

        throw new Error(
          `AI request failed (${response.status})`
        );
      }


      const data = await response.json();


      /*
       * Backend response:
       *
       * {
       *   type,
       *   message,
       *   jobs,
       *   app
       * }
       */


      setMessages(previous => [
        ...previous,
        {
          id: crypto.randomUUID(),
          sender: "ai",

          type: data.type || "TEXT",

          text: data.message || "",

          jobs:
            Array.isArray(data.jobs)
              ? data.jobs
              : [],

          app:
            Array.isArray(data.app)
              ? data.app
              : []
        }
      ]);


    } catch (error) {

      console.error("AI error:", error);

      setMessages(previous => [
        ...previous,
        {
          id: crypto.randomUUID(),
          sender: "ai",
          type: "TEXT",
          text:
            error.message ||
            "Sorry, I couldn't process your request.",
          jobs: [],
          app: []
        }
      ]);

    } finally {

      setLoading(false);

    }
  };


  /* =========================================
     ENTER KEY
  ========================================= */

  const handleKeyDown = event => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();
    }
  };


  /* =========================================
     SUGGESTION
  ========================================= */

  const useSuggestion = suggestion => {

    setMessage(suggestion);

    setTimeout(() => {
      textareaRef.current?.focus();
    }, 0);
  };


  return (
    <>

      {!open && (

        <button
          className="ai-launcher"
          onClick={() => setOpen(true)}
          aria-label="Open JobSphere AI"
        >

          <span className="ai-launcher-icon">
            ✦
          </span>

          <span className="ai-launcher-text">
            Ask AI
          </span>

        </button>

      )}


      {open && (

        <section
          className="ai-chat"
          aria-label="JobSphere AI assistant"
        >

          {/* HEADER */}

          <header className="ai-header">

            <div className="ai-brand">

              <div className="ai-brand-logo">
                ✦
              </div>

              <div>

                <h2>
                  JobSphere AI
                </h2>

                <p>
                  Career assistant
                </p>

              </div>

            </div>


            <button
              className="ai-close"
              onClick={() => setOpen(false)}
              aria-label="Close AI"
            >
              ×
            </button>

          </header>


          {/* MESSAGES */}

          <main className="ai-body">

            {messages.map(item => (

              <Message
                key={item.id}
                message={item}
              />

            ))}


            {loading && (

              <div className="ai-row">

                <AIAvatar />

                <div className="ai-bubble typing">

                  <span />
                  <span />
                  <span />

                </div>

              </div>

            )}

            <div ref={messagesEndRef} />

          </main>


          {/* SUGGESTIONS */}

          <div className="ai-suggestions">

            <button
              onClick={() =>
                useSuggestion(
                  "Which jobs match my skills?"
                )
              }
            >
              Jobs for me
            </button>

            <button
              onClick={() =>
                useSuggestion(
                  "What skills should I learn?"
                )
              }
            >
              Skills to learn
            </button>

            <button
              onClick={() =>
                useSuggestion(
                  "Show my applications"
                )
              }
            >
              My applications
            </button>

          </div>


          {/* INPUT */}

          <div className="ai-input-wrapper">

            <textarea
              ref={textareaRef}
              value={message}

              onChange={event => {

                setMessage(event.target.value);

                resizeTextarea();

              }}

              onKeyDown={handleKeyDown}

              placeholder="Ask about jobs, skills or applications..."

              rows={1}

              disabled={loading}
            />

            <button
              className="ai-send"
              onClick={sendMessage}
              disabled={
                !message.trim() ||
                loading
              }
              aria-label="Send message"
            >
              ↑
            </button>

          </div>


          <footer className="ai-footer">
            AI-generated information may contain mistakes.
          </footer>

        </section>

      )}

    </>
  );
}


/* =====================================================
   MESSAGE
===================================================== */

function Message({ message }) {

  const isUser =
    message.sender === "user";


  if (isUser) {

    return (

      <div className="ai-row user-row">

        <div className="user-bubble">
          {message.text}
        </div>

      </div>

    );
  }


  return (

    <div className="ai-row">

      <AIAvatar />

      <div className="ai-content">

        {/* ALWAYS DISPLAY BACKEND MESSAGE */}

        {message.text && (

          <div className="ai-bubble">
            {message.text}
          </div>

        )}


        {/* DISPLAY DATA ONLY ACCORDING TO TYPE */}

        {renderAIData(
          message.type,
          message.jobs,
          message.app
        )}

      </div>

    </div>

  );
}


/* =====================================================
   AI AVATAR
===================================================== */

function AIAvatar() {

  return (
    <div className="ai-avatar">
      ✦
    </div>
  );
}


/* =====================================================
   RESPONSE RENDERER
===================================================== */

function renderAIData(
  type,
  jobs,
  app
) {

  switch (type) {

    /* -----------------------------------------
       GENERAL
       Only message
    ----------------------------------------- */

    case "GENERAL":
      return null;


    /* -----------------------------------------
       TEXT
       Only message
    ----------------------------------------- */

    case "TEXT":
      return null;


    /* -----------------------------------------
       JOBS
    ----------------------------------------- */

    case "JOBS":

      return (
        <JobList
          jobs={jobs}
        />
      );


    /* -----------------------------------------
       APPLICATIONS
    ----------------------------------------- */

    case "APPLICATIONS":

    case "APPLIED":

      return (
        <ApplicationList
          applications={app}
        />
      );


    /* -----------------------------------------
       BOTH
    ----------------------------------------- */

    case "BOTH":

      return (
        <>

          <JobList
            jobs={jobs}
          />

          <ApplicationList
            applications={app}
          />

        </>
      );


    /* -----------------------------------------
       SKILL GAP
    ----------------------------------------- */

    case "SKILL_GAP":

      return (
        <SkillGap
          data={app}
        />
      );


    /* -----------------------------------------
       SKILL RECOMMENDATIONS
    ----------------------------------------- */

    case "SKILL_RECOMENDATIONS":

    case "SKILL_RECOMMENDATIONS":

      return (
        <SkillRecommendations
          data={app}
        />
      );


    default:
      return null;
  }
}


/* =====================================================
   JOB LIST
===================================================== */

function JobList({ jobs }) {

  if (!jobs || jobs.length === 0) {

    return (
      <div className="ai-empty-card">
        No matching jobs were found.
      </div>
    );
  }


  return (

    <div className="ai-card-list">

      {jobs.map((job, index) => (

        <JobCard
          key={
            job.jobid ??
            job.id ??
            index
          }
          job={job}
        />

      ))}

    </div>
  );
}


/* =====================================================
   JOB CARD
===================================================== */

function JobCard({ job }) {

  const jobId =
    job.jobid ??
    job.id;


  const title =
    job.title ||
    "Untitled Job";


  const description =
    job.description ||
    job.discription ||
    "No description available.";


  const location =
    job.location ||
    "Location not specified";


  const match =
    job.matchPercentage ??
    job.match ??
    job.matchPercent;


  return (

    <article className="job-card">

      <div className="job-card-top">

        <div className="job-icon">

          {title
            .charAt(0)
            .toUpperCase()}

        </div>


        <div className="job-heading">

          <h3>
            {title}
          </h3>

          {job.company && (
            <span>
              {job.company}
            </span>
          )}

        </div>


        {match !== undefined && (

          <div className="match-badge">
            {match}%
          </div>

        )}

      </div>


      <p className="job-description">
        {description}
      </p>


      <div className="job-meta">

        <span>
          📍 {location}
        </span>

        {job.salary && (
          <span>
            ₹{job.salary}
          </span>
        )}

      </div>


      {Array.isArray(job.skills) &&
        job.skills.length > 0 && (

        <div className="job-skills">

          {job.skills.map(
            (skill, index) => (

              <span key={index}>

                {typeof skill === "string"
                  ? skill
                  : skill.name}

              </span>

            )
          )}

        </div>

      )}


      {jobId && (

        <button
          className="job-view-button"
          onClick={() =>
            window.location.href =
              `/jobs/${jobId}`
          }
        >

          View Job

          <span>
            →
          </span>

        </button>

      )}

    </article>

  );
}


/* =====================================================
   SKILL GAP
===================================================== */

function SkillGap({ data }) {

  const skills =
    Array.isArray(data)
      ? data
      : data?.missingSkills || [];


  if (!skills.length) {

    return (
      <div className="ai-result-card success-card">

        <strong>
          No major skill gaps found.
        </strong>

        <span>
          Your current skills match the available requirements well.
        </span>

      </div>
    );
  }


  return (

    <div className="ai-result-card">

      <div className="result-title">
        Skills you may need
      </div>


      <div className="skill-gap-list">

        {skills.map((skill, index) => {

          const name =
            typeof skill === "string"
              ? skill
              : skill.name;


          const importance =
            typeof skill === "object"
              ? skill.importance
              : null;


          return (

            <div
              className="skill-gap-item"
              key={index}
            >

              <span>
                {name}
              </span>

              {importance && (

                <small>
                  {importance}
                </small>

              )}

            </div>

          );

        })}

      </div>

    </div>

  );
}


/* =====================================================
   SKILL RECOMMENDATIONS
===================================================== */

function SkillRecommendations({ data }) {

  const skills =
    Array.isArray(data)
      ? data
      : data?.skills || [];


  if (!skills.length) {

    return (
      <div className="ai-result-card success-card">

        <strong>
          No skill recommendations found.
        </strong>

      </div>
    );
  }


  return (

    <div className="ai-result-card">

      <div className="result-title">
        Recommended skills
      </div>


      {skills.map((skill, index) => {

        const name =
          typeof skill === "string"
            ? skill
            : skill.name;


        const reason =
          typeof skill === "object"
            ? skill.reason
            : null;


        return (

          <div
            className="recommendation-item"
            key={index}
          >

            <div className="recommendation-number">
              {index + 1}
            </div>

            <div>

              <strong>
                {name}
              </strong>

              {reason && (
                <p>
                  {reason}
                </p>
              )}

            </div>

          </div>

        );

      })}

    </div>

  );
}


/* =====================================================
   APPLICATION LIST
===================================================== */

function ApplicationList({
  applications
}) {

  if (
    !applications ||
    applications.length === 0
  ) {

    return (
      <div className="ai-empty-card">
        You haven't applied for any jobs yet.
      </div>
    );
  }


  return (

    <div className="ai-card-list">

      {applications.map(
        (application, index) => (

          <ApplicationCard
            key={
              application.id ??
              index
            }
            application={application}
          />

        )
      )}

    </div>

  );
}


/* =====================================================
   APPLICATION CARD
===================================================== */

function ApplicationCard({
  application
}) {

  const user =
    application.user || {};


  const job =
    application.job || {};


  const userName =
    user.name ||
    user.username ||
    user.email ||
    "Applicant";


  const jobTitle =
    job.title ||
    application.jobTitle ||
    "Job";


  const status =
    application.status ||
    "Pending";


  const normalizedStatus =
    String(status)
      .toLowerCase()
      .replace(/\s+/g, "-");


  return (

    <article className="application-card">

      <div className="application-main">

        <div className="application-icon">

          {jobTitle
            .charAt(0)
            .toUpperCase()}

        </div>


        <div>

          <h3>
            {jobTitle}
          </h3>

          <p>
            {userName}
          </p>


          {job.location && (

            <span className="application-location">

              📍 {job.location}

            </span>

          )}

        </div>

      </div>


      <div className="application-bottom">

        <span
          className={
            `status-badge status-${normalizedStatus}`
          }
        >

          {status}

        </span>

      </div>

    </article>

  );
}


export default AIChat;