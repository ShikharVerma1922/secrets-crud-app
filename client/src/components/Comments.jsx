import React, { useState, useEffect } from "react";
import { formatDistanceToNowStrict } from "date-fns";
import { Modal, Button, Form } from "react-bootstrap";
import { IoIosSend } from "react-icons/io";
import { FaRegCommentDots } from "react-icons/fa";

// CommentsButton Component
const CommentsButton = ({ post, onCommentsUpdated }) => {
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [error, setError] = useState("");

  const handleShow = () => {
    setAnimateModal(true);
    setShowModal(true);
  };
  const handleClose = () => {
    setAnimateModal(false); // Start slide-down animation
    setTimeout(() => setShowModal(false), 500);
    setError("");
    setNewComment("");
  };

  const getShortTimeAgo = (date) => {
    const distance = formatDistanceToNowStrict(new Date(date), {
      addSuffix: true,
    });

    if (distance.includes("minute")) {
      return `${distance.replace(" minutes", "m")}`;
    } else if (distance.includes("hour")) {
      return `${distance.replace(" hours", "h")}`;
    } else if (distance.includes("day")) {
      return `${distance.replace(" days", "d")}`;
    } else if (distance.includes("month")) {
      return `${distance.replace(" months", "mo")}`;
    } else if (distance.includes("year")) {
      return `${distance.replace(" years", "y")}`;
    }
    return distance;
  };

  useEffect(() => {
    if (showModal) {
      const fetchComments = async () => {
        try {
          const response = await fetch(
            `https://secrets-crud-app-api.vercel.app/posts/${post.id}/comments`,
            {
              method: "GET",
              credentials: "include",
            }
          );

          if (!response.ok) {
            throw new Error("Failed to fetch comments");
          }

          const data = await response.json();
          setComments(data);
        } catch (err) {
          console.error(err);
          setError("Error fetching comments");
        }
      };

      fetchComments();
    }
  }, [showModal, post.id]);

  const fetchCommentCount = async () => {
    try {
      const response = await fetch(
        `https://secrets-crud-app-api.vercel.app/posts/${post.id}/comments/count`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch comment count");
      }

      const data = await response.json();
      onCommentsUpdated(data.totalComments);
    } catch (err) {
      console.error(err);
      setError("Error fetching comment count");
    }
  };

  // Handle adding a new comment
  const handleAddComment = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `https://secrets-crud-app-api.vercel.app/posts/${post.id}/comments`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            comment_text: newComment,
            user_id: localStorage.getItem("userId"), // Assuming userId is stored in localStorage
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to add comment");
      }

      const addedComment = await response.json();
      setComments((prevComments) => [...prevComments, addedComment]);
      setNewComment(""); // Reset input field
      fetchCommentCount();
      handleClose();
    } catch (err) {
      console.error(err);
      setError("Error adding comment");
    }
  };

  useEffect(() => {
    fetchCommentCount();
  }, [post.id]);

  return (
    <>
      <button
        onClick={handleShow}
        className="rounded-pill border-0 p-2 text-muted"
        style={{ backgroundColor: "transparent" }}
      >
        <div className="like_dislike" style={{ fontWeight: "bold" }}>
          <FaRegCommentDots /> Comment
        </div>
      </button>

      {showModal && (
        <Modal
          show={showModal}
          onHide={handleClose}
          dialogClassName={`bottom-slide-modal ${
            animateModal ? "show" : "hide"
          }`}
          backdropClassName="modal-backdrop"
          aria-labelledby="contained-modal-title-vcenter"
          //   centered
        >
          <Modal.Header closeButton className="p-1">
            <Modal.Title>Comments</Modal.Title>
          </Modal.Header>
          <Modal.Body className="p-0 px-2">
            {/* Original Post */}
            {/* <div className="mb-4">
              <h5>Original Post</h5>
              <div style={{ whiteSpace: "pre-wrap" }}>{post.content}</div>
            </div> */}

            {/* Comments Section */}
            <div className="comments-section">
              {/* <h5>Comments</h5> */}
              {error && <p className="text-danger">{error}</p>}
              {comments.length > 0 ? (
                comments.map((comment) => (
                  <div key={comment.id} className="pb-3 border-bottom">
                    <div className="d-flex justify-content-start gap-1 text-muted">
                      <small>@{comment.anonymous_name}</small> <br />
                      <small>•</small>
                      <small>{getShortTimeAgo(comment.created_at)}</small>
                    </div>

                    <div
                      style={{ whiteSpace: "pre-wrap", paddingLeft: "15px" }}
                    >
                      {comment.comment_text}
                    </div>
                  </div>
                ))
              ) : (
                <p>No comments yet.</p>
              )}
            </div>

            {/* Add New Comment */}
            <div className="fixed-input-area">
              <Form
                onSubmit={handleAddComment}
                className="d-flex justify-content-between"
                style={{ width: "100%", marginTop: "5px" }}
              >
                <Form.Group style={{ width: "100%" }}>
                  <Form.Control
                    as="textarea"
                    rows={1}
                    maxLength={200}
                    value={newComment}
                    placeholder="Add a comment..."
                    onChange={(e) => setNewComment(e.target.value)}
                    required
                    style={{
                      width: "100%",
                      resize: "none",
                      overflow: "hidden",
                    }}
                  />
                </Form.Group>
                <Button
                  type="submit"
                  className="rounded-pill ms-2"
                  style={{ color: "white" }}
                >
                  <IoIosSend size={20} />
                </Button>
              </Form>
            </div>
          </Modal.Body>
        </Modal>
      )}
    </>
  );
};

export default CommentsButton;
