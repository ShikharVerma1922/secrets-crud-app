import React, { useRef } from "react";
import { Outlet, Link, NavLink } from "react-router-dom";
import LogoutButton from "../components/LogoutButton";
import "bootstrap/dist/css/bootstrap.css";
import "bootstrap/dist/js/bootstrap.bundle";
import { FaUserCircle, FaUserSecret } from "react-icons/fa";
import { MdVerifiedUser, MdVerified } from "react-icons/md";
import "../App.css";

const Layout = ({ children, isAuthenticated, setIsAuthenticated }) => {
  const navButton = useRef(null);
  const linksContainerRef = useRef(null);
  const anonymousName = localStorage.getItem("anonymousName");

  function collapseNav() {
    navButton.current.classList.add("collapsed");
    linksContainerRef.current.classList.remove("show");
  }

  return (
    <div>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark fixed-top">
        <div className="container-fluid">
          <a className="navbar-brand d-flex align-items-center" href="/">
            <span className="me-1" style={{ fontSize: "18px" }}>
              <FaUserSecret />
            </span>
            <span style={{ fontWeight: "bold" }}>Secrets</span>
          </a>
          <button
            ref={navButton}
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div
            ref={linksContainerRef}
            className="collapse navbar-collapse"
            id="navbarNav"
          >
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <NavLink
                  onClick={collapseNav}
                  to="/"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  aria-current="page"
                >
                  Home
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  onClick={collapseNav}
                  to="/dashboard"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  Dashboard
                </NavLink>
              </li>

              <li className="nav-item">
                <NavLink
                  onClick={collapseNav}
                  to="/about"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                >
                  About
                </NavLink>
              </li>
              <li className="nav-item">
                <NavLink
                  onClick={collapseNav}
                  to="/contact"
                  className={({ isActive }) =>
                    isActive ? "nav-link active" : "nav-link"
                  }
                  aria-current="page"
                >
                  Contact
                </NavLink>
              </li>
            </ul>
            <ul className="navbar-nav me-3">
              {isAuthenticated ? (
                <>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle "
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      @{anonymousName}
                      <MdVerifiedUser style={{ marginLeft: "5px" }} />
                    </a>
                    <ul className="dropdown-menu">
                      <li>
                        <a className="dropdown-item" href="/account">
                          <FaUserCircle style={{ marginRight: "6px" }} />
                          Account
                        </a>
                      </li>
                      <li>
                        <hr className="dropdown-divider"></hr>
                      </li>
                      <li>
                        <a className="dropdown-item">
                          <LogoutButton
                            setIsAuthenticated={setIsAuthenticated}
                          />
                        </a>
                      </li>
                    </ul>
                  </li>
                </>
              ) : (
                <>
                  <li className="nav-item">
                    <NavLink
                      onClick={collapseNav}
                      to="/login"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      Login
                    </NavLink>
                  </li>
                  <li className="nav-item">
                    <NavLink
                      onClick={collapseNav}
                      to="/signup"
                      className={({ isActive }) =>
                        isActive ? "nav-link active" : "nav-link"
                      }
                    >
                      Sign Up
                    </NavLink>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </nav>

      <Outlet />
    </div>
  );
};

export default Layout;
