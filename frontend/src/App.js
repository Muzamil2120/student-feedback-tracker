import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const API_BASE_URL = "http://localhost:5000";

  // Fetch feedback on page load
  useEffect(() => {
    let isMounted = true;

    const loadFeedbacks = async () => {
      setIsLoading(true);
      setError("");
      try {
        const res = await fetch(`${API_BASE_URL}/api/feedback`);
        if (!res.ok) {
          throw new Error(`Failed to load feedback (${res.status})`);
        }
        const data = await res.json();
        if (isMounted) setFeedbacks(Array.isArray(data) ? data : []);
      } catch (err) {
        if (isMounted) setError(err?.message || "Failed to load feedback");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    loadFeedbacks();

    return () => {
      isMounted = false;
    };
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();
    setError("");

    const newFeedback = { name, message };

    setIsSubmitting(true);
    try {
      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newFeedback),
      });

      if (!res.ok) {
        let details = "";
        try {
          const body = await res.json();
          details = body?.error ? `: ${body.error}` : "";
        } catch {
          // ignore
        }
        throw new Error(`Failed to submit feedback (${res.status})${details}`);
      }

      const savedFeedback = await res.json();
      setFeedbacks((prev) => [savedFeedback, ...prev]);
      setName("");
      setMessage("");
    } catch (err) {
      setError(err?.message || "Failed to submit feedback");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container">
      <h2>Student Feedback Tracker</h2>

      {error ? (
        <div className="alert" role="alert" style={{ marginBottom: 12 }}>
          {error}
        </div>
      ) : null}

      <form onSubmit={submitFeedback}>
        <input
          type="text"
          placeholder="Your Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <textarea
          placeholder="Your Feedback"
          value={message}
          onChange={e => setMessage(e.target.value)}
          required
        />

        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit Feedback"}
        </button>
      </form>

      <div className="feedback-list">
        <h3>All Feedback</h3>

        {isLoading ? (
          <div className="feedback-card">
            <p>Loading feedback…</p>
          </div>
        ) : null}

        {!isLoading && feedbacks.length === 0 ? (
          <div className="feedback-card">
            <p>No feedback yet. Be the first to submit!</p>
          </div>
        ) : null}

        {feedbacks.map((fb, index) => (
          <div className="feedback-card" key={fb._id || index}>
            <strong>{fb.name}</strong>
            <p>{fb.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
