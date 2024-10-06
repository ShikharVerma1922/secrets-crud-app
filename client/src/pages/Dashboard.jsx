import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import { Modal, Button, Alert } from "react-bootstrap";
import AddPost from "../components/AddPost";
import UserPosts from "../components/UserPost";
import Footer from "../components/Footer";
import UserBookmarks from "../components/Bookmarks";

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const [hovered, setHovered] = useState(false);
  const [selectedValue, setSelectedValue] = useState("posts");

  const handleRadioChange = (event) => {
    const selected = event.target.value;
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Smooth scroll effect
    });
    setSelectedValue(selected);
  };

  // Functions to handle modal open and close
  const handleOpenModal = () => {
    setShowSuccess(false);
    setShowModal(true);
  };
  const handleCloseModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("https://secrets-crud-app-api.vercel.app/users", {
          credentials: "include", // Include cookies (session ID)
        });
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/");
      }
    };
    checkAuth();
  }, [navigate]);

  if (!isAuthenticated) {
    return <div>Loading...</div>;
  }

  return (
    <div
      style={{
        position: "absolute",
        backgroundColor: "#f8f9fa",
        padding: "20px 0px 0px 0px",
        minHeight: "100vh",
        width: "100vw",
        marginTop: "60px",
      }}
      id="root"
    >
      <main>
        <div
          className="start-post rounded-pill d-flex justify-content-start align-items-center p-3 post-btn-width"
          onClick={handleOpenModal}
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
          style={{
            cursor: "pointer",
            margin: "auto",
            marginBottom: "10px",
            border: "solid black 1px",
            fontWeight: "bold",
            backgroundColor: hovered ? "#f0f0f0" : "white",
          }}
        >
          <p style={{ margin: "0" }}>Share a Secret...</p>
        </div>

        {showSuccess && (
          <div className="d-flex justify-content-center">
            <Alert
              variant="success"
              onClose={() => setShowSuccess(false)}
              dismissible
              className="post-btn-width"
            >
              Post created successfully!
            </Alert>
          </div>
        )}

        {/* This is the sticky radio button group */}
        <div
          className="d-flex justify-content-center sticky-top"
          style={{ zIndex: 1020, top: "60px" }}
        >
          <div
            className="btn-group"
            role="group"
            aria-label="Basic radio toggle button group"
            style={{ backgroundColor: "white" }}
          >
            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio1"
              value="posts"
              autoComplete="off"
              checked={selectedValue === "posts"}
              onChange={handleRadioChange}
            />
            <label className="btn btn-outline-secondary" htmlFor="btnradio1">
              Posts
            </label>

            <input
              type="radio"
              className="btn-check"
              name="btnradio"
              id="btnradio2"
              value="bookmarks"
              autoComplete="off"
              checked={selectedValue === "bookmarks"}
              onChange={handleRadioChange}
            />
            <label className="btn btn-outline-secondary" htmlFor="btnradio2">
              Bookmarks
            </label>
          </div>
        </div>

        {/* Render based on selected value */}
        <div>
          {selectedValue === "posts" && (
            <UserPosts newPost={showSuccess} allPost={false} />
          )}
          {selectedValue === "bookmarks" && <UserBookmarks />}
        </div>

        {/* Modal for creating a new post */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg">
          <Modal.Header closeButton>
            <Modal.Title>Create a New Post</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <AddPost
              closeModal={handleCloseModal}
              setShowSuccess={setShowSuccess}
            />
          </Modal.Body>
        </Modal>
      </main>

      <footer>
        <Footer />
      </footer>
    </div>
  );
}

export default Dashboard;
