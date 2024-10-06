import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Footer from "../components/Footer";
import {
  Container,
  Row,
  Col,
  Form,
  Button,
  Alert,
  Card,
  InputGroup,
} from "react-bootstrap";

const AccountPage = ({ setIsAuthenticated }) => {
  const [anonymousName, setAnonymousName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState(null);
  const [accountCreatedAt, setAccountCreatedAt] = useState("");
  const userId = localStorage.getItem("userId");
  const [ano_error, setano_Error] = useState("");
  const [totalSecrets, setTotalSecrets] = useState(0);
  const [totalLikes, setTotalLikes] = useState(0);
  const [feedbackMessage, setFeedbackMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("isAuthenticated")) {
      navigate("/login");
    }
  }, []);

  const fetchUserStats = async () => {
    try {
      const response = await fetch(
        `https://secrets-server-fgfd.onrender.com/user/stats/${userId}`
      );
      if (!response.ok) {
        throw new Error("Failed to fetch user stats");
      }
      const data = await response.json();
      // Update your state with the fetched data
      setTotalSecrets(data.totalSecrets);
      setTotalLikes(data.totalLikes);
    } catch (error) {
      console.error("Failed to fetch user stats:", error);
    }
  };

  const fetchUserData = async () => {
    try {
      const response = await fetch(
        `https://secrets-crud-app-api.vercel.app/user/${userId}`,
        {
          method: "GET",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await response.json();

      setAnonymousName(data.anonymous_name);
      setAccountCreatedAt(
        new Date(data.created_at).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      );
      setEmail(data.username);
    } catch (err) {
      console.error(err);
      setError(err.message); // Handle errors
    }
  };

  useEffect(() => {
    fetchUserData();
    fetchUserStats();
  }, []);

  const handleLogout = async () => {
    setIsAuthenticated(false); // Update authentication state
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userId");
    localStorage.removeItem("anonymousName");
    navigate("/login"); // Redirect after logout
  };

  const handleDeleteAccount = async () => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete your account? This action cannot be undone."
    );

    if (isConfirmed) {
      try {
        const response = await fetch(
          `https://secrets-crud-app-api.vercel.app/delete/${userId}`,
          {
            method: "DELETE",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          setMessage("Your account has been deleted.");
          handleLogout(); // Logout after successful account deletion
        } else {
          const errorData = await response.json();
          setError(errorData.message || "Failed to delete the account.");
        }
      } catch (err) {
        setError("An error occurred while trying to delete your account.");
      }
    }
  };

  const validateAnonymousName = (value) => {
    // Validate the username for alphabets, numbers, and underscores only
    const isValid = /^[a-zA-Z0-9_]+$/.test(value);
    if (!isValid && value !== "") {
      setano_Error(
        "Username can only contain letters, numbers, and underscores."
      );
      return false;
    } else {
      setano_Error("");
      return true;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateAnonymousName(anonymousName)) {
      try {
        const response = await fetch(
          `https://secrets-crud-app-api.vercel.app/user/${userId}/anonymous-name`,
          {
            method: "PUT",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ anonymousName }),
          }
        );

        const updatedUser = await response.json();
        if (response.ok) {
          setMessage("Updated Successfully!");
          setError("");
          setAnonymousName(updatedUser.anonymous_name);
          localStorage.removeItem("anonymousName");
          localStorage.setItem("anonymousName", anonymousName);
        } else {
          setError(updatedUser.message);
        }
      } catch (error) {
        console.log("error: ", error);
        if (error.response) {
          setError(error.response.data.message); // Set error message from server response
        } else {
          setError("An unexpected error occurred."); // Generic error message
        }
      }
    } else {
      !anonymousName && setano_Error("Enter Username");
    }
  };

  const handleFeedbackSubmit = () => {
    // handle feedback
  };

  return (
    <div id="root">
      <main>
        <Container style={{ marginTop: "60px" }}>
          <h2 className="text-center mb-4">Your Account</h2>

          {error && <Alert variant="danger">{error}</Alert>}
          {message && <Alert variant="success">{message}</Alert>}
          <Row>
            <Col md={3}>
              <Card
                className="mb-4 p-3 shadow-sm sticky-top"
                style={{ top: "60px" }}
              >
                <h4 className="mb-3">Account Details</h4>
                <p className="mb-2">
                  <strong>Account Created On:</strong> {accountCreatedAt}
                </p>
                <p className="mb-2">
                  <strong>Email Address:</strong> {email}
                </p>
              </Card>
            </Col>
            <Col md={5}>
              <Card
                className="p-4 mb-4 shadow-sm rounded"
                style={{ backgroundColor: "#343a40", color: "#ffffff" }}
              >
                <Card.Body>
                  <h4 className="mb-3 text-center">App Usage Stats</h4>
                  <ul className="list-unstyled text-center">
                    <li className="mb-2">
                      <span className="fw-bold">Total Secrets Posted:</span>{" "}
                      {totalSecrets}
                    </li>
                    <li>
                      <span className="fw-bold">Total Whispers Received:</span>{" "}
                      {totalLikes}
                    </li>
                  </ul>
                </Card.Body>
              </Card>

              <Card
                className="mb-4 p-4 shadow-sm"
                style={{
                  backgroundColor: "#343a40",
                  color: "#ffffff",
                  width: "100%",
                }}
              >
                <Card.Body>
                  <h4 className="mb-3">Update Anonymous Name</h4>
                  <div className="d-flex flex-column align-items-center">
                    <Form onSubmit={handleSubmit} style={{ width: "100%" }}>
                      <Form.Group className="mb-3">
                        <InputGroup>
                          <InputGroup.Text>@</InputGroup.Text>{" "}
                          {/* Prepend @ symbol */}
                          <Form.Control
                            type="text"
                            id="anonymousName"
                            placeholder="anonymous"
                            value={anonymousName}
                            className={`form-control ${
                              ano_error ? "is-invalid" : ""
                            }`}
                            onChange={(e) => {
                              setAnonymousName(e.target.value);
                              // Validate function can be added here
                            }}
                            required
                          />
                        </InputGroup>
                        {ano_error && (
                          <div className="invalid-feedback">{ano_error}</div>
                        )}
                        <small className="form-text text-light">
                          Please do not include any personal information.
                        </small>
                      </Form.Group>
                      <Button
                        variant="primary"
                        type="submit"
                        className="w-100 mt-3"
                      >
                        Save Changes
                      </Button>
                    </Form>
                  </div>
                </Card.Body>
              </Card>

              <Card
                className="mb-4 p-4 shadow-sm"
                style={{ backgroundColor: "#dc3545", color: "#ffffff" }}
              >
                <Card.Body>
                  <h4 className="mb-3">Permanently Delete Your Account</h4>
                  <Button
                    variant="light"
                    className="w-100 mt-3"
                    onClick={handleDeleteAccount}
                  >
                    Delete Account
                  </Button>
                  <span
                    style={{
                      color: "lightgray",
                      marginTop: "5px",
                      display: "block",
                    }}
                  >
                    All the data will be lost. This cannot be reversed.
                  </span>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card
                className="mb-4 p-4 shadow-sm sticky-top"
                style={{ top: "65px" }}
              >
                <h4 className="mb-3">Tutorial / Help Section</h4>
                <p>
                  Welcome to our application! Here are some quick tips to get
                  you started:
                </p>
                <ul className="list-unstyled">
                  <li>
                    <strong>Creating a Secret:</strong> Click on the "Create
                    Secret" button in the Dashboard to post your thoughts
                    anonymously.
                  </li>
                  <li>
                    <strong>Viewing Whispers:</strong> You can view the whispers
                    you've received on your account page.
                  </li>
                  <li>
                    <strong>Viewing Other's Secrets:</strong> You can scroll the
                    secrets in the home tab.
                  </li>
                  <li>
                    <strong>Getting Help:</strong> If you have any questions,
                    feel free to reach out through the Feedback section.
                  </li>
                </ul>
              </Card>
            </Col>
          </Row>
          <Row>
            <Col md={2}></Col>
            <Col md={8}>
              <Card className="mb-4 p-4 shadow-sm" style={{ width: "100%" }}>
                <h4 className="mb-3">Feedback</h4>
                <Form onSubmit={handleFeedbackSubmit} style={{ width: "100%" }}>
                  <Form.Group className="mb-3">
                    <Form.Label htmlFor="feedbackMessage">
                      Your Feedback
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      id="feedbackMessage"
                      rows={3}
                      value={feedbackMessage}
                      onChange={(e) => setFeedbackMessage(e.target.value)}
                      required
                      style={{ width: "100%" }} // Ensure the textarea takes full width
                    />
                  </Form.Group>
                  <Button
                    variant="primary"
                    type="submit"
                    className="w-100 mt-3"
                  >
                    Submit Feedback
                  </Button>
                </Form>
              </Card>
            </Col>
          </Row>
        </Container>
      </main>
      <footer>
        <Footer />
      </footer>
    </div>
  );
};

export default AccountPage;
