import React, { useEffect } from "react";
import Form from "../components/Form";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Signup = ({ setIsAuthenticated }) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await axios.post(
        "https://secrets-server-fgfd.onrender.com/logout",
        {},
        { withCredentials: true }
      );
      setIsAuthenticated(false); // Update authentication state
      localStorage.removeItem("isAuthenticated");
      localStorage.removeItem("userId");
      localStorage.removeItem("anonymousName");
      navigate("/signup"); // Redirect after logout
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
        <h1 style={{}}>Create an Account</h1>
        <Form register={true} setIsAuthenticated={setIsAuthenticated} />
        <p className="mt-3">
          Already have an account?{" "}
          <span
            style={{ cursor: "pointer", color: "blue" }}
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
