import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"; // Example icons
import developerImage from "../assets/DP.jpeg";

const AboutDeveloper = () => {
  return (
    <Container style={{ marginTop: "60px" }}>
      <h1 className="text-center mb-4">About the Developer</h1>
      <Row className="justify-content-center">
        <Col md={4} className="text-center">
          <img
            src={developerImage} // Replace with your photo URL
            alt="Developer"
            style={{ width: "200px", height: "200px" }}
            className="img-fluid rounded-circle mb-3"
          />
          <h2>Shikhar Verma</h2>
          <p className="text-muted">Web Developer</p>
          <p>
            Hello! I'm Shikhar, a passionate developer exploring the world of
            web technologies. I love creating innovative and user-friendly
            applications while continuously improving my skills.
          </p>
          <div className="mt-3">
            <a
              href="https://github.com/ShikharVerma1922"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark me-3"
            >
              <FaGithub size={24} />
            </a>
            <a
              href="https://x.com/Shikhar2704"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark me-3"
            >
              <FaTwitter size={24} />
            </a>
            <a
              href="https://www.linkedin.com/in/shikhar-verma-964355280"
              target="_blank"
              rel="noopener noreferrer"
              className="text-dark"
            >
              <FaLinkedin size={24} />
            </a>
          </div>
        </Col>
      </Row>
      <Row className="mt-5">
        <Col>
          <h3>About the Secrets App</h3>
          <p>
            I created the Secrets app as a part of my learning journey as a web
            developer. The app allows users to share their secrets anonymously
            and interact with each other's posts. I aimed to create a platform
            that fosters community and openness.
          </p>
          <h4>Technologies Used:</h4>
          <ul>
            <li>Frontend: React, Bootstrap</li>
            <li>Backend: Node.js, Express</li>
            <li>Database: PostgreSQL</li>
            <li>Authentication: Passport.js</li>
            <li>Styling: CSS</li>
            <li>Version Control: Git, GitHub</li>
          </ul>
          <p>
            Through this project, I gained valuable experience in full-stack
            development and learned how to manage state, handle user input, and
            create responsive designs.
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default AboutDeveloper;
