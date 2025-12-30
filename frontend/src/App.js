import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [feedbacks, setFeedbacks] = useState([]);

  // Fetch feedback on page load
  useEffect(() => {
    fetch("http://localhost:5000/api/feedback")
      .then(res => res.json())
      .then(data => setFeedbacks(data))
      .catch(err => console.log(err));
  }, []);

  const submitFeedback = async (e) => {
    e.preventDefault();

    const newFeedback = { name, message };

    await fetch("http://localhost:5000/api/feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newFeedback)
    });

    setFeedbacks([...feedbacks, newFeedback]);
    setName("");
    setMessage("");
  };

  return (
    <div className="container">
      <h2>Student Feedback Tracker</h2>

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

        <button type="submit">Submit Feedback</button>
      </form>

      <div className="feedback-list">
        <h3>All Feedback</h3>
        {feedbacks.map((fb, index) => (
          <div className="feedback-card" key={index}>
            <strong>{fb.name}</strong>
            <p>{fb.message}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
