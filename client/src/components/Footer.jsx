import React from "react";
import { Container, Row, Col } from "react-bootstrap";
import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa"; // Example icons

const Footer = () => {
  return (
    <footer className="bg-dark text-light mt-5 p-4">
      <Container>
        <Row>
          <Col md={6}>
            <h5>About the Developer</h5>
            <p>
              This app was created by Shikhar Verma, a web developer learning
              and exploring new technologies. Feel free to reach out!
            </p>
          </Col>
          <Col md={6} className="text-md-end">
            <h5>Connect with Me</h5>
            <div>
              <a
                href="https://github.com/ShikharVerma1922"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light me-3"
              >
                <FaGithub size={24} />
              </a>
              <a
                href="https://x.com/Shikhar2704"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light me-3"
              >
                <FaTwitter size={24} />
              </a>
              <a
                href="https://www.linkedin.com/in/shikhar-verma-964355280"
                target="_blank"
                rel="noopener noreferrer"
                className="text-light"
              >
                <FaLinkedin size={24} />
              </a>
            </div>
            <div className="mt-2">
              <a href="/developer" className="text-light">
                About the Developer
              </a>
            </div>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
