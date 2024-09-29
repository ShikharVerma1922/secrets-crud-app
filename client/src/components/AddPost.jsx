import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import "bootstrap/dist/css/bootstrap.css";

const AddPost = ({ closeModal, setShowSuccess }) => {
  const [content, setContent] = useState("");
  const [showError, setShowError] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (content.trim()) {
      console.log(content);
      const userId = localStorage.getItem("userId");

      const response = await fetch(
        "https://secrets-server-fgfd.onrender.com/post-secret",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ user_id: userId, content: content.trim() }),
          credentials: "include",
        }
      );
      const data = await response.json();

      if (response.ok) {
        setShowSuccess(true);
        console.log(data.message);
      } else {
        // Handle error
        setShowError(true);
      }
      !showError && closeModal();
    }
  };

  return (
    <div>
      {showError && (
        <Alert variant="danger" onClose={() => setShowError(false)} dismissible>
          Failed to create post
        </Alert>
      )}

      <form onSubmit={handleSubmit} style={{ width: "100%" }}>
        <div className="form-group">
          <textarea
            type="textarea"
            value={content}
            className="form-control"
            rows="10"
            placeholder="Write your secret..."
            onChange={(e) => {
              setContent(e.target.value);
            }}
            style={{
              outline: "none",
              boxShadow: "none",
              border: "0",
              resize: "none",
            }}
            maxLength={600}
            required
            autoFocus
          ></textarea>
        </div>
        <div className="d-flex justify-content-between border-top">
          <small className="text-muted">
            {600 - content.length} characters remaining
          </small>
          <button
            className={`btn ${
              content.trim() ? "btn-primary" : "btn-secondary"
            } mt-3 rounded-pill fw-bold`}
            onClick={handleSubmit}
          >
            Post
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddPost;
