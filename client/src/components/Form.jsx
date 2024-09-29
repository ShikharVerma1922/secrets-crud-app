import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "../App.css";

const Form = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [anonymousName, setAnonymousName] = useState("");
  const [message, setMessage] = useState("");
  const [successfulMsg, setSuccessfulMsg] = useState("");
  let navigate = useNavigate();
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const validateAnonymousName = (value) => {
    // Validate the username for alphabets, numbers, and underscores only
    const isValid = /^[a-zA-Z0-9_]+$/.test(value);
    if (!isValid && value !== "") {
      setError("Username can only contain letters, numbers, and underscores.");
      return false;
    } else {
      setError("");
      return true;
    }
  };

  const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // Simple regex for basic email validation
    return regex.test(email);
  };

  const handleEmailChange = (e) => {
    if (!validateEmail(e)) {
      setEmailError("Invalid email address.");
    } else {
      setEmailError(""); // Clear error if valid
    }
  };

  const validatePassword = (password) => {
    return password.length >= 6; // Check for minimum length of 6
  };

  const handlePasswordChange = (e) => {
    if (!validatePassword(e)) {
      setPasswordError("Password must be at least 6 characters long.");
      return false;
    } else {
      setPasswordError(""); // Clear error if valid
      return true;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); // Prevent the default form submission

    if (
      (validateAnonymousName(anonymousName) || !props.register) &&
      validateEmail(username) &&
      validatePassword(password)
    ) {
      axios
        .post(
          props.register
            ? "https://secrets-server-fgfd.onrender.com/register"
            : "https://secrets-server-fgfd.onrender.com/login",
          props.register
            ? {
                username: username,
                password: password,
                anonymousName: anonymousName,
              }
            : {
                username: username,
                password: password,
              },
          {
            headers: {
              "Content-Type": "application/json",
            },
            withCredentials: true, // Send cookies along with the request
          }
        )
        .then((res) => {
          console.log(res.data.user.id);
          props.setIsAuthenticated(true);
          localStorage.setItem("isAuthenticated", "true");
          localStorage.setItem("userId", res.data.user.id);
          localStorage.setItem("anonymousName", res.data.user.anonymous_name);
          navigate("/dashboard");
        })
        .catch((error) => {
          console.log("error: ", error);
          if (error.response) {
            setMessage(error.response.data.message); // Set error message from server response
          } else {
            setMessage("An unexpected error occurred."); // Generic error message
          }
        });
    } else {
      username ? handleEmailChange(username) : setEmailError("Enter email");
      password
        ? handlePasswordChange(password)
        : setPasswordError("Enter password");
      !anonymousName && setError("Enter Username");
    }
  };

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit(e);
        }}
      >
        {props.register && (
          <div className="form-group">
            <label htmlFor="anonymousName">Anonymous Name</label>
            <input
              type="text"
              id="anonymousName"
              placeholder="anonymous"
              value={anonymousName}
              className={`form-control ${error ? "is-invalid" : ""}`} // Add Bootstrap invalid class if error
              onChange={(e) => {
                setAnonymousName(e.target.value);
                validateAnonymousName(e.target.value);
              }}
              required
            />
            {error && <div className="invalid-feedback">{error}</div>}{" "}
            <small className="form-text text-muted">
              Please do not include any personal information.
            </small>
          </div>
        )}
        <div className="form-group mt-2">
          <label htmlFor="username">Email</label>
          <input
            type="email"
            id="username"
            placeholder="username@email.com"
            value={username}
            className="form-control"
            onChange={(e) => setUsername(e.target.value)}
            required
          />
          {emailError && <div className="text-danger">{emailError}</div>}
        </div>
        <div className="form-group mt-2">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            placeholder="·········"
            className="form-control"
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {passwordError && <div className="text-danger">{passwordError}</div>}
        </div>
        {message && <div className="mt-2 text-danger">{message}</div>}
        <div className="d-grid">
          <button
            type="submit"
            onClick={(e) => {
              handleSubmit(e);
            }}
            className={`btn ${
              props.register ? "btn-primary" : "btn-success"
            } mt-4`}
          >
            {props.register ? "Sign Up" : "Login"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Form;
