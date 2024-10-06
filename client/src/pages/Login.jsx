import React, { useEffect } from "react";
import Form from "../components/Form";
import "bootstrap/dist/css/bootstrap.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://secrets-crud-app-api.vercel.app/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false); // Update authentication state
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("anonymousName");
      navigate("/login"); // Redirect after logout
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("isAuthenticated")) {
      handleLogout();
    }
  }, []);

  return (
    <div
      className="d-flex justify-content-center align-items-center"
      style={{
        backgroundColor: "#f7f7f7",
        height: "100vh",
        background: "linear-gradient(to right, #f7f9fc, #e6e9ff)",
      }}
    >
      <div
        className="p-4 rounded shadow"
        style={{ backgroundColor: "#ffffff", height: "fit-content" }}
      >
        <h1 style={{}}>Login to Your Account</h1>
        <Form register={false} setIsAuthenticated={setIsAuthenticated} />
        <p className="mt-3">
          Don't have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => {
              navigate("/signup");
            }}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
