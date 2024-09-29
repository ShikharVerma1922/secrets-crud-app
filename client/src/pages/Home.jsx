import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.css";
import UserPosts from "../components/UserPost";
import Footer from "../components/Footer";

const Home = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch(
          "https://secrets-server-fgfd.onrender.com/users",
          {
            credentials: "include", // Include cookies (session ID)
          }
        );
        if (response.ok) {
          setIsAuthenticated(true);
        } else {
          navigate("/login");
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        navigate("/");
      } finally {
        setIsLoading(false);
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
        top: "50px",
        backgroundColor: "#f8f9fa",
        padding: "20px 0px 0px 0px",
        minHeight: "100vh",
        width: "100vw",
      }}
    >
      {isLoading ? (
        <div className="loader">Loading...</div> // You can customize this loading spinner
      ) : (
        <div id="root">
          <main>
            <div>
              <UserPosts newPost={false} allPost={true} />
            </div>
          </main>
          <footer>
            <Footer />
          </footer>
        </div>
      )}
    </div>
  );
};

export default Home;
